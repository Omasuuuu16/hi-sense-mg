const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '../..'); // Adjust based on where script is run
const files = [
    path.join(projectRoot, 'New Laptop هاى سينس.xlsx'),
    path.join(projectRoot, 'PC & Led هاى سينس.xlsx')
];

const output = [];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Reading ${path.basename(file)}...`);
        const workbook = XLSX.readFile(file);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Read first few rows to identify headers
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        output.push({
            fileName: path.basename(file),
            sheetName: sheetName,
            headers: data[0],
            firstRow: data[1],
            secondRow: data[2]
        });
    } else {
        console.log(`File not found: ${file}`);
        output.push({ fileName: path.basename(file), error: "Not found" });
    }
});

fs.writeFileSync('inspection_output.json', JSON.stringify(output, null, 2));
console.log('Inspection complete. check inspection_output.json');
