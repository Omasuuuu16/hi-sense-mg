export const LAPTOP_IMAGE_POOLS: Record<string, string[]> = {
    // ── ThinkPad specific ─────────────────────────────────────────
    thinkpad: [
        '/images/laptops/thinkpad.jpg',
        '/images/laptops/thinkpad2.jpg',
        '/images/laptops/Lenovo ThinkPad T495.jpg',
    ],

    // ── Lenovo gaming ─────────────────────────────────────────────
    lenovo_gaming: [
        '/images/laptops/lenovoLOQ.jpg',
    ],

    // ── Lenovo generic ────────────────────────────────────────────
    lenovo: [
        '/images/laptops/Lenovo.avif',
        '/images/laptops/Lenovo2.avif',
        '/images/laptops/thinkpad.jpg',
        '/images/laptops/thinkpad2.jpg',
        '/images/laptops/lenovoLOQ.jpg',
        '/images/laptops/Lenovo ThinkPad T495.jpg',
    ],

    // ── HP specific models ────────────────────────────────────────
    hp: [
        '/images/laptops/HP.jpg',
        '/images/laptops/HP2.avif',
        '/images/laptops/HP Pro Book 440 G1.jpg',
        '/images/laptops/HP Pro Book 640 G5.jpg',
        '/images/laptops/HP Z Book G6.jpg',
        '/images/laptops/HP Z Book Studio G7.jpg',
        '/images/laptops/HP AMD Ryzen.jpg',
    ],

    // ── Dell specific models ──────────────────────────────────────
    dell: [
        '/images/laptops/Dell.png',
        '/images/laptops/Dell2.avif',
        '/images/laptops/Dell3.avif',
        '/images/laptops/Dell 15 Inspiron 7000.jpg',
        '/images/laptops/Dell G3 Inspiron 3500.jpg',
        '/images/laptops/Dell Latitude 3330.jpg',
        '/images/laptops/Dell Latitude 5400.jpg',
        '/images/laptops/Dell Latitude 5420.jpg',
        '/images/laptops/Dell Latitude 5480.jpg',
        '/images/laptops/Dell Latitude 5500.jpg',
        '/images/laptops/Dell Latitude 5501.jpg',
        '/images/laptops/Dell Latitude 5511.jpg',
        '/images/laptops/Dell Latitude 5580.jpg',
        '/images/laptops/Dell Latitude 5590.jpg',
        '/images/laptops/Dell Latitude 5591.webp',
        '/images/laptops/Dell Latitude 7400.jpg',
        '/images/laptops/Dell Latitude 7480.jpg',
    ],

    // ── ASUS ──────────────────────────────────────────────────────
    asus: [
        '/images/laptops/asus.png',
    ],

    // ── Acer / MSI fallbacks ──────────────────────────────────────
    acer: ['/images/laptops/Lenovo2.avif'],
    msi:  ['/images/laptops/lenovoLOQ.jpg'],

    default: ['/images/laptops/HP.jpg'],
};

// ─── Model-specific laptop image map ─────────────────────────────────────────
// Key: lowercase substring that appears in the model name
// Value: exact image path
const LAPTOP_MODEL_MAP: { pattern: string; image: string }[] = [
    // Dell Latitude exact matches (most specific first)
    { pattern: 'latitude 7480', image: '/images/laptops/Dell Latitude 7480.jpg' },
    { pattern: 'latitude 7400', image: '/images/laptops/Dell Latitude 7400.jpg' },
    { pattern: 'latitude 5591', image: '/images/laptops/Dell Latitude 5591.webp' },
    { pattern: 'latitude 5590', image: '/images/laptops/Dell Latitude 5590.jpg' },
    { pattern: 'latitude 5580', image: '/images/laptops/Dell Latitude 5580.jpg' },
    { pattern: 'latitude 5511', image: '/images/laptops/Dell Latitude 5511.jpg' },
    { pattern: 'latitude 5501', image: '/images/laptops/Dell Latitude 5501.jpg' },
    { pattern: 'latitude 5500', image: '/images/laptops/Dell Latitude 5500.jpg' },
    { pattern: 'latitude 5480', image: '/images/laptops/Dell Latitude 5480.jpg' },
    { pattern: 'latitude 5420', image: '/images/laptops/Dell Latitude 5420.jpg' },
    { pattern: 'latitude 5400', image: '/images/laptops/Dell Latitude 5400.jpg' },
    { pattern: 'latitude 3330', image: '/images/laptops/Dell Latitude 3330.jpg' },
    { pattern: 'inspiron 7000', image: '/images/laptops/Dell 15 Inspiron 7000.jpg' },
    { pattern: 'g3 3500',       image: '/images/laptops/Dell G3 Inspiron 3500.jpg' },
    { pattern: 'inspiron 3500', image: '/images/laptops/Dell G3 Inspiron 3500.jpg' },

    // HP specific
    { pattern: 'zbook studio g7', image: '/images/laptops/HP Z Book Studio G7.jpg' },
    { pattern: 'zbook studio',    image: '/images/laptops/HP Z Book Studio G7.jpg' },
    { pattern: 'zbook g6',        image: '/images/laptops/HP Z Book G6.jpg' },
    { pattern: 'z book g6',       image: '/images/laptops/HP Z Book G6.jpg' },
    { pattern: 'probook 640',     image: '/images/laptops/HP Pro Book 640 G5.jpg' },
    { pattern: 'pro book 640',    image: '/images/laptops/HP Pro Book 640 G5.jpg' },
    { pattern: 'probook 440',     image: '/images/laptops/HP Pro Book 440 G1.jpg' },
    { pattern: 'pro book 440',    image: '/images/laptops/HP Pro Book 440 G1.jpg' },
    { pattern: 'ryzen',           image: '/images/laptops/HP AMD Ryzen.jpg' },
    { pattern: 'amd',             image: '/images/laptops/HP AMD Ryzen.jpg' },

    // ThinkPad
    { pattern: 't495',     image: '/images/laptops/Lenovo ThinkPad T495.jpg' },
    { pattern: 'thinkpad', image: '/images/laptops/thinkpad.jpg' },
];

