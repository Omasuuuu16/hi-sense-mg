const fs = require('fs');
const path = require('path');

// Read the products JSON file
const productsPath = path.join(__dirname, '../public/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Image directories
const laptopImagesDir = path.join(__dirname, '../images/laptops');
const pcImagesDir = path.join(__dirname, '../images/pc');

// Get all available images
const laptopImages = fs.existsSync(laptopImagesDir) ? fs.readdirSync(laptopImagesDir) : [];
const pcImages = fs.existsSync(pcImagesDir) ? fs.readdirSync(pcImagesDir) : [];

console.log(`Found ${laptopImages.length} laptop images and ${pcImages.length} PC images`);

// Function to normalize strings for matching
function normalize(str) {
    return str.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .trim();
}

// Function to find best matching image
function findMatchingImage(product, imageList) {
    const productModel = normalize(product.model);
    const productSpecs = normalize(product.specs);

    // Try exact match first
    for (const img of imageList) {
        const imgName = normalize(img.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
        if (productModel.includes(imgName) || imgName.includes(productModel)) {
            return img;
        }
    }

    // Try partial match with specs
    for (const img of imageList) {
        const imgName = normalize(img.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
        if (productSpecs.includes(imgName) || imgName.includes(imgName.split(' ')[0])) {
            return img;
        }
    }

    // Try matching key parts of the model name
    const modelParts = productModel.split(' ');
    for (const img of imageList) {
        const imgName = normalize(img.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
        const imgParts = imgName.split(' ');

        // Check if significant parts match
        const matchCount = modelParts.filter(part =>
            part.length > 2 && imgParts.some(imgPart => imgPart.includes(part) || part.includes(imgPart))
        ).length;

        if (matchCount >= 2) {
            return img;
        }
    }

    return null;
}

// Function to get fallback image based on product type
function getFallbackImage(product, imageList) {
    const specs = normalize(product.specs);
    const model = normalize(product.model);

    if (product.category === 'Laptop') {
        // Try to match by brand
        if (product.brand === 'Dell') {
            const dellImg = imageList.find(img => img.toLowerCase().includes('dell latitude'));
            if (dellImg) return dellImg;
        } else if (product.brand === 'HP') {
            const hpImg = imageList.find(img => img.toLowerCase().includes('hp'));
            if (hpImg) return hpImg;
        } else if (product.brand === 'Lenovo') {
            const lenovoImg = imageList.find(img => img.toLowerCase().includes('lenovo'));
            if (lenovoImg) return lenovoImg;
        }
        return imageList[0]; // Return first laptop image as fallback
    } else {
        // PC components - match by type
        if (model.includes('ram') || specs.includes('ram')) {
            const ramImg = imageList.find(img => img.toLowerCase().includes('ram'));
            if (ramImg) return ramImg;
        } else if (model.includes('ssd') || specs.includes('ssd')) {
            const ssdImg = imageList.find(img => img.toLowerCase().includes('ssd'));
            if (ssdImg) return ssdImg;
        } else if (model.includes('hdd') || specs.includes('hdd') || model.includes('h.d.d')) {
            const hddImg = imageList.find(img => img.toLowerCase().includes('hdd'));
            if (hddImg) return hddImg;
        } else if (model.includes('vga') || specs.includes('vga') || model.includes('gtx')) {
            const vgaImg = imageList.find(img => img.toLowerCase().includes('vga'));
            if (vgaImg) return vgaImg;
        } else if (model.includes('led') || model.includes('monitor')) {
            const monitorImg = imageList.find(img => img.toLowerCase().includes('led'));
            if (monitorImg) return monitorImg;
        } else if (model.includes('mouse')) {
            const mouseImg = imageList.find(img => img.toLowerCase().includes('mouse'));
            if (mouseImg) return mouseImg;
        } else if (model.includes('k.b') || model.includes('keyboard')) {
            const kbImg = imageList.find(img => img.toLowerCase().includes('k.b'));
            if (kbImg) return kbImg;
        } else if (model.includes('flash')) {
            const flashImg = imageList.find(img => img.toLowerCase().includes('flash'));
            if (flashImg) return flashImg;
        } else if (model.includes('adaptor')) {
            const adaptorImg = imageList.find(img => img.toLowerCase().includes('adaptor'));
            if (adaptorImg) return adaptorImg;
        } else if (model.includes('core i') || model.includes('optiplex')) {
            const desktopImg = imageList.find(img => img.toLowerCase().includes('optiplex') || img.toLowerCase().includes('core i'));
            if (desktopImg) return desktopImg;
        }
        return imageList[0]; // Return first PC image as fallback
    }
}

// Map images to products
let matchedCount = 0;
let fallbackCount = 0;
let unmatchedCount = 0;

const updatedProducts = products.map(product => {
    const imageList = product.category === 'Laptop' ? laptopImages : pcImages;
    const imageDir = product.category === 'Laptop' ? 'laptops' : 'pc';

    // Try to find matching image
    let matchedImage = findMatchingImage(product, imageList);

    if (matchedImage) {
        matchedCount++;
        return {
            ...product,
            image: `/images/${imageDir}/${matchedImage}`
        };
    }

    // Use fallback image
    const fallbackImage = getFallbackImage(product, imageList);
    if (fallbackImage) {
        fallbackCount++;
        return {
            ...product,
            image: `/images/${imageDir}/${fallbackImage}`
        };
    }

    unmatchedCount++;
    return product;
});

// Write updated products back to file
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log('\n=== Image Mapping Results ===');
console.log(`Total products: ${products.length}`);
console.log(`Matched images: ${matchedCount}`);
console.log(`Fallback images: ${fallbackCount}`);
console.log(`Unmatched: ${unmatchedCount}`);
console.log('\nProducts updated successfully!');
