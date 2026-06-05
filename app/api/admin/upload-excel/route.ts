import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { replaceProductsByCategories } from '@/app/lib/store';
import * as XLSX from 'xlsx';
import crypto from 'crypto';

// ─── Image pools per brand / category ────────────────────────────────────────
const LAPTOP_IMAGES: Record<string, string[]> = {
    hp: [
        '/images/laptops/HP Pro Book 440 G1.jpg',
        '/images/laptops/HP Pro Book 640 G5.jpg',
        '/images/laptops/HP Z Book G6.jpg',
        '/images/laptops/HP Z Book Studio G7.jpg',
        '/images/laptops/HP AMD Ryzen.jpg',
    ],
    dell: [
        '/images/laptops/Dell Latitude 5420.jpg',
        '/images/laptops/Dell Latitude 5400.jpg',
        '/images/laptops/Dell Latitude 5480.jpg',
        '/images/laptops/Dell Latitude 5500.jpg',
        '/images/laptops/Dell Latitude 5501.jpg',
        '/images/laptops/Dell Latitude 5511.jpg',
        '/images/laptops/Dell Latitude 5580.jpg',
        '/images/laptops/Dell Latitude 5590.jpg',
        '/images/laptops/Dell Latitude 5591.webp',
        '/images/laptops/Dell Latitude 7400.jpg',
        '/images/laptops/Dell Latitude 7480.jpg',
        '/images/laptops/Dell Latitude 3330.jpg',
        '/images/laptops/Dell 15 Inspiron 7000.jpg',
        '/images/laptops/Dell G3 Inspiron 3500.jpg',
    ],
    lenovo: [
        '/images/laptops/Lenovo ThinkPad T495.jpg',
        '/images/laptops/Dell Latitude 5420.jpg',
        '/images/laptops/HP Pro Book 640 G5.jpg',
    ],
    default: [
        '/images/laptops/Dell Latitude 5420.jpg',
        '/images/laptops/HP Pro Book 640 G5.jpg',
        '/images/laptops/Lenovo ThinkPad T495.jpg',
        '/images/laptops/HP Z Book G6.jpg',
        '/images/laptops/Dell Latitude 7400.jpg',
    ],
};

