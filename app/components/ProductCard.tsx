"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage as useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Trash2, Pencil } from 'lucide-react';
import { getSmartLaptopImage, getSmartPcImage, getStringHash } from '../lib/image-utils';

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

export default function ProductCard({ product, onDeleteClick, onEditClick }: ProductCardProps) {
    const { t, isRTL } = useLang();
    const { isAdmin } = useAuth();
    const [imageError, setImageError] = useState(false);

    let finalImage = product.image;
    if (!finalImage || !finalImage.startsWith('http')) {
        const hash = getStringHash(product.model + '-' + product.id);
        finalImage = product.category === 'Laptop'
            ? getSmartLaptopImage(product.brand, product.model, hash)
            : getSmartPcImage(product.model, hash);
    }

    const imageSrc = !imageError && finalImage ? finalImage : null;

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
                            title={t('edit')}
                        >
                            <Pencil className="w-3 h-3" />
                            {t('edit')}
                        </button>
                    )}
                    {onDeleteClick && (
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); onDeleteClick(product); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold shadow-md hover:bg-red-600 active:scale-95 transition-all"
                            title={t('delete')}
                        >
                            <Trash2 className="w-3 h-3" />
                            {t('delete')}
                        </button>
                    )}
                </div>
            )}

            {/* Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden flex-shrink-0">
                {imageSrc && (
                    <Image
                        src={imageSrc}
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
                        {t(product.section.toLowerCase())}
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
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-none mb-1">{t('price')}</p>
                        <p className="text-base font-black text-blue-600 leading-none">
                            {product.price.toLocaleString()}
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1">{t('egp')}</span>
                        </p>
                    </div>

                    <Link
                        href={`/product/${product.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors active:scale-95 shadow-sm"
                    >
                        {t('viewDetails')}
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
