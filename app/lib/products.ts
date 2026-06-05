import { getProducts as storeGetProducts, getProductById as storeGetProductById, type Product } from './store';

export type { Product };

export async function getProducts(): Promise<Product[]> {
    try {
        return await storeGetProducts();
    } catch (e) {
        console.error("Failed to load products:", e);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        return await storeGetProductById(id);
    } catch (e) {
        console.error(`Failed to load product ${id}:`, e);
        return undefined;
    }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        return await storeGetProducts(category);
    } catch (e) {
        console.error(`Failed to load products for category ${category}:`, e);
        return [];
    }
}
