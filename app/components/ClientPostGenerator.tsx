"use client";

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { StoreProduct } from '../lib/redis-store';
import { parseSpecs, modelToSlug } from '../lib/specs-parser';

export interface ClientPostGeneratorRef {
    generatePost: (products: StoreProduct[], categories: string[] | undefined, postText: string) => Promise<void>;
}

export const ClientPostGenerator = forwardRef<ClientPostGeneratorRef, { onProgress: (msg: string) => void }>((props, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
        generatePost: async (products, categories, postText) => {
            try {
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

                props.onProgress('Fetching templates...');
                
                const laptopRes = await fetch('/templates/product-template.html');
                const pcRes = await fetch('/templates/pc-template.html');
                if (!laptopRes.ok || !pcRes.ok) {
                    throw new Error('Failed to load HTML templates from /templates/');
                }
                const laptopTemplate = await laptopRes.text();
                const pcTemplate = await pcRes.text();

                let filtered = products;
                if (categories && categories.length > 0) {
                    const lowerCats = new Set(categories.map(c => c.toLowerCase()));
                    filtered = products.filter(p => lowerCats.has(p.category.toLowerCase()));
                }

                const laptops = filtered.filter(p => p.category.toLowerCase() === 'laptop');
                const pcs = filtered.filter(p => p.category.toLowerCase() === 'pc');

                const zip = new JSZip();
                
                const waitForImages = (node: HTMLElement) => {
                    return Promise.all(Array.from(node.querySelectorAll('img')).map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    }));
                };

                const saveFile = async (filename: string, dataUrl: string | null, textData: string | null) => {
                    if (useZip) {
                        if (dataUrl) {
                            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
                            zip.file(filename, base64Data, { base64: true });
                        } else if (textData) {
                            zip.file(filename, textData);
                        }
                    } else if (targetFolderHandle) {
                        const fileHandle = await targetFolderHandle.getFileHandle(filename, { create: true });
                        const writable = await fileHandle.createWritable();
                        if (dataUrl) {
                            const blob = await (await fetch(dataUrl)).blob();
                            await writable.write(blob);
                        } else if (textData) {
                            await writable.write(textData);
                        }
                        await writable.close();
                    }
                };

                const generateNode = async (htmlStr: string, filename: string) => {
                    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
                    
                    const doc = iframeRef.current.contentDocument;
                    doc.open();
                    doc.write(htmlStr);
                    doc.close();
                    
                    await waitForImages(doc.body);
                    
                    // Delay for fonts to load inside the iframe
                    await new Promise(r => setTimeout(r, 800));

                    const dataUrl = await toPng(doc.body, {
                        quality: 1,
                        pixelRatio: 1,
                        cacheBust: true,
                        width: 1080,
                        height: 1350,
                        style: {
                            margin: '0',
                            padding: '0',
                        }
                    });
                    
                    await saveFile(filename, dataUrl, null);
                    
                    doc.open();
                    doc.write('');
                    doc.close();
                };

                for (let i = 0; i < laptops.length; i++) {
                    const product = laptops[i];
                    props.onProgress(`Generating Laptop ${i + 1}/${laptops.length}: ${product.model}...`);
                    
                    const parsed = parseSpecs(product.specs, product.model);
                    const cpu = parsed.cpu || product.cpu || '—';
                    const ram = (parsed.ram || product.ram || '—').replace(/GB/i, '');
                    const ssd = (parsed.ssd || product.ssd || '—').replace(/GB|TB/i, m => m.toLowerCase());
                    const display = parsed.display || product.display || '—';

                    let html = laptopTemplate
                        .replace(/\{\{MODEL\}\}/g, product.model.toUpperCase())
                        .replace(/\{\{CPU\}\}/g, cpu)
                        .replace(/\{\{RAM\}\}/g, ram)
                        .replace(/\{\{SSD\}\}/g, ssd)
                        .replace(/\{\{DISPLAY\}\}/g, display)
                        .replace(/\{\{PRICE\}\}/g, product.price.toLocaleString('en-US'))
                        .replace(/\{\{LAPTOP_IMAGE\}\}/g, product.image || '/images/laptops/HP.jpg');

                    const slug = modelToSlug(product.model);
                    await generateNode(html, `laptop_${slug}.png`);
                }

                for (let i = 0; i < pcs.length; i++) {
                    const product = pcs[i];
                    props.onProgress(`Generating PC Part ${i + 1}/${pcs.length}: ${product.model}...`);
                    
                    let html = pcTemplate
                        .replace(/\{\{MODEL\}\}/g, product.model.toUpperCase())
                        .replace(/\{\{SPECS\}\}/g, product.specs || product.model)
                        .replace(/\{\{PRICE\}\}/g, product.price.toLocaleString('en-US'))
                        .replace(/\{\{PC_IMAGE\}\}/g, product.image || '/images/pc/SSD 256GB NVME WD.jpg');

                    const slug = modelToSlug(product.model);
                    await generateNode(html, `pc_${slug}.png`);
                }

                props.onProgress('Saving text file...');
                await saveFile('post.txt', null, postText);
                
                if (useZip) {
                    props.onProgress('Compressing images into ZIP...');
                    const blob = await zip.generateAsync({ type: 'blob' });
                    const dateStr = new Date().toISOString().slice(0, 10);
                    saveAs(blob, `Post-Generation-${dateStr}.zip`);
                }

                props.onProgress('Done!');
            } catch (err) {
                console.error("ClientPostGenerator error:", err);
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
                opacity: 1 // Must be 1 to prevent html-to-image from capturing empty transparent bounds
            }}
        />
    );
});
