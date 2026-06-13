import fs from 'fs';
import path from 'path';
import type { StoreProduct } from './redis-store';
import { modelToSlug, parseSpecs } from './specs-parser';

const LAPTOP_TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'product-template.html');
const PC_TEMPLATE_PATH     = path.join(process.cwd(), 'templates', 'pc-template.html');

/** Root "Post generation" folder in the project directory */
const POST_GEN_ROOT = path.join(process.cwd(), 'Post generation');

/** Legacy output dir for the old public/generated flow (kept for backward compat) */
const OUTPUT_DIR = process.env.VERCEL === '1'
    ? path.join('/tmp', 'generated')
    : path.join(process.cwd(), 'public', 'generated');

export interface GeneratedImage {
    model: string;
    slug: string;
    filename: string;
    publicPath: string;
    absolutePath: string;
}

export interface GeneratePostResult {
    folderPath: string;
    textFilePath: string;
    laptopsGenerated: number;
    pcsGenerated: number;
    totalImages: number;
    errors: string[];
}

// ─────────────────────────────────────────────
//  BRAND → IMAGE FILE MAPPING (Laptops)
// ─────────────────────────────────────────────

/** Map a laptop product to its best-matching local image path (relative to /images/laptops/). */
function resolveLaptopBrandImage(product: StoreProduct): string {
    const model = (product.model || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();

    const combined = `${brand} ${model}`.toLowerCase();

    // ThinkPad (Lenovo sub-brand — check before generic Lenovo)
    if (combined.includes('thinkpad')) {
        return combined.includes('x1') || combined.includes('x13') || combined.includes('t14')
            ? '/images/laptops/thinkpad2.jpg'
            : '/images/laptops/thinkpad.jpg';
    }

    // Lenovo LOQ / gaming
    if (combined.includes('loq') || combined.includes('legion') || combined.includes('ideapad gaming')) {
        return '/images/laptops/lenovoLOQ.jpg';
    }

    // Generic Lenovo — alternate between 2 images based on price parity
    if (combined.includes('lenovo') || brand === 'lenovo') {
        return (product.price % 2 === 0)
            ? '/images/laptops/Lenovo.avif'
            : '/images/laptops/Lenovo2.avif';
    }

    // HP — alternate between 2 images
    if (combined.includes(' hp') || brand === 'hp' || combined.startsWith('hp')) {
        return (product.price % 2 === 0)
            ? '/images/laptops/HP.jpg'
            : '/images/laptops/HP2.avif';
    }

    // Dell — 3 images available
    if (combined.includes('dell') || brand === 'dell') {
        const idx = Math.abs(product.model.charCodeAt(0)) % 3;
        return ['/images/laptops/Dell.png', '/images/laptops/Dell2.avif', '/images/laptops/Dell3.avif'][idx];
    }

    // ASUS
    if (combined.includes('asus') || brand === 'asus') {
        return '/images/laptops/asus.png';
    }

    // Fallback for any other brand (Acer, Samsung, MSI, etc.)
    // Use HP.jpg as generic fallback — clean, high quality
    return '/images/laptops/HP.jpg';
}

// ─────────────────────────────────────────────
//  LAPTOP TEMPLATE FILL
// ─────────────────────────────────────────────

function fillLaptopTemplate(html: string, product: StoreProduct, laptopImageUrl: string): string {
    const parsed = parseSpecs(product.specs, product.model);
    const cpu     = parsed.cpu     || product.cpu     || '—';
    const ram     = (parsed.ram    || product.ram     || '—').replace(/GB/i, '');
    const ssd     = (parsed.ssd    || product.ssd     || '—').replace(/GB|TB/i, (m) => m.toLowerCase());
    const display = parsed.display || product.display || '—';

    return html
        .replace(/\{\{MODEL\}\}/g,        product.model.toUpperCase())
        .replace(/\{\{CPU\}\}/g,          cpu)
        .replace(/\{\{RAM\}\}/g,          ram)
        .replace(/\{\{SSD\}\}/g,          ssd)
        .replace(/\{\{DISPLAY\}\}/g,      display)
        .replace(/\{\{PRICE\}\}/g,        Number(product.price).toLocaleString('en-US'))
        .replace(/\{\{LAPTOP_IMAGE\}\}/g, laptopImageUrl);
}

// ─────────────────────────────────────────────
//  PC TEMPLATE FILL
// ─────────────────────────────────────────────

function fillPcTemplate(html: string, product: StoreProduct, productImageUrl: string): string {
    const specs = product.specs || product.model || '—';

    return html
        .replace(/\{\{MODEL\}\}/g,         product.model.toUpperCase())
        .replace(/\{\{SPECS\}\}/g,         specs)
        .replace(/\{\{PRICE\}\}/g,         Number(product.price).toLocaleString('en-US'))
        .replace(/\{\{PRODUCT_IMAGE\}\}/g, productImageUrl);
}

// ─────────────────────────────────────────────
//  URL RESOLVERS
// ─────────────────────────────────────────────

function resolveLaptopImageUrl(product: StoreProduct, baseUrl: string): string {
    // Always use brand-based mapping for laptops — stored product.image
    // may contain old paths that no longer exist. Only use an explicit
    // HTTP URL if one is stored (e.g. from an external source).
    if (product.image && product.image.startsWith('http')) {
        return product.image;
    }
    const img = resolveLaptopBrandImage(product);
    return `${baseUrl.replace(/\/$/, '')}${img}`;
}

function resolvePcImageUrl(product: StoreProduct, baseUrl: string): string {
    // PC images are named exactly like the product model in /images/pc/
    if (product.image && product.image.trim()) {
        const img = product.image.trim();
        if (img.startsWith('http')) return img;
        return `${baseUrl.replace(/\/$/, '')}${img.startsWith('/') ? img : `/${img}`}`;
    }

    // Try to match by model name to the pc images folder
    const modelName = product.model.trim();
    const pcImagesDir = path.join(process.cwd(), 'images', 'pc');
    const extensions = ['.jpg', '.jpeg', '.png', '.avif', '.webp'];

    for (const ext of extensions) {
        const candidate = path.join(pcImagesDir, `${modelName}${ext}`);
        if (fs.existsSync(candidate)) {
            return `${baseUrl.replace(/\/$/, '')}/images/pc/${encodeURIComponent(modelName)}${ext}`;
        }
    }

    // Fallback: generic icon
    return `${baseUrl.replace(/\/$/, '')}/images/pc/SSD 256GB NVME WD.jpg`;
}

// ─────────────────────────────────────────────
//  SINGLE IMAGE RENDER
// ─────────────────────────────────────────────

export async function generateProductImage(
    product: StoreProduct,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
): Promise<GeneratedImage> {
    if (!fs.existsSync(LAPTOP_TEMPLATE_PATH)) {
        throw new Error(`Laptop template not found: ${LAPTOP_TEMPLATE_PATH}`);
    }

    const template = fs.readFileSync(LAPTOP_TEMPLATE_PATH, 'utf-8');
    const slug = modelToSlug(product.model);
    const filename = `${slug}.png`;
    const absolutePath = path.join(OUTPUT_DIR, filename);
    const publicPath = `/generated/${filename}`;

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const laptopImageUrl = resolveLaptopImageUrl(product, baseUrl);
    const html = fillLaptopTemplate(template, product, laptopImageUrl);

    await renderHtmlToPng(html, absolutePath);

    return { model: product.model, slug, filename, publicPath, absolutePath };
}

export async function generateLaptopImages(
    products: StoreProduct[],
    baseUrl?: string
): Promise<GeneratedImage[]> {
    const laptops = products.filter(p => p.category.toLowerCase() === 'laptop');
    const results: GeneratedImage[] = [];

    for (const product of laptops) {
        try {
            const img = await generateProductImage(product, baseUrl);
            results.push(img);
        } catch (err) {
            console.error(`Failed to generate image for ${product.model}:`, err);
        }
    }

    return results;
}

// ─────────────────────────────────────────────
//  GENERATE POST — ALL PRODUCTS → DATE FOLDER
// ─────────────────────────────────────────────

/**
 * Generate a dated "Post generation" folder with:
 *  - One PNG per laptop (branded spec card)
 *  - One PNG per PC component (product card)
 *  - A post.txt with the full post text
 *
 * @param products      All products from the store
 * @param postText      Pre-rendered post text
 * @param baseUrl       Base URL for resolving images
 * @param categories    Optional filter — only generate images for these
 *                      categories (e.g. ['Laptop'] or ['PC'] or ['Laptop','PC']).
 *                      If empty/undefined, generate ALL.
 */
export async function generatePost(
    products: StoreProduct[],
    postText: string,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    categories?: string[]
): Promise<GeneratePostResult> {
    // ── Prepare templates ─────────────────────────
    if (!fs.existsSync(LAPTOP_TEMPLATE_PATH)) {
        throw new Error(`Laptop template not found: ${LAPTOP_TEMPLATE_PATH}`);
    }
    if (!fs.existsSync(PC_TEMPLATE_PATH)) {
        throw new Error(`PC template not found: ${PC_TEMPLATE_PATH}`);
    }

    const laptopTemplate = fs.readFileSync(LAPTOP_TEMPLATE_PATH, 'utf-8');
    const pcTemplate     = fs.readFileSync(PC_TEMPLATE_PATH, 'utf-8');

    // ── Create date folder ───────────────────────
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    
    let folderPath = path.join(POST_GEN_ROOT, dateStr);
    if (fs.existsSync(folderPath)) {
        let suffix = 2;
        while (fs.existsSync(path.join(POST_GEN_ROOT, `${dateStr}(${suffix})`))) {
            suffix++;
        }
        folderPath = path.join(POST_GEN_ROOT, `${dateStr}(${suffix})`);
    }

    fs.mkdirSync(folderPath, { recursive: true });

    const errors: string[] = [];
    let laptopsGenerated = 0;
    let pcsGenerated = 0;

    // ── Apply category filter ─────────────────────
    let filtered = products;
    if (categories && categories.length > 0) {
        const lowerCats = new Set(categories.map(c => c.toLowerCase()));
        filtered = products.filter(p => lowerCats.has(p.category.toLowerCase()));
    }

    // ── Generate laptop images ───────────────────
    const laptops = filtered.filter(p => p.category.toLowerCase() === 'laptop');
    for (const product of laptops) {
        try {
            const slug = modelToSlug(product.model);
            const filename = `laptop_${slug}.png`;
            const outputPath = path.join(folderPath, filename);

            const imageUrl = resolveLaptopImageUrl(product, baseUrl);
            const html = fillLaptopTemplate(laptopTemplate, product, imageUrl);
            await renderHtmlToPng(html, outputPath);
            laptopsGenerated++;
        } catch (err) {
            const msg = `Laptop [${product.model}]: ${err instanceof Error ? err.message : String(err)}`;
            console.error(msg);
            errors.push(msg);
        }
    }

    // ── Generate PC component images ─────────────
    const pcs = filtered.filter(p => p.category.toLowerCase() === 'pc');
    for (const product of pcs) {
        try {
            const slug = modelToSlug(product.model);
            const filename = `pc_${slug}.png`;
            const outputPath = path.join(folderPath, filename);

            const imageUrl = resolvePcImageUrl(product, baseUrl);
            const html = fillPcTemplate(pcTemplate, product, imageUrl);
            await renderHtmlToPng(html, outputPath);
            pcsGenerated++;
        } catch (err) {
            const msg = `PC [${product.model}]: ${err instanceof Error ? err.message : String(err)}`;
            console.error(msg);
            errors.push(msg);
        }
    }

    // ── Write post text file ─────────────────────
    const textFilePath = path.join(folderPath, 'post.txt');
    fs.writeFileSync(textFilePath, postText, 'utf-8');

    return {
        folderPath,
        textFilePath,
        laptopsGenerated,
        pcsGenerated,
        totalImages: laptopsGenerated + pcsGenerated,
        errors,
    };
}

// ─────────────────────────────────────────────
//  PUPPETEER RENDERER
// ─────────────────────────────────────────────

async function renderHtmlToPng(html: string, outputPath: string): Promise<void> {
    let puppeteer: typeof import('puppeteer');
    try {
        puppeteer = await import('puppeteer');
    } catch {
        throw new Error(
            'Puppeteer is not installed. Run: npm install puppeteer'
        );
    }

    const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
        await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
        await page.waitForNetworkIdle({ timeout: 15000 }).catch(() => {});
        await page.screenshot({ path: outputPath, type: 'png' });
    } finally {
        await browser.close();
    }
}