const PC_IMAGES: Record<string, string[]> = {
    ram:        ['/images/pc/ram 8GB Crucial PC Used DDR4 2400.jpg', '/images/pc/ram 8GB Crucial PC Used DDR4 3200.jpg', '/images/pc/ram 4GB crucail Used DDR3.jpg', '/images/pc/Ram 16GB DDR4 Laptop 3200 HikSemi.jpg', '/images/pc/Ram8GB DDR4 Laptop 3200 HikSemi.jpg'],
    ssd:        ['/images/pc/SSD 120 GB Kingston Used.jpg', '/images/pc/SSD 240 GB Kingston Used.jpg', '/images/pc/SSD 1TB Lexar.jpg', '/images/pc/SSD 500 GB Lexar.png', '/images/pc/SSD 256GB NVME WD.jpg'],
    nvme:       ['/images/pc/SSD 1TB nvme Lexar.jpg', '/images/pc/SSD 256GB NVME WD.jpg'],
    hdd:        ['/images/pc/H.D.D PASSPORT 1TB EXT.jpg', '/images/pc/H.D.D PASSPORT 4TB EXT.jpg', '/images/pc/H.D.D PASSPORT 5TB EXT.jpg', '/images/pc/HDD_W.D4T-PURPLE.jpg', '/images/pc/HDD_W.D6T-PURPLE.jpg'],
    led:        ['/images/pc/led 22 Dell DP.jpg', '/images/pc/led 23 HP DP.jpg', '/images/pc/Led 24 Dell F.L.jpg', '/images/pc/led 24 Dell HDMI.jpg', '/images/pc/led 24 HP HDMI.jpg', '/images/pc/led 27 Samsung S3.jpg'],
    monitor:    ['/images/pc/led 22HP HDMI F.L.jpg', '/images/pc/Led 23 HP HDMI.jpg', '/images/pc/Led 24 Lenovo F.L.jpg', '/images/pc/led 24 Samsung S3.jpg'],
    screen:     ['/images/pc/led 22 Dell DP.jpg', '/images/pc/Led 24 Dell DVI + VGA.jpg'],
    vga:        ['/images/pc/VGA GT 730 2GB DDR5 Nvidia.jpg', '/images/pc/VGA GTX 1050 4GB DDR5 Nvidia 2Fan.jpg', '/images/pc/VGA GTX 1060 3GB DDR5 Nvidia 2Fan.jpg', '/images/pc/VGA GTX 1070 8GB DDR5 Nvidia 2Fan.jpg', '/images/pc/VGA GTX 1660 6GB DDR5 Nvidia 2Fan.jpg'],
    mouse:      ['/images/pc/Mouse HP,Dell original.jpg', '/images/pc/Mouse Lenovo USB.jpg', '/images/pc/Mouse Targus USB.jpg', '/images/pc/MOUSE USB Dell.jpg', '/images/pc/MOUSE USB HP.jpg', '/images/pc/MOUSE W.L Bluetooth.jpg'],
    keyboard:   ['/images/pc/K.B original USB.jpg', '/images/pc/K.B USB New.jpg', '/images/pc/K.B Jill USB.jpg', '/images/pc/K.B original USB Dell New.jpg'],
    headphone:  ['/images/pc/Headphone Gigamax 1 Socket G530 Pin.jpg', '/images/pc/Headphone Gigamax 2 Socket G530.jpg'],
    speaker:    ['/images/pc/Speaker G.Max RGB.jpg', '/images/pc/Speaker MJK 1007.jpg', '/images/pc/Speaker Point 122.jpg'],
    bag:        ['/images/pc/Bag Laptop Back.jpg', '/images/pc/Bag Laptop Back Cat.jpg', '/images/pc/Bag Laptop Public.jpg'],
    adaptor:    ['/images/pc/Adaptor HP.jpg', '/images/pc/Adaptor Dell.jpg', '/images/pc/Adaptor Lenovo.jpg', '/images/pc/Adaptor Acer.jpg', '/images/pc/Adaptor Asus.jpg', '/images/pc/Adaptor Samsung.jpg', '/images/pc/Adaptor Toshiba.jpg'],
    cable:      ['/images/pc/Cable DP Original.jpg', '/images/pc/Cable HDMI 1.5M.jpg', '/images/pc/Cable DP to HDMI.jpg', '/images/pc/Cable DP to VGA.jpg', '/images/pc/Cable DVI.jpg'],
    flash:      ['/images/pc/FLASH 32GB KINGSTON G4.jpg', '/images/pc/FLASH 64GB KINGSTON G4.jpg', '/images/pc/Lexar 128 GB.jpg', '/images/pc/Lexar 240 GB.jpg'],
    desktop:    ['/images/pc/Dell Optiplex 3020 i3-4th,4GB,500GB T.jpg', '/images/pc/Dell Optiplex 3020 i5-4th,8GB,500GB T.jpg'],
    core:       ['/images/pc/Used core i5 ,8,500 D HP 4TH.jpg', '/images/pc/Used core i5 ,8,500 T HP 4TH.jpg', '/images/pc/Used core i7 ,8,500 T,4TH.jpg'],
    cooler:     ['/images/pc/Cooler Fan Laptop FN01.jpg', '/images/pc/Cooler Fan Laptop Giga max.jpg'],
    default:    ['/images/pc/H.S 128 GB.jpg', '/images/pc/Caddy Fat.jpg', '/images/pc/Caddy Slim.jpg', '/images/pc/Rack USB 3.0.jpg'],
};

export function pickLaptopImage(brand: string, model: string, index: number): string {
    const key = brand.toLowerCase().trim();
    const pool = LAPTOP_IMAGES[key] || LAPTOP_IMAGES.default;
    
    // Try to match model keywords to keep them realistic
    const lowerModel = model.toLowerCase();
    for (const img of pool) {
        const filename = img.split('/').pop()?.toLowerCase() || '';
        if (lowerModel.includes('latitude') && filename.includes('latitude')) return img;
        if (lowerModel.includes('inspiron') && filename.includes('inspiron')) return img;
        if (lowerModel.includes('thinkpad') && filename.includes('thinkpad')) return img;
        if (lowerModel.includes('probook') && filename.includes('pro book')) return img;
        if (lowerModel.includes('zbook') && filename.includes('z book')) return img;
    }
    
    return pool[index % pool.length];
}

