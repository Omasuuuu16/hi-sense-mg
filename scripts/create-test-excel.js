const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const outDir = path.join(process.cwd(), 'test-files');
fs.mkdirSync(outDir, { recursive: true });

// Laptop-only workbook (sheet name triggers laptop parsing)
const laptopWb = XLSX.utils.book_new();
const laptopData = [
    ['Model', 'Specs', 'Price'],
    ['', 'Test Laptops Section', ''],
    ['HP ProBook TEST-1', 'i5 / 8GB / 256GB', 9999],
    ['Dell Latitude TEST-2', 'i7 / 16GB / 512GB', 14999],
];
XLSX.utils.book_append_sheet(laptopWb, XLSX.utils.aoa_to_sheet(laptopData), 'Laptops');
XLSX.writeFile(laptopWb, path.join(outDir, 'test-laptops-only.xlsx'));

// PC-only workbook
const pcWb = XLSX.utils.book_new();
const pcData = [
    ['Item', 'Price'],
    ['RAM 8GB TEST', 500],
    ['SSD 256GB TEST', 1200],
    ['Mouse USB TEST', 150],
];
XLSX.utils.book_append_sheet(pcWb, XLSX.utils.aoa_to_sheet(pcData), 'PC Parts');
XLSX.writeFile(pcWb, path.join(outDir, 'test-pcs-only.xlsx'));

console.log('Created:');
console.log(' - test-files/test-laptops-only.xlsx');
console.log(' - test-files/test-pcs-only.xlsx');
