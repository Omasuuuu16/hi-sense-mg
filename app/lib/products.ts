import { dbQuery } from './db';

export interface Product {
    id: string;
    category: string;
    brand: string;
    model: string;
    specs: string;
    price: number;
    section?: string;
    image?: string;
}

export async function getProducts(): Promise<Product[]> {
    try {
        return await dbQuery('SELECT * FROM products ORDER BY created_at DESC');
    } catch (e) {
        console.error("Failed to load products from database:", e);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        const rows = await dbQuery('SELECT * FROM products WHERE id = ?', [id]);
        if (rows && rows.length > 0) {
            return rows[0];
        }
        return undefined;
    } catch (e) {
        console.error(`Failed to load product ${id} from database:`, e);
        return undefined;
    }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        return await dbQuery('SELECT * FROM products WHERE LOWER(category) = ? ORDER BY created_at DESC', [category.toLowerCase()]);
    } catch (e) {
        console.error(`Failed to load products for category ${category} from database:`, e);
        return [];
    }
}

