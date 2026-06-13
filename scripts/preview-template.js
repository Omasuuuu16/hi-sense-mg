const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'product-template.html');
const OUTPUT_PATH   = path.join(process.cwd(), 'public', 'generated', 'template-preview.png');
const BASE          = 'http://localhost:3000';
const LAPTOP_IMAGE  = `${BASE}/images/laptops/Dell%20Latitude%205420.jpg`;

let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
html = html
  .replace(/\{\{MODEL\}\}/g,        'Dell Latitude 5420')
  .replace(/\{\{CPU\}\}/g,          'Intel Core i7-10th')
  .replace(/\{\{RAM\}\}/g,          '16')
  .replace(/\{\{SSD\}\}/g,          '512GB')
  .replace(/\{\{DISPLAY\}\}/g,      '14')
  .replace(/\{\{PRICE\}\}/g,        '13,500')
  .replace(/\{\{LAPTOP_IMAGE\}\}/g, LAPTOP_IMAGE);

(async () => {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: OUTPUT_PATH, type: 'png' });
  await browser.close();
  console.log('✅ Preview saved to:', OUTPUT_PATH);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
