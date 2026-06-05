const { kv } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');

async function seed() {
    const dataPath = path.join(process.cwd(), 'public/data/products.json');
    if (!fs.existsSync(dataPath)) {
        console.log('No local products.json found to seed.');
        return;
    }

    try {
        const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`Found ${products.length} products locally. Seeding to KV...`);

        await kv.set('products', products);
        console.log('Successfully seeded KV with product data.');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seed();
