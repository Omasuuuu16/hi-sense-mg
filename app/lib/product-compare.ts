import type { StoreProduct } from './redis-store';

export interface ImportComparison {
    new: string[];
    deleted: string[];
    unchanged: string[];
    newProducts: StoreProduct[];
    deletedProducts: StoreProduct[];
    unchangedProducts: StoreProduct[];
}

function normalizeModel(model: string): string {
    return model.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Compare existing products (in categories) with incoming products by model name. */
export function compareProducts(
    existing: StoreProduct[],
    incoming: StoreProduct[],
    categories: string[]
): ImportComparison {
    const catSet = new Set(categories.map(c => c.toLowerCase()));

    const oldInCategory = existing.filter(p => catSet.has(p.category.toLowerCase()));
    const oldByModel = new Map(oldInCategory.map(p => [normalizeModel(p.model), p]));

    const incomingByModel = new Map(incoming.map(p => [normalizeModel(p.model), p]));

    const newProducts: StoreProduct[] = [];
    const unchangedProducts: StoreProduct[] = [];
    const newNames: string[] = [];
    const unchangedNames: string[] = [];

    for (const [key, product] of incomingByModel) {
        const old = oldByModel.get(key);
        if (old) {
            unchangedProducts.push({ ...product, id: old.id, image: old.image ?? product.image });
            unchangedNames.push(product.model);
        } else {
            newProducts.push(product);
            newNames.push(product.model);
        }
    }

    const deletedProducts: StoreProduct[] = [];
    const deletedNames: string[] = [];

    for (const [key, product] of oldByModel) {
        if (!incomingByModel.has(key)) {
            deletedProducts.push(product);
            deletedNames.push(product.model);
        }
    }

    return {
        new: newNames,
        deleted: deletedNames,
        unchanged: unchangedNames,
        newProducts,
        deletedProducts,
        unchangedProducts,
    };
}

/** Merge comparison into final product list for storage. */
export function buildMergedProducts(
    existing: StoreProduct[],
    comparison: ImportComparison,
    categories: string[]
): StoreProduct[] {
    const catSet = new Set(categories.map(c => c.toLowerCase()));
    const kept = existing.filter(p => !catSet.has(p.category.toLowerCase()));
    const now = new Date().toISOString();

    const updated = [
        ...comparison.unchangedProducts,
        ...comparison.newProducts,
    ].map(p => ({ ...p, updated_at: now }));

    return [...kept, ...updated];
}
