const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = path.join(__dirname, '../..'); // Adjust based on where script is run: d:\antigravity
const dataDir = path.join(__dirname, '../public/data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const laptopFile = path.join(projectRoot, 'New Laptop هاى سينس.xlsx');
const pcFile = path.join(projectRoot, 'PC & Led هاى سينس.xlsx');

const products = [];

// Helper to clean strings
const cleanStr = (str) => String(str || '').replace(/\s+/g, ' ').trim();

// Process Laptops
if (fs.existsSync(laptopFile)) {
    console.log(`Processing ${path.basename(laptopFile)}...`);
    const workbook = XLSX.readFile(laptopFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    let currentSection = 'General';

    rows.forEach((row, index) => {
        // Skip empty rows
        if (row.length === 0) return;

        // Check if it's a section header (e.g., "Hp Probook...")
        // Heuristic: Column 1 has text, Col 2 (price) is empty/null/0
        const col1 = cleanStr(row[1]);
        const price = parseFloat(row[2]);

        if (col1 && !price && index > 0) {
            currentSection = col1;
        }

        // Check if it's a product
        // Heuristic: Price is a number > 0
        if (price > 0) {
            const modelName = cleanStr(row[0]);
            const specs = cleanStr(row[1]);

            // Derive brand from model name or section
            let brand = 'Unknown';
            if (modelName) {
                const firstWord = modelName.split(' ')[0];
                if (['HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'Apple', 'MacBook'].includes(firstWord)) {
                    brand = firstWord;
                }
            }
            if (brand === 'Unknown' && currentSection) {
                const firstWord = currentSection.split(' ')[0];
                if (['Hp', 'HP', 'Dell', 'Lenovo'].includes(firstWord)) {
                    brand = firstWord;
                }
            }

            // Image Mapping Logic
            let image = '/images/placeholder.jpg'; // Default backup
            const modelLower = modelName.toLowerCase();
            const sectionLower = currentSection ? currentSection.toLowerCase() : '';

            // 1. Check for exact model match (sanitized)
            // e.g. "HP Z Book G6" -> "hp-z-book-g6.png" or ".jpg"
            const slug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            let foundExactMatch = false;

            for (const ext of possibleExtensions) {
                const filename = `${slug}${ext}`;
                const localPath = path.join(__dirname, '../public/images/products', filename);
                if (fs.existsSync(localPath)) {
                    image = `/images/products/${filename}`;
                    foundExactMatch = true;
                    break;
                }
            }

            if (!foundExactMatch) {
                // 2. Fallback to keyword mapping
                if (modelLower.includes('zbook') || modelLower.includes('z book') || sectionLower.includes('zbook')) {
                    image = '/images/products/hp-zbook.svg';
                } else if (modelLower.includes('latitude') || sectionLower.includes('latitude')) {
                    image = '/images/products/dell-latitude.svg';
                } else if (modelLower.includes('thinkpad') || sectionLower.includes('thinkpad')) {
                    image = '/images/products/lenovo-thinkpad.svg';
                } else if (brand === 'HP' || brand === 'Hp') {
                    image = '/images/products/hp-zbook.svg'; // Fallback for Generic HP
                } else if (brand === 'Dell') {
                    image = '/images/products/dell-latitude.svg'; // Fallback for Generic Dell
                } else if (brand === 'Lenovo') {
                    image = '/images/products/lenovo-thinkpad.svg'; // Fallback for Generic Lenovo
                }
            }


            products.push({
                id: crypto.randomUUID(),
                category: 'Laptop',
                brand: brand,
                model: modelName,
                specs: specs,
                price: price,
                section: currentSection,
                image: image
            });
        }
    });
} else {
    console.error(`File not found: ${laptopFile}`);
}

// Process PCs
if (fs.existsSync(pcFile)) {
    console.log(`Processing ${path.basename(pcFile)}...`);
    const workbook = XLSX.readFile(pcFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    // Skip header row usually, but let's see. 
    // Row 0 is Headers based on inspection.
    const startRow = 1;

    for (let i = startRow; i < rows.length; i++) {
        const row = rows[i];
        const item = cleanStr(row[0]);
        const price = parseFloat(row[1]);

        if (item && price > 0) {
            let image = '/images/placeholder.jpg';
            const itemLower = item.toLowerCase();

            // 1. Check for exact model match (sanitized)
            const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            let foundExactMatch = false;

            for (const ext of possibleExtensions) {
                const filename = `${slug}${ext}`;
                const localPath = path.join(__dirname, '../public/images/products', filename);
                if (fs.existsSync(localPath)) {
                    image = `/images/products/${filename}`;
                    foundExactMatch = true;
                    break;
                }
            }

            if (!foundExactMatch) {
                // 2. Fallback
                if (itemLower.includes('ram') || itemLower.includes('memory')) {
                    image = '/images/products/ram.svg';
                } else if (itemLower.includes('ssd') || itemLower.includes('nvme')) {
                    image = '/images/products/ssd.svg';
                } else if (itemLower.includes('hdd') || itemLower.includes('hard disk') || itemLower.includes('w.d')) {
                    image = '/images/products/hdd.svg';
                } else if (itemLower.includes('monitor') || itemLower.includes('screen') || itemLower.includes('led')) {
                    image = '/images/products/monitor.svg';
                }
            }

            products.push({
                id: crypto.randomUUID(),
                category: 'PC', // Default category
                brand: 'Generic',
                model: item,
                specs: item, // Use item name as specs for now
                price: price,
                image: image
            });
        }
    }
} else {
    console.error(`File not found: ${pcFile}`);
}

const outputPath = path.join(dataDir, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Successfully converted data. Saved ${products.length} products to ${outputPath}`);
