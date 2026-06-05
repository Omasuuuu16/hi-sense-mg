/**
 * End-to-end test for category-scoped Excel upload via local API.
 * Run: node scripts/test-upload-e2e.js
 * Requires: npm run dev + MySQL (XAMPP) running
 */
const fs = require('fs');
const path = require('path');

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';

function extractCookie(setCookieHeader) {
    if (!setCookieHeader) return '';
    const header = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    return header.split(';')[0];
}

async function getCounts() {
    const res = await fetch(`${BASE}/api/products`);
    if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);
    const products = await res.json();
    return {
        total: products.length,
        laptops: products.filter((p) => p.category === 'Laptop').length,
        pcs: products.filter((p) => p.category === 'PC').length,
    };
}

async function login() {
    const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@hisense.com', password: 'admin123' }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(`Login failed: ${JSON.stringify(data)}`);
    const cookie = extractCookie(res.headers.getSetCookie?.() ?? res.headers.get('set-cookie'));
    if (!cookie) throw new Error('No session cookie returned from login');
    return cookie;
}

async function uploadExcel(cookie, filename) {
    const filePath = path.join(process.cwd(), 'test-files', filename);
    if (!fs.existsSync(filePath)) throw new Error(`Missing test file: ${filePath}`);

    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const form = new FormData();
    form.append('file', blob, filename);

    const res = await fetch(`${BASE}/api/admin/upload-excel`, {
        method: 'POST',
        headers: { Cookie: cookie },
        body: form,
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(`Upload failed: ${JSON.stringify(data)}`);
    return data.summary;
}

async function main() {
    console.log(`Testing against ${BASE}\n`);

    const before = await getCounts();
    console.log('Initial counts:', before);

    const cookie = await login();
    console.log('Logged in as admin\n');

    const laptopSummary = await uploadExcel(cookie, 'test-laptops-only.xlsx');
    console.log('Laptop upload:', laptopSummary);

    const afterLaptops = await getCounts();
    console.log('After laptop upload:', afterLaptops);

    if (afterLaptops.pcs !== before.pcs) {
        throw new Error(`PC count changed (${before.pcs} -> ${afterLaptops.pcs}). Laptop upload should not touch PCs.`);
    }
    if (laptopSummary.laptopsAdded === 0) {
        throw new Error('Laptop upload reported 0 laptops added');
    }
    if (!laptopSummary.categoriesReplaced?.includes('Laptop')) {
        throw new Error('Expected Laptop in categoriesReplaced');
    }
    console.log('OK: Laptops replaced, PCs unchanged\n');

    const pcSummary = await uploadExcel(cookie, 'test-pcs-only.xlsx');
    console.log('PC upload:', pcSummary);

    const afterPcs = await getCounts();
    console.log('After PC upload:', afterPcs);

    if (afterPcs.laptops !== afterLaptops.laptops) {
        throw new Error(`Laptop count changed (${afterLaptops.laptops} -> ${afterPcs.laptops}). PC upload should not touch laptops.`);
    }
    if (pcSummary.pcsAdded === 0) {
        throw new Error('PC upload reported 0 PCs added');
    }
    if (!pcSummary.categoriesReplaced?.includes('PC')) {
        throw new Error('Expected PC in categoriesReplaced');
    }
    console.log('OK: PCs replaced, laptops unchanged\n');

    console.log('PASS: Category-scoped Excel upload works end-to-end.');
}

main().catch((err) => {
    console.error('\nFAIL:', err.message);
    process.exit(1);
});
