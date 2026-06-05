import { dbQuery } from './db';
import {
    redisGetProducts,
    redisGetProductById,
    redisInsertProduct,
    redisUpdateProduct,
    redisDeleteProduct,
    redisDeleteAllProducts,
    redisBulkInsertProducts,
    redisGetUserByEmail,
    redisEmailExists,
    redisInsertUser,
    type StoreProduct,
    type StoreUser,
} from './redis-store';

export type { StoreProduct as Product, StoreUser as User };

/** Use Redis on Vercel (serverless); MySQL locally with XAMPP. */
export function useRedisStore(): boolean {
    if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') return false;
    return process.env.VERCEL === '1' && !!process.env.REDIS_URL;
}

function normalizeMysqlProduct(row: any): StoreProduct {
    return { ...row, price: Number(row.price) };
}

export async function getProducts(category?: string): Promise<StoreProduct[]> {
    if (useRedisStore()) return redisGetProducts(category);

    if (category) {
        const rows = await dbQuery(
            'SELECT * FROM products WHERE LOWER(category) = ? ORDER BY created_at DESC',
            [category.toLowerCase()]
        );
        return rows.map(normalizeMysqlProduct);
    }
    const rows = await dbQuery('SELECT * FROM products ORDER BY created_at DESC');
    return rows.map(normalizeMysqlProduct);
}

export async function getProductById(id: string): Promise<StoreProduct | undefined> {
    if (useRedisStore()) return redisGetProductById(id);

    const rows = await dbQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (rows?.length > 0) return normalizeMysqlProduct(rows[0]);
    return undefined;
}

export async function productExists(id: string): Promise<boolean> {
    const product = await getProductById(id);
    return !!product;
}

export async function insertProduct(product: StoreProduct) {
    if (useRedisStore()) return redisInsertProduct(product);

    await dbQuery(
        'INSERT INTO products (id, category, brand, model, specs, price, section, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.id, product.category, product.brand, product.model, product.specs, product.price, product.section ?? null, product.image ?? null]
    );
}

export async function updateProduct(id: string, data: Partial<StoreProduct>) {
    if (useRedisStore()) return redisUpdateProduct(id, data);

    if (data.image) {
        await dbQuery(
            'UPDATE products SET category = ?, brand = ?, model = ?, specs = ?, price = ?, section = ?, image = ? WHERE id = ?',
            [data.category, data.brand, data.model, data.specs, data.price, data.section ?? null, data.image, id]
        );
    } else {
        await dbQuery(
            'UPDATE products SET category = ?, brand = ?, model = ?, specs = ?, price = ?, section = ? WHERE id = ?',
            [data.category, data.brand, data.model, data.specs, data.price, data.section ?? null, id]
        );
    }
}

export async function deleteProduct(id: string) {
    if (useRedisStore()) return redisDeleteProduct(id);
    await dbQuery('DELETE FROM products WHERE id = ?', [id]);
}

export async function deleteAllProducts() {
    if (useRedisStore()) return redisDeleteAllProducts();
    await dbQuery('DELETE FROM products');
}

export async function bulkInsertProducts(items: StoreProduct[]) {
    if (useRedisStore()) return redisBulkInsertProducts(items);

    for (const prod of items) {
        await dbQuery(
            'INSERT INTO products (id, category, brand, model, specs, price, section, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [prod.id, prod.category, prod.brand, prod.model, prod.specs, prod.price, prod.section ?? null, prod.image ?? null]
        );
    }
}

export async function getUserByEmail(email: string): Promise<StoreUser | undefined> {
    if (useRedisStore()) return redisGetUserByEmail(email);

    const rows = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (rows?.length > 0) return rows[0];
    return undefined;
}

export async function emailExists(email: string): Promise<boolean> {
    if (useRedisStore()) return redisEmailExists(email);

    const rows = await dbQuery('SELECT id FROM users WHERE email = ?', [email]);
    return rows && rows.length > 0;
}

export async function insertUser(user: Omit<StoreUser, 'id' | 'created_at'>) {
    if (useRedisStore()) return redisInsertUser(user);

    await dbQuery(
        'INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.email, user.password, user.phone, user.role]
    );
}
