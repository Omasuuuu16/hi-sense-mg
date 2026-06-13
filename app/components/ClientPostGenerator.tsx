"use client";

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { StoreProduct } from '../lib/redis-store';
import { parseSpecs, modelToSlug } from '../lib/specs-parser';
import { getSmartLaptopImage, getSmartPcImage, getStringHash } from '../lib/image-utils';

export interface ClientPostGeneratorRef {
    generatePost: (products: StoreProduct[], categories: string[] | undefined, postText: string) => Promise<void>;
}

/** Split a full HTML document string into head content and body content. */
function splitTemplate(fullHtml: string): { headHtml: string; bodyHtml: string } {
    const headMatch = fullHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return {
        headHtml: headMatch ? headMatch[1] : '',
        bodyHtml: bodyMatch ? bodyMatch[1] : fullHtml,
    };
}

/** Yield to the browser event loop so GC / layout engine can breathe. */
const yieldToBrowser = () => new Promise<void>(r => setTimeout(r, 0));

export const ClientPostGenerator = forwardRef<ClientPostGeneratorRef, { onProgress: (msg: string) => void }>((props, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
        generatePost: async (products, categories, postText) => {
            try {
                /* ── 1. Folder / ZIP setup ──────────────────────────────── */
                let dirHandle: any = null;
                let targetFolderHandle: any = null;
                let useZip = true;

                if ('showDirectoryPicker' in window) {
                    try {
                        dirHandle = await (window as any).showDirectoryPicker({
                            mode: 'readwrite',
                            id: 'hi-sense-post-generation',
                        });
                        useZip = false;

                        const dateStr = new Date().toISOString().slice(0, 10);
                        let suffix = '';
                        let counter = 1;
                        let foundNew = false;

                        while (!foundNew) {
                            const folderName = `${dateStr}${suffix}`;
                            try {
                                await dirHandle.getDirectoryHandle(folderName);
                                counter++;
                                suffix = `(${counter})`;
                            } catch (e: any) {
                                if (e.name === 'NotFoundError') {
                                    targetFolderHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });
                                    foundNew = true;
                                } else {
                                    throw e;
                                }
                            }
                        }
                    } catch (e: any) {
                        if (e.name === 'AbortError') {
                            throw new Error('Folder selection was cancelled. Generation aborted.');
                        }
                        console.warn('Directory picker failed, falling back to ZIP:', e);
                        useZip = true;
                    }
                }

                /* ── 2. Load templates ──────────────────────────────────── */
                props.onProgress('Fetching templates...');

                const [laptopRes, pcRes] = await Promise.all([
                    fetch('/templates/product-template.html'),
                    fetch('/templates/pc-template.html'),
                ]);
                if (!laptopRes.ok || !pcRes.ok) {
                    throw new Error('Failed to load HTML templates from /templates/');
                }
                const laptopTemplate = await laptopRes.text();
                const pcTemplate = await pcRes.text();

                /* ── 3. Filter products ─────────────────────────────────── */
                let filtered = products;
                if (categories && categories.length > 0) {
                    const lowerCats = new Set(categories.map(c => c.toLowerCase()));
                    filtered = products.filter(p => lowerCats.has(p.category.toLowerCase()));
                }

                const laptops = filtered.filter(p => p.category.toLowerCase() === 'laptop');
                const pcs     = filtered.filter(p => p.category.toLowerCase() === 'pc');

                /* ── 4. ZIP helper ──────────────────────────────────────── */
                const zip = new JSZip();

                const saveFile = async (filename: string, dataUrl: string | null, textData: string | null) => {
                    if (useZip) {
                        if (dataUrl) {
                            zip.file(filename, dataUrl.replace(/^data:image\/png;base64,/, ''), { base64: true });
                        } else if (textData) {
                            zip.file(filename, textData);
                        }
                    } else if (targetFolderHandle) {
                        const fileHandle = await targetFolderHandle.getFileHandle(filename, { create: true });
                        const writable  = await fileHandle.createWritable();
                        if (dataUrl) {
                            const blob = await (await fetch(dataUrl)).blob();
                            await writable.write(blob);
                        } else if (textData) {
                            await writable.write(textData);
                        }
                        await writable.close();
                    }
                };

                /* ── 5. Initialise the persistent iframe ONCE ───────────── */
                // Instead of doc.open()/write()/close() on every render
                // (which recreates the document and accumulates canvas memory),
                // we initialise the iframe document a single time via srcdoc,
                // then update doc.head and doc.body in-place for each item.
                // This preserves the rendering context, avoids GC pressure, and
                // keeps the template CSS applied directly to doc.body so that
                // html-to-image captures the correct dark background.
                props.onProgress('Initialising render context...');

                const iframe = iframeRef.current!;
                await new Promise<void>(resolve => {
                    iframe.onload = () => resolve();
                    iframe.srcdoc = '<!DOCTYPE html><html><head></head><body></body></html>';
                });

                const iframeDoc = iframe.contentDocument!;

                const waitForImages = (node: HTMLElement) =>
                    Promise.all(
                        Array.from(node.querySelectorAll('img')).map(img => {
                            if (img.complete) return Promise.resolve();
                            return new Promise(resolve => {
                                img.onload  = resolve;
                                img.onerror = resolve;
                            });
                        })
                    );

                /* ── 6. Render helper ───────────────────────────────────── */
                let fontsLoaded = false;

                const generateNode = async (htmlStr: string, filename: string) => {
                    const { headHtml, bodyHtml } = splitTemplate(htmlStr);

                    // Update head (styles / font imports) in-place
                    iframeDoc.head.innerHTML = headHtml;

                    // Update body content in-place — no document recreation,
                    // so no canvas accumulation. The template's body { } CSS
                    // applies directly to iframeDoc.body.
                    iframeDoc.body.innerHTML = bodyHtml;

                    await waitForImages(iframeDoc.body);

                    // First render: wait for Google Fonts to load inside the iframe.
                    // Subsequent renders: fonts already cached, 150 ms is enough.
                    await new Promise(r => setTimeout(r, fontsLoaded ? 150 : 900));
                    fontsLoaded = true;

                    const dataUrl = await toPng(iframeDoc.body, {
                        quality: 1,
                        pixelRatio: 1,
                        cacheBust: true,
                        width: 1080,
                        height: 1350,
                        style: { margin: '0', padding: '0' },
                    });

                    await saveFile(filename, dataUrl, null);
                };

                /* ── 7. Generate laptop images ──────────────────────────── */
                const origin = window.location.origin;
                let skipped  = 0;

                for (let i = 0; i < laptops.length; i++) {
                    const product = laptops[i];
                    props.onProgress(`Generating Laptop ${i + 1}/${laptops.length}: ${product.model}...`);

                    try {
                        const parsed  = parseSpecs(product.specs, product.model);
                        const cpu     = parsed.cpu     || product.cpu     || '—';
                        const ram     = (parsed.ram    || product.ram     || '—').replace(/GB/i, '');
                        const ssd     = (parsed.ssd    || product.ssd     || '—').replace(/GB|TB/i, m => m.toLowerCase());
                        const display = parsed.display || product.display || '—';

                        const hash      = getStringHash(product.model + '-' + (product.id || String(i)));
                        const laptopImg = origin + getSmartLaptopImage(product.brand || 'HP', product.model, hash);

                        const html = laptopTemplate
                            .replace(/\{\{MODEL\}\}/g,        product.model.toUpperCase())
                            .replace(/\{\{CPU\}\}/g,          cpu)
                            .replace(/\{\{RAM\}\}/g,          ram)
                            .replace(/\{\{SSD\}\}/g,          ssd)
                            .replace(/\{\{DISPLAY\}\}/g,      display)
                            .replace(/\{\{PRICE\}\}/g,        product.price.toLocaleString('en-US'))
                            .replace(/\{\{LAPTOP_IMAGE\}\}/g, laptopImg);

                        await generateNode(html, `laptop_${modelToSlug(product.model)}.png`);
                    } catch (itemErr) {
                        console.warn(`Skipped laptop "${product.model}":`, itemErr);
                        skipped++;
                    }

                    // Yield every 10 items to allow browser GC to run
                    if ((i + 1) % 10 === 0) await yieldToBrowser();
                }

                /* ── 8. Generate PC part images ─────────────────────────── */
                for (let i = 0; i < pcs.length; i++) {
                    const product = pcs[i];
                    props.onProgress(`Generating PC Part ${i + 1}/${pcs.length}: ${product.model}...`);

                    try {
                        const pcHash = getStringHash(product.model + '-' + (product.id || String(i)));
                        const pcImg  = origin + getSmartPcImage(product.model, pcHash);

                        const html = pcTemplate
                            .replace(/\{\{MODEL\}\}/g,    product.model.toUpperCase())
                            .replace(/\{\{SPECS\}\}/g,    product.specs || product.model)
                            .replace(/\{\{PRICE\}\}/g,    product.price.toLocaleString('en-US'))
                            .replace(/\{\{PC_IMAGE\}\}/g, pcImg);

                        await generateNode(html, `pc_${modelToSlug(product.model)}.png`);
                    } catch (itemErr) {
                        console.warn(`Skipped PC part "${product.model}":`, itemErr);
                        skipped++;
                    }

                    // Yield every 10 items to allow browser GC to run
                    if ((i + 1) % 10 === 0) await yieldToBrowser();
                }

                /* ── 9. Save post text & ZIP ────────────────────────────── */
                props.onProgress('Saving text file...');
                await saveFile('post.txt', null, postText);

                if (useZip) {
                    props.onProgress('Compressing images into ZIP...');
                    const blob    = await zip.generateAsync({ type: 'blob' });
                    const dateStr = new Date().toISOString().slice(0, 10);
                    saveAs(blob, `Post-Generation-${dateStr}.zip`);
                }

                if (skipped > 0) {
                    console.warn(`Generation complete. ${skipped} item(s) skipped.`);
                }
                props.onProgress('Done!');

            } catch (err) {
                console.error('ClientPostGenerator error:', err);
                throw err;
            }
        }
    }));

    return (
        <iframe
            ref={iframeRef}
            title="image-generator-sandbox"
            style={{
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
                zIndex: -9999,
                width: '1080px',
                height: '1350px',
                border: 'none',
                // opacity MUST be 1 — html-to-image skips invisible elements
                opacity: 1,
            }}
        />
    );
});