export const PC_IMAGE_POOLS: Record<string, string[]> = {
    // ── RAM ───────────────────────────────────────────────────────
    ram: [
        '/images/pc/ram 8GB Crucial PC Used DDR4 2400.jpg',
        '/images/pc/ram 8GB Crucial PC Used DDR4 3200.jpg',
        '/images/pc/ram 4GB crucail Used DDR3.jpg',
        '/images/pc/ram 8GB crucail Used DDR3.jpg',
        '/images/pc/Ram 16GB DDR4 Laptop 3200 HikSemi.jpg',
        '/images/pc/Ram8GB DDR4 Laptop 3200 HikSemi.jpg',
    ],

    // ── SSD ───────────────────────────────────────────────────────
    ssd: [
        '/images/pc/SSD 120 GB Kingston Used.jpg',
        '/images/pc/SSD 240 GB Kingston Used.jpg',
        '/images/pc/SSD 1TB Lexar.jpg',
        '/images/pc/SSD 500 GB Lexar.png',
        '/images/pc/SSD 256GB NVME WD.jpg',
    ],

    // ── NVMe ─────────────────────────────────────────────────────
    nvme: [
        '/images/pc/SSD 1TB nvme Lexar.jpg',
        '/images/pc/SSD 256GB NVME WD.jpg',
    ],

    // ── HDD / Hard Disk ──────────────────────────────────────────
    hdd: [
        '/images/pc/H.D.D PASSPORT 1TB EXT.jpg',
        '/images/pc/H.D.D PASSPORT 4TB EXT.jpg',
        '/images/pc/H.D.D PASSPORT 5TB EXT.jpg',
        '/images/pc/HDD_W.D4T-PURPLE.jpg',
        '/images/pc/HDD_W.D6T-PURPLE.jpg',
        '/images/pc/HDD_W.D8T-PURPLE.jpg',
    ],

    // ── LED / Monitor / Screen ────────────────────────────────────
    led: [
        '/images/pc/led 22 Dell DP.jpg',
        '/images/pc/led 23 HP DP.jpg',
        '/images/pc/Led 24 Dell F.L.jpg',
        '/images/pc/led 24 Dell HDMI.jpg',
        '/images/pc/led 24 Dell DP.jpg',
        '/images/pc/led 24 HP HDMI.jpg',
        '/images/pc/led 27 Samsung S3.jpg',
    ],
    monitor: [
        '/images/pc/led 22HP HDMI F.L.jpg',
        '/images/pc/Led 23 HP HDMI.jpg',
        '/images/pc/Led 24 Lenovo F.L.jpg',
        '/images/pc/led 24 Samsung S3.jpg',
    ],
    screen: [
        '/images/pc/led 22 Dell DP.jpg',
        '/images/pc/Led 24 Dell DVI + VGA.jpg',
        '/images/pc/cable screen.jpg',
    ],

    // ── VGA / GPU ─────────────────────────────────────────────────
    vga: [
        '/images/pc/VGA GT 730 2GB DDR5 Nvidia.jpg',
        '/images/pc/VGA GTX 1050 4GB DDR5 Nvidia 2Fan.jpg',
        '/images/pc/VGA GTX 1060 3GB DDR5 Nvidia 2Fan.jpg',
        '/images/pc/VGA GTX 1070 8GB DDR5 Nvidia 2Fan.jpg',
        '/images/pc/VGA GTX 1660 6GB DDR5 Nvidia 2Fan.jpg',
        '/images/pc/VGA R5 430 1GB DDR5 ATI Low Profil.jpg',
        '/images/pc/VGA R5 430 1GB DDR5 ATI Tower.jpg',
    ],

    // ── Mouse ─────────────────────────────────────────────────────
    mouse: [
        '/images/pc/Mouse HP,Dell original.jpg',
        '/images/pc/Mouse Lenovo USB.jpg',
        '/images/pc/Mouse Targus USB.jpg',
        '/images/pc/MOUSE USB Dell.jpg',
        '/images/pc/MOUSE USB HP.jpg',
        '/images/pc/MOUSE W.L Bluetooth.jpg',
    ],

    // ── Keyboard ─────────────────────────────────────────────────
    keyboard: [
        '/images/pc/K.B original USB.jpg',
        '/images/pc/K.B USB New.jpg',
        '/images/pc/K.B Jill USB.jpg',
        '/images/pc/K.B original USB Dell New.jpg',
        '/images/pc/K.B + Mouse Wireless Dell.jpg',
        '/images/pc/K.B + Mouse Wireless Fv300.jpg',
    ],

    // ── Mousepad ─────────────────────────────────────────────────
    mousepad: [
        '/images/pc/Mouse Pad 2B.jpg',
    ],
    pad: [
        '/images/pc/Mouse Pad 2B.jpg',
    ],

    // ── Headphone ────────────────────────────────────────────────
    headphone: [
        '/images/pc/Headphone Gigamax 1 Socket G530 Pin.jpg',
        '/images/pc/Headphone Gigamax 2 Socket G530.jpg',
    ],

    // ── Speaker ──────────────────────────────────────────────────
    speaker: [
        '/images/pc/Speaker G.Max RGB.jpg',
        '/images/pc/Speaker MJK 1007.jpg',
        '/images/pc/Speaker Point 122.jpg',
    ],

    // ── Bag ──────────────────────────────────────────────────────
    bag: [
        '/images/pc/Bag Laptop Back.jpg',
        '/images/pc/Bag Laptop Back Cat.jpg',
        '/images/pc/Bag Laptop Public.jpg',
    ],

    // ── Adaptor / Charger ─────────────────────────────────────────
    adaptor: [
        '/images/pc/Adaptor HP.jpg',
        '/images/pc/Adaptor Dell.jpg',
        '/images/pc/Adaptor Lenovo.jpg',
        '/images/pc/Adaptor Acer.jpg',
        '/images/pc/Adaptor Asus.jpg',
        '/images/pc/Adaptor Samsung.jpg',
        '/images/pc/Adaptor Toshiba.jpg',
    ],
    charger: [
        '/images/pc/Adaptor HP.jpg',
        '/images/pc/Adaptor Dell.jpg',
        '/images/pc/Adaptor Lenovo.jpg',
        '/images/pc/cable power Laptop.jpg',
        '/images/pc/cable power PC.jpg',
    ],

    // ── Cable ─────────────────────────────────────────────────────
    cable: [
        '/images/pc/Cable DP Original.jpg',
        '/images/pc/Cable HDMI 1.5M.jpg',
        '/images/pc/Cable DP to HDMI.jpg',
        '/images/pc/Cable DP to VGA.jpg',
        '/images/pc/Cable DVI.jpg',
        '/images/pc/cable power Laptop.jpg',
        '/images/pc/cable power PC.jpg',
        '/images/pc/cable screen.jpg',
        '/images/pc/VGA to HDMI.jpg',
    ],

    // ── Flash / USB ───────────────────────────────────────────────
    flash: [
        '/images/pc/FLASH 32GB KINGSTON G4.jpg',
        '/images/pc/FLASH 64GB KINGSTON G4.jpg',
        '/images/pc/Lexar 128 GB.jpg',
        '/images/pc/Lexar 240 GB.jpg',
    ],

    // ── Power / UPS / Joint ───────────────────────────────────────
    power: [
        '/images/pc/Power Joint 5 port.jpg',
        '/images/pc/Power Joint 7 port.jpg',
        '/images/pc/Power Joint 9 port.jpg',
        '/images/pc/Power Joint For a 3 port.jpg',
        '/images/pc/cable power PC.jpg',
        '/images/pc/cable power Laptop.jpg',
    ],
    joint: [
        '/images/pc/Power Joint 5 port.jpg',
        '/images/pc/Power Joint 7 port.jpg',
        '/images/pc/Power Joint 9 port.jpg',
        '/images/pc/Power Joint For a 3 port.jpg',
    ],
    ups: [
        '/images/pc/Power Joint 5 port.jpg',
        '/images/pc/Power Joint 7 port.jpg',
    ],

    // ── Desktop / PC Unit / Core / Optiplex ───────────────────────
    desktop: [
        '/images/pc/HP_EliteDesk.jpg',
    ],

    // ── Cooler / Fan ──────────────────────────────────────────────
    cooler: [
        '/images/pc/Cooler Fan Laptop FN01.jpg',
        '/images/pc/Cooler Fan Laptop Giga max.jpg',
    ],
    fan: [
        '/images/pc/Cooler Fan Laptop FN01.jpg',
        '/images/pc/Cooler Fan Laptop Giga max.jpg',
    ],

    // ── USB / Hub ─────────────────────────────────────────────────
    usb: [
        '/images/pc/Rack USB 3.0.jpg',
        '/images/pc/FLASH 32GB KINGSTON G4.jpg',
        '/images/pc/FLASH 64GB KINGSTON G4.jpg',
    ],
    hub: [
        '/images/pc/Rack USB 3.0.jpg',
    ],
    rack: [
        '/images/pc/Rack USB 3.0.jpg',
    ],

    // ── Caddy ─────────────────────────────────────────────────────
    caddy: [
        '/images/pc/Caddy Fat.jpg',
        '/images/pc/Caddy Slim.jpg',
    ],

    // ── Default fallback ─────────────────────────────────────────
    default: [
        '/images/pc/H.S 128 GB.jpg',
        '/images/pc/Caddy Fat.jpg',
        '/images/pc/Caddy Slim.jpg',
        '/images/pc/Rack USB 3.0.jpg',
    ],
};

