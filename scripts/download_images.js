const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

// Real generic images from Wikimedia Commons
const images = [
    {
        // HP EliteBook (Generic for HP)
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HP_EliteBook_840_G1.jpg/640px-HP_EliteBook_840_G1.jpg',
        name: 'hp-zbook.jpg'
    },
    {
        // Lenovo ThinkPad X1 Carbon (Generic for ThinkPad)
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ThinkPad_X1_Carbon_Gen_9_2021.jpg/640px-ThinkPad_X1_Carbon_Gen_9_2021.jpg',
        name: 'lenovo-thinkpad.jpg'
    },
    {
        // Dell Latitude 7480 (Generic for Dell)
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dell_Latitude_7480.png/640px-Dell_Latitude_7480.png',
        name: 'dell-latitude.png'
    },
    {
        // RAM Module
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Corsair_Vengeance_DDR3-1600_2x4GB_RAM_%287163013894%29.jpg/640px-Corsair_Vengeance_DDR3-1600_2x4GB_RAM_%287163013894%29.jpg',
        name: 'ram.jpg'
    },
    {
        // SSD
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Crucial_MX200_250GB_2.5_SSD.jpg/640px-Crucial_MX200_250GB_2.5_SSD.jpg',
        name: 'ssd.jpg'
    },
    {
        // HDD
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Western_Digital_Caviar_SE_WD4000AAJS_400GB.jpg/640px-Western_Digital_Caviar_SE_WD4000AAJS_400GB.jpg',
        name: 'hdd.jpg'
    },
    {
        // Monitor
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/LCD_monitor_glossy_unicolor_wallpaper.svg/640px-LCD_monitor_glossy_unicolor_wallpaper.svg.png',
        name: 'monitor.png'
    }
];

const downloadDir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

images.forEach(img => {
    const dest = path.join(downloadDir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
        // Use a generic user agent to avoid bot blocking
        execSync(`curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -o "${dest}" "${img.url}"`);
        console.log(`Downloaded ${img.name}`);
    } catch (e) {
        console.error(`Failed to download ${img.name}: ${e.message}`);
    }
});