export function pickPcImage(itemName: string, index: number): string {
    const lower = itemName.toLowerCase();
    for (const keyword of Object.keys(PC_IMAGES)) {
        if (keyword !== 'default' && lower.includes(keyword)) {
            const pool = PC_IMAGES[keyword];
            return pool[index % pool.length];
        }
    }
    return PC_IMAGES.default[index % PC_IMAGES.default.length];
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate Admin
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        // 2. Parse uploaded file
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const newProducts: { id: string; category: string; brand: string; model: string; specs: string; price: number; section?: string; image?: string }[] = [];

        let laptopsAdded = 0;
        let pcsAdded = 0;

        // 4. Process each sheet
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][];

            if (rows.length === 0) continue;

            const isLaptopSheet =
                sheetName.toLowerCase().includes('laptop') ||
                rows[0].some(
                    (cell) =>
                        String(cell).toLowerCase().includes('lap top') ||
                        String(cell).toLowerCase().includes('notebook')
                );

            if (isLaptopSheet) {
                let currentSection = 'General';

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (row.length === 0) continue;

                    const col0 = String(row[0] || '').trim();
                    const col1 = String(row[1] || '').trim();
                    const priceVal = parseFloat(String(row[2] || ''));

                    // Section header heuristic
                    if (col1 && isNaN(priceVal) && i > 0 && !col0) {
                        currentSection = col1;
                        continue;
                    }

                    // Product row heuristic
                    if (!isNaN(priceVal) && priceVal > 0 && col0) {
                        const modelName = col0;
                        const specs = col1 || modelName;

                        // Derive brand
                        let brand = 'Unknown';
                        const firstWord = modelName.split(' ')[0];
                        const knownBrands = ['HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'Apple', 'MacBook', 'Samsung', 'Toshiba', 'MSI'];
                        if (knownBrands.some((b) => b.toLowerCase() === firstWord.toLowerCase())) {
                            brand = firstWord;
                        } else if (currentSection) {
                            const sectionFirst = currentSection.split(' ')[0];
                            if (knownBrands.some((b) => b.toLowerCase() === sectionFirst.toLowerCase())) {
                                brand = sectionFirst;
                            }
                        }

                        const image = pickLaptopImage(brand, modelName, laptopsAdded);
                        const newId = crypto.randomUUID();

                        newProducts.push({
                            id: newId,
                            category: 'Laptop',
                            brand,
                            model: modelName,
                            specs,
                            price: priceVal,
                            section: currentSection,
                            image,
                        });
                        laptopsAdded++;
                    }
                }
            } else {
                // PC / components sheet
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (row.length < 2) continue;

                    const itemName = String(row[0] || '').trim();
                    const priceVal = parseFloat(String(row[1] || ''));

                    // Skip headers or invalid rows
                    if (
                        !itemName ||
                        isNaN(priceVal) ||
                        priceVal <= 0 ||
                        itemName.toLowerCase() === 'الصنف' ||
                        itemName.toLowerCase() === 'item' ||
                        itemName.toLowerCase() === 'name'
                    ) {
                        continue;
                    }

                    const image = pickPcImage(itemName, pcsAdded);
                    const newId = crypto.randomUUID();

                    newProducts.push({
                        id: newId,
                        category: 'PC',
                        brand: 'Generic',
                        model: itemName,
                        specs: itemName,
                        price: priceVal,
                        image,
                    });
                    pcsAdded++;
                }
            }
        }

        const categoriesToReplace: string[] = [];
        if (laptopsAdded > 0) categoriesToReplace.push('Laptop');
        if (pcsAdded > 0) categoriesToReplace.push('PC');

        if (categoriesToReplace.length === 0) {
            return NextResponse.json({ error: 'No valid products found in Excel file.' }, { status: 400 });
        }

        await replaceProductsByCategories(categoriesToReplace, newProducts);
        console.log(`Imported ${newProducts.length} products for categories: ${categoriesToReplace.join(', ')}.`);

        return NextResponse.json({
            success: true,
            summary: {
                laptopsAdded,
                pcsAdded,
                totalAdded: laptopsAdded + pcsAdded,
                categoriesReplaced: categoriesToReplace,
            },
        });
    } catch (error) {
        console.error('Excel upload API error:', error);
        return NextResponse.json({ error: 'Failed to process Excel file upload.' }, { status: 500 });
    }
}