// ─── Model-specific PC image map ──────────────────────────────────────────────
// Matched before keyword pools — most specific patterns first.
const PC_MODEL_MAP: { pattern: string; image: string }[] = [
    // Used Desktops / PC Cases (Most Specific & Prioritized)
    { pattern: 'dell optiplex',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'dell optiplix',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'optiplex',         image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'optiplix',         image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'used core',        image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'hp amd',           image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'amd a6',           image: '/images/pc/HP_EliteDesk.jpg' },

    // USB WiFi
    { pattern: 'usb wifi',  image: '/images/pc/USB_WiFi.jpg' },
    { pattern: 'wifi',      image: '/images/pc/USB_WiFi.jpg' },
    { pattern: 'wi-fi',     image: '/images/pc/USB_WiFi.jpg' },
    { pattern: 'wireless adapter', image: '/images/pc/USB_WiFi.jpg' },
    { pattern: 'wireless',  image: '/images/pc/USB_WiFi.jpg' },

    // HDD Passport / External
    { pattern: '1tb passport', image: '/images/pc/H.D.D PASSPORT 1TB EXT.jpg' },
    { pattern: '4tb passport', image: '/images/pc/H.D.D PASSPORT 4TB EXT.jpg' },
    { pattern: '5tb passport', image: '/images/pc/H.D.D PASSPORT 5TB EXT.jpg' },
    { pattern: 'passport 1tb', image: '/images/pc/H.D.D PASSPORT 1TB EXT.jpg' },
    { pattern: 'passport 4tb', image: '/images/pc/H.D.D PASSPORT 4TB EXT.jpg' },
    { pattern: 'passport 5tb', image: '/images/pc/H.D.D PASSPORT 5TB EXT.jpg' },
    { pattern: 'passport',     image: '/images/pc/H.D.D PASSPORT 1TB EXT.jpg' },

    // HDD Purple
    { pattern: '4t purple',  image: '/images/pc/HDD_W.D4T-PURPLE.jpg' },
    { pattern: '4tb purple', image: '/images/pc/HDD_W.D4T-PURPLE.jpg' },
    { pattern: '6t purple',  image: '/images/pc/HDD_W.D6T-PURPLE.jpg' },
    { pattern: '6tb purple', image: '/images/pc/HDD_W.D6T-PURPLE.jpg' },
    { pattern: '8t purple',  image: '/images/pc/HDD_W.D8T-PURPLE.jpg' },
    { pattern: '8tb purple', image: '/images/pc/HDD_W.D8T-PURPLE.jpg' },

    // HDD General capacities (will match specifically if no purple/passport)
    { pattern: 'hdd 4tb', image: '/images/pc/HDD_W.D4T-PURPLE.jpg' },
    { pattern: '4tb hdd', image: '/images/pc/HDD_W.D4T-PURPLE.jpg' },
    { pattern: 'hdd 6tb', image: '/images/pc/HDD_W.D6T-PURPLE.jpg' },
    { pattern: '6tb hdd', image: '/images/pc/HDD_W.D6T-PURPLE.jpg' },
    { pattern: 'hdd 8tb', image: '/images/pc/HDD_W.D8T-PURPLE.jpg' },
    { pattern: '8tb hdd', image: '/images/pc/HDD_W.D8T-PURPLE.jpg' },

    // SSD
    { pattern: '120 gb kingston', image: '/images/pc/SSD 120 GB Kingston Used.jpg' },
    { pattern: '120gb kingston',  image: '/images/pc/SSD 120 GB Kingston Used.jpg' },
    { pattern: '240 gb kingston', image: '/images/pc/SSD 240 GB Kingston Used.jpg' },
    { pattern: '240gb kingston',  image: '/images/pc/SSD 240 GB Kingston Used.jpg' },
    { pattern: '1tb nvme lexar',  image: '/images/pc/SSD 1TB nvme Lexar.jpg' },
    { pattern: '1tb lexar',       image: '/images/pc/SSD 1TB Lexar.jpg' },
    { pattern: '500 gb lexar',    image: '/images/pc/SSD 500 GB Lexar.png' },
    { pattern: '500gb lexar',     image: '/images/pc/SSD 500 GB Lexar.png' },
    { pattern: '256gb nvme wd',   image: '/images/pc/SSD 256GB NVME WD.jpg' },
    { pattern: '256 gb wd',       image: '/images/pc/SSD 256GB NVME WD.jpg' },
    { pattern: '120 gb',          image: '/images/pc/SSD 120 GB Kingston Used.jpg' },
    { pattern: '120gb',           image: '/images/pc/SSD 120 GB Kingston Used.jpg' },
    { pattern: '240 gb',          image: '/images/pc/SSD 240 GB Kingston Used.jpg' },
    { pattern: '240gb',           image: '/images/pc/SSD 240 GB Kingston Used.jpg' },
    { pattern: '500 gb',          image: '/images/pc/SSD 500 GB Lexar.png' },
    { pattern: '500gb',           image: '/images/pc/SSD 500 GB Lexar.png' },

    // Flash
    { pattern: '32gb kingston', image: '/images/pc/FLASH 32GB KINGSTON G4.jpg' },
    { pattern: '64gb kingston', image: '/images/pc/FLASH 64GB KINGSTON G4.jpg' },
    { pattern: 'lexar 128 gb',  image: '/images/pc/Lexar 128 GB.jpg' },
    { pattern: '128gb lexar',   image: '/images/pc/Lexar 128 GB.jpg' },
    { pattern: 'lexar 240 gb',  image: '/images/pc/Lexar 240 GB.jpg' },
    { pattern: '240gb lexar',   image: '/images/pc/Lexar 240 GB.jpg' },
    { pattern: 'h.s 128 gb',    image: '/images/pc/H.S 128 GB.jpg' },
    { pattern: '128gb h.s',     image: '/images/pc/H.S 128 GB.jpg' },

    // RAM
    { pattern: '16gb ddr4',        image: '/images/pc/Ram 16GB DDR4 Laptop 3200 HikSemi.jpg' },
    { pattern: '8gb ddr4 3200',    image: '/images/pc/ram 8GB Crucial PC Used DDR4 3200.jpg' },
    { pattern: '8gb ddr4 2400',    image: '/images/pc/ram 8GB Crucial PC Used DDR4 2400.jpg' },
    { pattern: '8gb ddr4 laptop',  image: '/images/pc/Ram8GB DDR4 Laptop 3200 HikSemi.jpg' },
    { pattern: '8gb ddr3',         image: '/images/pc/ram 8GB crucail Used DDR3.jpg' },
    { pattern: '4gb ddr3',         image: '/images/pc/ram 4GB crucail Used DDR3.jpg' },

    // Core generations (specific desktops)
    { pattern: 'i5-10th',   image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5 10th',   image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5-9th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5 9th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5 7th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5,7th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5 6th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i5,6th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i7 7th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i7,7th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i7 4th',    image: '/images/pc/HP_EliteDesk.jpg' },
    { pattern: 'i7,4th',    image: '/images/pc/HP_EliteDesk.jpg' },

    // VGA specific
    { pattern: 'gtx 1660',     image: '/images/pc/VGA GTX 1660 6GB DDR5 Nvidia 2Fan.jpg' },
    { pattern: 'gtx 1070',     image: '/images/pc/VGA GTX 1070 8GB DDR5 Nvidia 2Fan.jpg' },
    { pattern: 'gtx 1060',     image: '/images/pc/VGA GTX 1060 3GB DDR5 Nvidia 2Fan.jpg' },
    { pattern: 'gtx 1050',     image: '/images/pc/VGA GTX 1050 4GB DDR5 Nvidia 2Fan.jpg' },
    { pattern: 'gt 730',       image: '/images/pc/VGA GT 730 2GB DDR5 Nvidia.jpg' },
    { pattern: 'r5 430 low',   image: '/images/pc/VGA R5 430 1GB DDR5 ATI Low Profil.jpg' },
    { pattern: 'r5 430 tower', image: '/images/pc/VGA R5 430 1GB DDR5 ATI Tower.jpg' },
    { pattern: 'r5 430',       image: '/images/pc/VGA R5 430 1GB DDR5 ATI Tower.jpg' },

    // Adapters
    { pattern: 'adaptor acer',    image: '/images/pc/Adaptor Acer.jpg' },
    { pattern: 'charger acer',    image: '/images/pc/Adaptor Acer.jpg' },
    { pattern: 'adaptor asus',    image: '/images/pc/Adaptor Asus.jpg' },
    { pattern: 'charger asus',    image: '/images/pc/Adaptor Asus.jpg' },
    { pattern: 'adaptor dell',    image: '/images/pc/Adaptor Dell.jpg' },
    { pattern: 'charger dell',    image: '/images/pc/Adaptor Dell.jpg' },
    { pattern: 'adaptor hp',      image: '/images/pc/Adaptor HP.jpg' },
    { pattern: 'charger hp',      image: '/images/pc/Adaptor HP.jpg' },
    { pattern: 'adaptor lenovo',  image: '/images/pc/Adaptor Lenovo.jpg' },
    { pattern: 'charger lenovo',  image: '/images/pc/Adaptor Lenovo.jpg' },
    { pattern: 'adaptor samsung', image: '/images/pc/Adaptor Samsung.jpg' },
    { pattern: 'charger samsung', image: '/images/pc/Adaptor Samsung.jpg' },
    { pattern: 'adaptor toshiba', image: '/images/pc/Adaptor Toshiba.jpg' },
    { pattern: 'charger toshiba', image: '/images/pc/Adaptor Toshiba.jpg' },

    // LED / monitor sizes
    { pattern: 'led 27 samsung',  image: '/images/pc/led 27 Samsung S3.jpg' },
    { pattern: 'led 27',          image: '/images/pc/led 27 Samsung S3.jpg' },
    { pattern: '27"',             image: '/images/pc/led 27 Samsung S3.jpg' },
    { pattern: 'led 24 dell dvi', image: '/images/pc/Led 24 Dell DVI + VGA.jpg' },
    { pattern: 'led 24 dell f.l', image: '/images/pc/Led 24 Dell F.L.jpg' },
    { pattern: 'led 24 dell dp',  image: '/images/pc/led 24 Dell DP.jpg' },
    { pattern: 'led 24 dell hdmi',image: '/images/pc/led 24 Dell HDMI.jpg' },
    { pattern: 'led 24 lenovo',   image: '/images/pc/Led 24 Lenovo F.L.jpg' },
    { pattern: 'led 24 hp hdmi',  image: '/images/pc/led 24 HP HDMI.jpg' },
    { pattern: 'led 24 samsung',  image: '/images/pc/led 24 Samsung S3.jpg' },
    { pattern: 'led 24',          image: '/images/pc/led 24 Dell HDMI.jpg' },
    { pattern: '24"',             image: '/images/pc/led 24 Dell HDMI.jpg' },
    { pattern: 'led 23 hp hdmi',  image: '/images/pc/Led 23 HP HDMI.jpg' },
    { pattern: 'led 23 hp dp',    image: '/images/pc/led 23 HP DP.jpg' },
    { pattern: 'led 23',          image: '/images/pc/led 23 HP DP.jpg' },
    { pattern: '23"',             image: '/images/pc/led 23 HP DP.jpg' },
    { pattern: 'led 22 hp hdmi',  image: '/images/pc/led 22HP HDMI F.L.jpg' },
    { pattern: 'led 22 dell dp',  image: '/images/pc/led 22 Dell DP.jpg' },
    { pattern: 'led 22',          image: '/images/pc/led 22 Dell DP.jpg' },
    { pattern: '22"',             image: '/images/pc/led 22 Dell DP.jpg' },

    // Cable types
    { pattern: 'vga to hdmi',  image: '/images/pc/VGA to HDMI.jpg' },
    { pattern: 'dp to hdmi',   image: '/images/pc/Cable DP to HDMI.jpg' },
    { pattern: 'dp to vga',    image: '/images/pc/Cable DP to VGA.jpg' },
    { pattern: 'cable hdmi',   image: '/images/pc/Cable HDMI 1.5M.jpg' },
    { pattern: 'hdmi cable',   image: '/images/pc/Cable HDMI 1.5M.jpg' },
    { pattern: 'dvi cable',    image: '/images/pc/Cable DVI.jpg' },
    { pattern: 'cable dvi',    image: '/images/pc/Cable DVI.jpg' },
    { pattern: 'power pc',     image: '/images/pc/cable power PC.jpg' },
    { pattern: 'power laptop', image: '/images/pc/cable power Laptop.jpg' },
    { pattern: 'cable screen', image: '/images/pc/cable screen.jpg' },
    { pattern: 'screen cable', image: '/images/pc/cable screen.jpg' },

    // Power joints
    { pattern: '9 port',    image: '/images/pc/Power Joint 9 port.jpg' },
    { pattern: '7 port',    image: '/images/pc/Power Joint 7 port.jpg' },
    { pattern: '5 port',    image: '/images/pc/Power Joint 5 port.jpg' },
    { pattern: '3 port',    image: '/images/pc/Power Joint For a 3 port.jpg' },

    // Accessories (Bags, Coolers, Headphones, Caddies)
    { pattern: 'bag laptop cat',   image: '/images/pc/Bag Laptop Back Cat.jpg' },
    { pattern: 'bag laptop back',  image: '/images/pc/Bag Laptop Back.jpg' },
    { pattern: 'bag laptop public',image: '/images/pc/Bag Laptop Public.jpg' },
    { pattern: 'headphone gigamax 1', image: '/images/pc/Headphone Gigamax 1 Socket G530 Pin.jpg' },
    { pattern: 'headphone gigamax 2', image: '/images/pc/Headphone Gigamax 2 Socket G530.jpg' },
    { pattern: 'cooler fn01',      image: '/images/pc/Cooler Fan Laptop FN01.jpg' },
    { pattern: 'fan fn01',         image: '/images/pc/Cooler Fan Laptop FN01.jpg' },
    { pattern: 'cooler giga max',  image: '/images/pc/Cooler Fan Laptop Giga max.jpg' },
    { pattern: 'fan giga max',     image: '/images/pc/Cooler Fan Laptop Giga max.jpg' },
    { pattern: 'caddy fat',        image: '/images/pc/Caddy Fat.jpg' },
    { pattern: 'caddy slim',       image: '/images/pc/Caddy Slim.jpg' },
    { pattern: 'speaker g.max',    image: '/images/pc/Speaker G.Max RGB.jpg' },
    { pattern: 'speaker mjk',      image: '/images/pc/Speaker MJK 1007.jpg' },
    { pattern: 'speaker point',    image: '/images/pc/Speaker Point 122.jpg' },

    // Keyboard / Mouse combos & specific K.B models
    { pattern: 'mouse wireless dell',       image: '/images/pc/K.B + Mouse Wireless Dell.jpg' },
    { pattern: 'mouse wireless fv300',      image: '/images/pc/K.B + Mouse Wireless Fv300.jpg' },
    { pattern: 'k.b + mouse wireless dell', image: '/images/pc/K.B + Mouse Wireless Dell.jpg' },
    { pattern: 'k.b + mouse wireless fv300', image: '/images/pc/K.B + Mouse Wireless Fv300.jpg' },
    { pattern: 'k.b jill usb',              image: '/images/pc/K.B Jill USB.jpg' },
    { pattern: 'k.b original usb dell new', image: '/images/pc/K.B original USB Dell New.jpg' },
    { pattern: 'k.b original usb dell',     image: '/images/pc/K.B original USB Dell New.jpg' },
    { pattern: 'k.b original usb',          image: '/images/pc/K.B original USB.jpg' },
    { pattern: 'k.b usb new',               image: '/images/pc/K.B USB New.jpg' },
    { pattern: 'mouse hp,dell original',    image: '/images/pc/Mouse HP,Dell original.jpg' },
    { pattern: 'mouse lenovo',              image: '/images/pc/Mouse Lenovo USB.jpg' },
    { pattern: 'mouse targus',              image: '/images/pc/Mouse Targus USB.jpg' },
    { pattern: 'mouse usb dell',            image: '/images/pc/MOUSE USB Dell.jpg' },
    { pattern: 'mouse usb hp',              image: '/images/pc/MOUSE USB HP.jpg' },
    { pattern: 'mouse bluetooth',           image: '/images/pc/MOUSE W.L Bluetooth.jpg' },
    { pattern: 'mouse pad 2b',              image: '/images/pc/Mouse Pad 2B.jpg' },
];

