import { createClient, type RedisClientType } from 'redis';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const PRODUCTS_KEY = 'hisense:products';
const USERS_KEY = 'hisense:users';

let redis: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;
let initialized = false;

async function getRedis(): Promise<RedisClientType> {
    if (redis?.isOpen) return redis;

    if (!connecting) {
        connecting = (async () => {
            const url = process.env.REDIS_URL;
            if (!url) throw new Error('REDIS_URL is not configured');

            const client = createClient({ url });
            client.on('error', (err) => console.error('Redis error:', err));
            await client.connect();
            redis = client as RedisClientType;
            return redis;
        })();
    }

    return connecting;
}

export interface StoreUser {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    created_at?: string;
}

export interface StoreProduct {
    id: string;
    category: string;
    brand: string;
    model: string;
    specs: string;
    price: number;
    section?: string | null;
    image?: string | null;
    created_at?: string;
}

async function ensureInitialized() {
    if (initialized) return;
    const client = await getRedis();

    const users = await client.get(USERS_KEY);
    if (!users) {
        const adminHash = await bcrypt.hash('admin123', 10);
        const defaultUsers: StoreUser[] = [{
            id: 1,
            username: 'Admin',
            email: 'admin@hisense.com',
            password: adminHash,
            phone: '01000000000',
            role: 'Admin',
            created_at: new Date().toISOString(),
        }];
        await client.set(USERS_KEY, JSON.stringify(defaultUsers));
        console.log('Redis: default admin seeded (admin@hisense.com / admin123).');
    }

    const products = await client.get(PRODUCTS_KEY);
    if (!products) {
        const dataPath = path.join(process.cwd(), 'public/data/products.json');
        if (fs.existsSync(dataPath)) {
            const productsJson: StoreProduct[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            await client.set(PRODUCTS_KEY, JSON.stringify(productsJson));
            console.log(`Redis: seeded ${productsJson.length} products from products.json.`);
        }
    }

    initialized = true;
}

async function getUsers(): Promise<StoreUser[]> {
    await ensureInitialized();
    const raw = await (await getRedis()).get(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: StoreUser[]) {
    await (await getRedis()).set(USERS_KEY, JSON.stringify(users));
}

async function getAllProductsRaw(): Promise<StoreProduct[]> {
    await ensureInitialized();
    const raw = await (await getRedis()).get(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

async function saveProducts(products: StoreProduct[]) {
    await (await getRedis()).set(PRODUCTS_KEY, JSON.stringify(products));
}

function normalizeProduct(p: StoreProduct): StoreProduct {
    return { ...p, price: Number(p.price) };
}

export async function redisGetProducts(category?: string): Promise<StoreProduct[]> {
    const products = (await getAllProductsRaw()).map(normalizeProduct);
    if (category) {
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return products;
}

export async function redisGetProductById(id: string): Promise<StoreProduct | undefined> {
    const products = await getAllProductsRaw();
    const found = products.find(p => p.id === id);
    return found ? normalizeProduct(found) : undefined;
}

export async function redisInsertProduct(product: StoreProduct) {
    const products = await getAllProductsRaw();
    products.unshift({ ...product, created_at: new Date().toISOString() });
    await saveProducts(products);
}

export async function redisUpdateProduct(id: string, updates: Partial<StoreProduct>) {
    const products = await getAllProductsRaw();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    products[idx] = { ...products[idx], ...updates };
    await saveProducts(products);
}

export async function redisDeleteProduct(id: string) {
    const products = await getAllProductsRaw();
    await saveProducts(products.filter(p => p.id !== id));
}

export async function redisDeleteAllProducts() {
    await saveProducts([]);
}

export async function redisBulkInsertProducts(items: StoreProduct[]) {
    await saveProducts(items.map(p => ({ ...p, created_at: new Date().toISOString() })));
}

export async function redisReplaceProductsByCategories(categories: string[], items: StoreProduct[]) {
    const normalized = new Set(categories.map(c => c.toLowerCase()));
    const existing = await getAllProductsRaw();
    const kept = existing.filter(p => !normalized.has(p.category.toLowerCase()));
    const merged = [
        ...kept,
        ...items.map(p => ({ ...p, created_at: p.created_at ?? new Date().toISOString() })),
    ];
    await saveProducts(merged);
}

export async function redisGetUserByEmail(email: string): Promise<StoreUser | undefined> {
    const users = await getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function redisEmailExists(email: string): Promise<boolean> {
    const user = await redisGetUserByEmail(email);
    return !!user;
}

export async function redisInsertUser(user: Omit<StoreUser, 'id' | 'created_at'>) {
    const users = await getUsers();
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ ...user, id: nextId, created_at: new Date().toISOString() });
    await saveUsers(users);
}
