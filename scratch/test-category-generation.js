const fs = require('fs');
const path = require('path');

async function test() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('Test 1: Call generate-post API with Laptop category only...');
    const res = await fetch(`${baseUrl}/api/admin/generate-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Simple cookie or authorization header if needed, but since we are running locally, 
            // wait - the API requires admin auth.
            // Let's check how the API authenticates. It uses getCurrentUser(req) which reads from cookies.
        }
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
}

// Since we need admin cookies/auth, let's check store products directly
// by importing generatePost from image-generator.ts.
const { generatePost } = require('../app/lib/image-generator');
const { getProducts } = require('../app/lib/store');

async function testDirect() {
    try {
        console.log('Reading products from store...');
        const products = await getProducts();
        console.log(`Total products in store: ${products.length}`);
        
        const laptops = products.filter(p => p.category.toLowerCase() === 'laptop');
        const pcs = products.filter(p => p.category.toLowerCase() === 'pc');
        console.log(`Laptops: ${laptops.length}, PCs: ${pcs.length}`);
        
        console.log('\nRunning generatePost with categories = ["Laptop"]...');
        const result = await generatePost(products, 'Test post text with laptops only', 'http://localhost:3000', ['Laptop']);
        
        console.log('Result:', {
            folderPath: result.folderPath,
            laptopsGenerated: result.laptopsGenerated,
            pcsGenerated: result.pcsGenerated,
            totalImages: result.totalImages,
            errors: result.errors
        });
        
        // Verify folder contents
        const files = fs.readdirSync(result.folderPath);
        console.log('Generated Files in folder:', files);
        
        const hasPcImages = files.some(f => f.startsWith('pc_'));
        const hasLaptopImages = files.some(f => f.startsWith('laptop_'));
        
        console.log('Has laptop images:', hasLaptopImages);
        console.log('Has PC images:', hasPcImages);
        
        if (hasPcImages) {
            console.error('FAIL: PC images were generated when only Laptop category was requested.');
        } else if (!hasLaptopImages && laptops.length > 0) {
            console.error('FAIL: No laptop images were generated.');
        } else {
            console.log('PASS: Category filtering works perfectly!');
        }
    } catch (err) {
        console.error('Error during test:', err);
    }
}

testDirect();