// ─── Smart laptop image picker ────────────────────────────────────────────────
export function getSmartLaptopImage(brand: string, modelName: string, index: number): string {
    const combined = `${brand} ${modelName}`.toLowerCase();

    // 1. Try exact model pattern map first (most specific)
    for (const { pattern, image } of LAPTOP_MODEL_MAP) {
        if (combined.includes(pattern.toLowerCase())) {
            return image;
        }
    }

    // 2. ThinkPad / Lenovo gaming
    if (combined.includes('thinkpad')) {
        return combined.includes('x1') || combined.includes('x13') || combined.includes('t14')
            ? '/images/laptops/thinkpad2.jpg'
            : '/images/laptops/thinkpad.jpg';
    }
    if (combined.includes('loq') || combined.includes('legion') || combined.includes('ideapad gaming')) {
        return '/images/laptops/lenovoLOQ.jpg';
    }

    // 3. Brand pools with rotation
    if (combined.includes('lenovo') || brand.toLowerCase() === 'lenovo') {
        const pool = LAPTOP_IMAGE_POOLS.lenovo;
        return pool[index % pool.length];
    }
    if (combined.startsWith('hp') || combined.includes(' hp') || brand.toLowerCase() === 'hp') {
        const pool = LAPTOP_IMAGE_POOLS.hp;
        return pool[index % pool.length];
    }
    if (combined.includes('dell') || brand.toLowerCase() === 'dell') {
        const pool = LAPTOP_IMAGE_POOLS.dell;
        return pool[index % pool.length];
    }
    if (combined.includes('asus') || brand.toLowerCase() === 'asus') {
        return '/images/laptops/asus.png';
    }

    return '/images/laptops/HP.jpg';
}

