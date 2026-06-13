export const LAPTOP_IMAGE_POOLS: Record<string, string[]> = {
    hp: [
        '/images/laptops/HP.jpg',
        '/images/laptops/HP2.avif',
    ],
    dell: [
        '/images/laptops/Dell.png',
        '/images/laptops/Dell2.avif',
        '/images/laptops/Dell3.avif',
    ],
    lenovo: [
        '/images/laptops/Lenovo.avif',
        '/images/laptops/Lenovo2.avif',
        '/images/laptops/thinkpad.jpg',
        '/images/laptops/thinkpad2.jpg',
        '/images/laptops/lenovoLOQ.jpg',
    ],
    asus: [
        '/images/laptops/asus.png',
    ],
    acer: [
        '/images/laptops/Lenovo2.avif', // fallback
    ],
    msi: [
        '/images/laptops/lenovoLOQ.jpg', // fallback gaming
    ],
    default: [
        '/images/laptops/HP.jpg',
    ],
};

export const PC_IMAGE_POOLS: Record<string, string[]> = {
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

export function getSmartLaptopImage(brand: string, modelName: string, index: number): string {
    const modelLower = modelName.toLowerCase();
    const brandLower = brand.toLowerCase();
    const combined = `${brandLower} ${modelLower}`.toLowerCase();

    if (combined.includes('thinkpad')) {
        return combined.includes('x1') || combined.includes('x13') || combined.includes('t14')
            ? '/images/laptops/thinkpad2.jpg'
            : '/images/laptops/thinkpad.jpg';
    }

    if (combined.includes('loq') || combined.includes('legion') || combined.includes('ideapad gaming')) {
        return '/images/laptops/lenovoLOQ.jpg';
    }

    if (combined.includes('lenovo') || brandLower === 'lenovo') {
        return (index % 2 === 0)
            ? '/images/laptops/Lenovo.avif'
            : '/images/laptops/Lenovo2.avif';
    }

    if (combined.includes(' hp') || brandLower === 'hp' || combined.startsWith('hp')) {
        return (index % 2 === 0)
            ? '/images/laptops/HP.jpg'
            : '/images/laptops/HP2.avif';
    }

    if (combined.includes('dell') || brandLower === 'dell') {
        const idx = index % 3;
        return ['/images/laptops/Dell.png', '/images/laptops/Dell2.avif', '/images/laptops/Dell3.avif'][idx];
    }

    if (combined.includes('asus') || brandLower === 'asus') {
        return '/images/laptops/asus.png';
    }

    return '/images/laptops/HP.jpg';
}

export function getSmartPcImage(itemName: string, index: number): string {
    const lower = itemName.toLowerCase();
    const keywords = Object.keys(PC_IMAGE_POOLS).filter(k => k !== 'default');
    for (const kw of keywords) {
        if (lower.includes(kw)) {
            const pool = PC_IMAGE_POOLS[kw];
            return pool[index % pool.length];
        }
    }
    return PC_IMAGE_POOLS.default[index % PC_IMAGE_POOLS.default.length];
}

export function getStringHash(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}
