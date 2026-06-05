"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage as useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Trash2, Pencil } from 'lucide-react';

interface Product {
    id: string;
    category: string;
    brand: string;
    model: string;
    specs: string;
    price: number;
    section?: string;
    image?: string;
}

interface ProductCardProps {
    product: Product;
    onDeleteClick?: (product: Product) => void;
    onEditClick?: (product: Product) => void;
}

// ── Real laptop images from /public/images/laptops/ ──────────────────────────
const LAPTOP_IMAGE_POOLS: Record<string, string[]> = {
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
        '/images/laptops/HP Z Book Studio G7.jpg',
        '/images/laptops/Dell Latitude 7400.jpg',
    ],
    default: [
        '/images/laptops/Dell Latitude 5420.jpg',
        '/images/laptops/HP Pro Book 640 G5.jpg',
        '/images/laptops/Lenovo ThinkPad T495.jpg',
        '/images/laptops/HP Z Book G6.jpg',
        '/images/laptops/Dell Latitude 7400.jpg',
    ],
};

// ── Real PC images from /public/images/pc/ ────────────────────────────────────
const PC_IMAGE_POOLS: Record<string, string[]> = {
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
    const key = brand.toLowerCase().split(' ')[0];
    const pool = LAPTOP_IMAGE_POOLS[key] ?? LAPTOP_IMAGE_POOLS.default;
    // Try to match model name to a specific image first
    const modelLower = modelName.toLowerCase();
    for (const img of pool) {
        const filename = img.split('/').pop()?.toLowerCase() ?? '';
        if (modelLower.includes('latitude') && filename.includes('latitude')) return img;
        if (modelLower.includes('inspiron') && filename.includes('inspiron')) return img;
        if (modelLower.includes('thinkpad') && filename.includes('thinkpad')) return img;
        if (modelLower.includes('probook') && filename.includes('pro book')) return img;
        if (modelLower.includes('zbook') && filename.includes('z book')) return img;
    }
    return pool[index % pool.length];
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

// Brand accent colors for badges
const brandAccent: Record<string, string> = {
    hp:     'bg-blue-100 text-blue-700 border-blue-200',
    dell:   'bg-sky-100 text-sky-700 border-sky-200',
    lenovo: 'bg-slate-100 text-slate-700 border-slate-200',
    acer:   'bg-green-100 text-green-700 border-green-200',
    asus:   'bg-purple-100 text-purple-700 border-purple-200',
    apple:  'bg-gray-100 text-gray-700 border-gray-200',
    default:'bg-indigo-100 text-indigo-700 border-indigo-200',
};

function getBrandAccent(brand: string) {
    return brandAccent[brand.toLowerCase()] ?? brandAccent.default;
}

function getStringHash(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export default function ProductCard({ product, onDeleteClick, onEditClick }: ProductCardProps) {
    const { t, isRTL } = useLang();
    const { isAdmin } = useAuth();
    const [imageError, setImageError] = useState(false);

    const imageSrc = !imageError && product.image ? product.image : null;
    const fallbackIndex = getStringHash(product.model + '-' + product.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* Admin Controls — always visible on admin, not hover-only */}
            {isAdmin && (
                <div className="absolute top-2.5 left-2.5 z-30 flex gap-1.5">
                    {onEditClick && (
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); onEditClick(product); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                            title="Edit"
                        >
                            <Pencil className="w-3 h-3" />
                            Edit
                        </button>
                    )}
                    {onDeleteClick && (
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); onDeleteClick(product); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold shadow-md hover:bg-red-600 active:scale-95 transition-all"
                            title="Delete"
                        >
                            <Trash2 className="w-3 h-3" />
                            Del
                        </button>
                    )}
                </div>
            )}

            {/* Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden flex-shrink-0">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={product.model}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    // Smart fallback: show first available real image based on brand/model
                    <Image
                        src={
                            product.category === 'Laptop'
                                ? getSmartLaptopImage(product.brand, product.model, fallbackIndex)
                                : getSmartPcImage(product.model, fallbackIndex)
                        }
                        alt={product.model}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                )}

                {/* Brand badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getBrandAccent(product.brand)}`}>
                        {product.brand}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4">
                {/* Section tag */}
                {product.section && (
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">
                        {product.section}
                    </span>
                )}

                <h3 className="text-sm font-bold text-slate-800 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                    {product.model}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 flex-grow leading-relaxed mb-3 font-medium">
                    {product.specs}
                </p>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-none mb-1">Price</p>
                        <p className="text-base font-black text-blue-600 leading-none">
                            {product.price.toLocaleString()}
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1">EGP</span>
                        </p>
                    </div>

                    <Link
                        href={`/product/${product.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors active:scale-95 shadow-sm"
                    >
                        Details
                        {isRTL
                            ? <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                            : <ArrowRight className="w-3.5 h-3.5" />
                        }
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