// ─── Smart PC image picker ────────────────────────────────────────────────────
export function getSmartPcImage(itemName: string, index: number): string {
    const lower = itemName.toLowerCase();

    // 1. Try exact model pattern map (most specific — e.g. "GTX 1660", "LED 27")
    for (const { pattern, image } of PC_MODEL_MAP) {
        if (lower.includes(pattern.toLowerCase())) {
            return image;
        }
    }

    // 2. Try keyword pools (category-level match)
    const keywords = Object.keys(PC_IMAGE_POOLS).filter(k => k !== 'default');
    for (const kw of keywords) {
        let isMatch = lower.includes(kw);
        
        // Custom keyword expansions for abbreviations and synonyms
        if (kw === 'keyboard') {
            isMatch = isMatch || lower.includes('k.b') || lower.includes('kb') || lower.includes('k.b.');
        } else if (kw === 'ram') {
            isMatch = isMatch || lower.includes('memory');
        } else if (kw === 'ssd') {
            isMatch = isMatch || lower.includes('solid state') || lower.includes('nvme') || lower.includes('m.2');
        } else if (kw === 'hdd') {
            isMatch = isMatch || lower.includes('hard disk') || lower.includes('hard drive') || lower.includes('h.d.d');
        } else if (kw === 'led') {
            isMatch = isMatch || lower.includes('monitor') || lower.includes('screen') || lower.includes('display');
        } else if (kw === 'vga') {
            isMatch = isMatch || lower.includes('gpu') || lower.includes('graphics') || lower.includes('nvidia') || lower.includes('ati') || lower.includes('gtx') || lower.includes('geforce') || lower.includes('radeon');
        } else if (kw === 'cable') {
            isMatch = isMatch || lower.includes('wire') || lower.includes('vga to') || lower.includes('dp to') || lower.includes('hdmi');
        } else if (kw === 'power') {
            isMatch = isMatch || lower.includes('ups') || lower.includes('joint') || lower.includes('strip') || lower.includes('charger') || lower.includes('adaptor') || lower.includes('adapter');
        } else if (kw === 'desktop') {
            isMatch = isMatch || lower.includes('pc case') || lower.includes('pc unit') || lower.includes('desktop') || lower.includes('optiplix') || lower.includes('dell optiplex') || lower.includes('dell optiplix') || lower.includes('cpu') || lower.includes('processor') || lower.includes('i3') || lower.includes('i5') || lower.includes('i7') || lower.includes('i9') || lower.includes('ryzen') || lower.includes('used core') || lower.includes('hp amd');
        }

        if (isMatch) {
            const pool = PC_IMAGE_POOLS[kw];
            return pool[index % pool.length];
        }
    }

    // 3. Default fallback
    return PC_IMAGE_POOLS.default[index % PC_IMAGE_POOLS.default.length];
}

