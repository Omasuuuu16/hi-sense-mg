/**
 * Standalone script: generate promotional PNG images for all laptops.
 * Usage: node scripts/generate-images.js
 * Requires: npm install puppeteer
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'product-template.html');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'generated');
const PRODUCTS_PATH = path.join(__dirname, '..', 'public', 'data', 'products.json');
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function modelToSlug(model) {
    const brand = model.split(' ')[0]?.toLowerCase() || 'device';
    const numbers = model.match(/\d+/g)?.join('') || '';
    const series = model.match(/(?:elitebook|latitude|thinkpad|probook|inspiron|optiplex)\s*(\w+)/i)?.[1]?.toLowerCase() || '';
    const suffix = numbers || series || model.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase();
    return `${brand}${suffix}`.replace(/[^a-z0-9]/g, '');
}

function parseSpecs(specs) {
    const cpu = specs.match(/(?:Ci|Core\s*i|i)[3579][\s-]?\d+/i)?.[0] || '—';
    const ramM = specs.match(/Ram\s*(\d+)\s*gb/i) || specs.match(/(\d+)\s*gb/i);
    const ram = ramM ? `${ramM[1]}GB` : '—';
    const ssdM = specs.match(/SSD\s*(\d+)\s*(gb|tb)/i);
    const ssd = ssdM ? `${ssdM[1]}${ssdM[2]}` : '—';
    const dispM = specs.match(/(\d+(?:\.\d+)?)\s*["″]?\s*FHD/i);
    const display = dispM ? `${dispM[1]}" FHD` : '—';
    return { cpu, ram, ssd, display };
}

function fillTemplate(html, product) {
    const parsed = parseSpecs(product.specs || '');
    const img = product.image?.startsWith('http')
        ? product.image
        : `${BASE_URL}${product.image || '/images/laptops/Dell Latitude 5420.jpg'}`;

    return html
        .replace(/\{\{MODEL\}\}/g, product.model.toUpperCase())
        .replace(/\{\{CPU\}\}/g, parsed.cpu)
        .replace(/\{\{RAM\}\}/g, parsed.ram.replace(/GB/i, ''))
        .replace(/\{\{SSD\}\}/g, parsed.ssd.replace(/gb|tb/i, m => m.toLowerCase()))
        .replace(/\{\{DISPLAY\}\}/g, parsed.display)
        .replace(/\{\{PRICE\}\}/g, Number(product.price).toLocaleString('en-US'))
        .replace(/\{\{LAPTOP_IMAGE\}\}/g, img);
}

async function main() {
    const puppeteer = require('puppeteer');
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
    const laptops = products.filter(p => p.category === 'Laptop');

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });

    console.log(`Generating ${laptops.length} laptop images...`);

    for (const product of laptops) {
        const slug = modelToSlug(product.model);
        const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
        const html = fillTemplate(template, product);
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.screenshot({ path: outPath, type: 'png' });
        console.log(`  ✓ ${product.model} → generated/${slug}.png`);
    }

    await browser.close();
    console.log('Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
