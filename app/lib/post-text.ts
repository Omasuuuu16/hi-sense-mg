import type { StoreProduct } from './redis-store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hi-sense-mg.vercel.app';

export function formatDateAr(date = new Date()): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
}

export function generateCatalogPostText(products: StoreProduct[], date = new Date()): string {
    const laptops = products.filter(p => p.category.toLowerCase() === 'laptop');
    const pcs = products.filter(p => p.category.toLowerCase() === 'pc');

    const lines: string[] = [
        '🔥 المنتجات المتوفرة لدينا حالياً',
        '',
        `📅 ${formatDateAr(date)}`,
        '',
    ];

    if (laptops.length > 0) {
        lines.push('💻 أجهزة اللابتوب:');
        laptops.forEach(p => lines.push(`• ${p.model} - ${Number(p.price).toLocaleString('en-US')} EGP`));
        lines.push('');
    }

    if (pcs.length > 0) {
        lines.push('🖥️ قطع الكمبيوتر:');
        pcs.forEach(p => lines.push(`• ${p.model} - ${Number(p.price).toLocaleString('en-US')} EGP`));
        lines.push('');
    }

    lines.push(`🌐 ${SITE_URL}`);

    return lines.join('\n');
}

/** Legacy wrapper for backward compatibility */
export function generateLaptopPostText(products: StoreProduct[], date = new Date()): string {
    return generateCatalogPostText(products, date);
}

export function generateUpdatePostText(
    comparison: { new: string[]; deleted: string[]; unchanged: string[] },
    allProducts: StoreProduct[],
    date = new Date()
): string {
    const lines: string[] = [
        '🔥 تحديث قائمة المنتجات',
        '',
        `📅 ${formatDateAr(date)}`,
        '',
    ];

    const newItems = comparison.new || [];
    const deletedItems = comparison.deleted || [];

    if (newItems.length > 0) {
        lines.push('✅ منتجات جديدة تم إضافتها:');
        newItems.forEach(m => lines.push(`• ${m}`));
        lines.push('');
    }

    if (deletedItems.length > 0) {
        lines.push('❌ منتجات لم تعد متوفرة:');
        deletedItems.forEach(m => lines.push(`• ${m}`));
        lines.push('');
    }

    const laptops = allProducts.filter(p => p.category.toLowerCase() === 'laptop');
    const pcs = allProducts.filter(p => p.category.toLowerCase() === 'pc');

    if (laptops.length > 0) {
        lines.push('📋 أجهزة اللابتوب المتوفرة حالياً:');
        laptops.forEach(p => lines.push(`• ${p.model} - ${Number(p.price).toLocaleString('en-US')} EGP`));
        lines.push('');
    }

    if (pcs.length > 0) {
        lines.push('🖥️ قطع الكمبيوتر المتوفرة حالياً:');
        pcs.forEach(p => lines.push(`• ${p.model} - ${Number(p.price).toLocaleString('en-US')} EGP`));
        lines.push('');
    }

    lines.push(`🌐 ${SITE_URL}`);

    return lines.join('\n');
}