// ─── Smart image details resolver (checks for exact specific match vs fallback) ────────────────
export function getSmartImageDetails(
    category: string,
    brand: string,
    modelName: string,
    index: number
): { image: string; isSpecific: boolean } {
    const combined = `${brand} ${modelName}`.toLowerCase();
    const lowerModel = modelName.toLowerCase();

    if (category === 'Laptop') {
        // Check if it matches a specific pattern in LAPTOP_MODEL_MAP
        for (const { pattern, image } of LAPTOP_MODEL_MAP) {
            if (combined.includes(pattern.toLowerCase())) {
                return { image, isSpecific: true };
            }
        }
        // If it's a thinkpad, check if it's Lenovo ThinkPad T495.jpg
        if (combined.includes('thinkpad')) {
            if (combined.includes('t495')) {
                return { image: '/images/laptops/Lenovo ThinkPad T495.jpg', isSpecific: true };
            }
        }
        const image = getSmartLaptopImage(brand, modelName, index);
        // Compare filename to check if it's a specific match
        const filename = image.split('/').pop()?.replace(/\.[^/.]+$/, "").toLowerCase() || "";
        const isSpecific = lowerModel.includes(filename) || filename.includes(lowerModel);
        return { image, isSpecific };
    } else {
        // PC Part
        for (const { pattern, image } of PC_MODEL_MAP) {
            if (lowerModel.includes(pattern.toLowerCase())) {
                return { image, isSpecific: true };
            }
        }
        const image = getSmartPcImage(modelName, index);
        const filename = image.split('/').pop()?.replace(/\.[^/.]+$/, "").toLowerCase() || "";
        // If the filename (e.g. "ram 8GB Crucial PC Used DDR4 2400") is a close match, it's specific.
        // Otherwise, it's generic fallback.
        const isSpecific = lowerModel.includes(filename) || filename.includes(lowerModel);
        return { image, isSpecific };
    }
}

// ─── String hash helper ───────────────────────────────────────────────────────
export function getStringHash(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}
