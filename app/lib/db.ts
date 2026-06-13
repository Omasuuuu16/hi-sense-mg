import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Connection config matching standard XAMPP defaults
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'hisense_db';

// Prevent multiple pools in development due to Next.js Hot Module Replacement (HMR)
const globalForDb = global as unknown as {
    pool: mysql.Pool | undefined;
    initialized: boolean | undefined;
};

async function getPool(): Promise<mysql.Pool> {
    if (!globalForDb.pool) {
        // Create pool without database first to allow database auto-creation if not exists
        globalForDb.pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000
        });
    }
    return globalForDb.pool;
}

export async function initializeDB() {
    if (globalForDb.initialized) return;

    try {
        const tempPool = await getPool();

        // 1. Create database if it doesn't exist
        await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

        // Recreate pool with the specific database selected
        await tempPool.end();
        globalForDb.pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        const pool = globalForDb.pool;

        // 2. Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'User',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'users' verified.");

        // 3. Create products table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(255) PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                brand VARCHAR(100) NOT NULL,
                model VARCHAR(255) NOT NULL,
                specs TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                section VARCHAR(255) NULL,
                image VARCHAR(255) NULL,
                cpu VARCHAR(100) NULL,
                ram VARCHAR(50) NULL,
                ssd VARCHAR(50) NULL,
                display VARCHAR(100) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'products' verified.");

        // Migrate existing tables — add new columns if missing
        const newColumns = [
            { name: 'cpu', def: 'VARCHAR(100) NULL' },
            { name: 'ram', def: 'VARCHAR(50) NULL' },
            { name: 'ssd', def: 'VARCHAR(50) NULL' },
            { name: 'display', def: 'VARCHAR(100) NULL' },
            { name: 'updated_at', def: 'TIMESTAMP NULL DEFAULT NULL' },
        ];
        for (const col of newColumns) {
            try {
                await pool.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.def}`);
            } catch {
                // Column already exists
            }
        }

        // 4. Seed default admin if no users exist
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        const userCount = (users as any)[0]?.count || 0;

        if (userCount === 0) {
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            await pool.query(
                `INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`,
                ['Admin', 'admin@hisense.com', adminPasswordHash, '01000000000', 'Admin']
            );
            console.log("Default Admin user seeded (admin@hisense.com / admin123).");
        }

        // 5. Seed default products if no products exist
        const [prods] = await pool.query('SELECT COUNT(*) as count FROM products');
        const productCount = (prods as any)[0]?.count || 0;

        if (productCount === 0) {
            const dataPath = path.join(process.cwd(), 'public/data/products.json');
            if (fs.existsSync(dataPath)) {
                try {
                    const productsJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                    console.log(`Seeding ${productsJson.length} products from products.json into MySQL...`);
                    
                    for (const prod of productsJson) {
                        await pool.query(
                            `INSERT INTO products (id, category, brand, model, specs, price, section, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                prod.id, 
                                prod.category, 
                                prod.brand, 
                                prod.model, 
                                prod.specs, 
                                prod.price, 
                                prod.section || null, 
                                prod.image || null
                            ]
                        );
                    }
                    console.log("Successfully seeded products table.");
                } catch (err) {
                    console.error("Failed to seed products from JSON:", err);
                }
            } else {
                console.log("No products.json found for seeding.");
            }
        }

        globalForDb.initialized = true;
        console.log("Database initialization complete.");
    } catch (error) {
        console.error("Database initialization failed:", error);
        throw error;
    }
}

export async function dbQuery(sql: string, params?: any[]): Promise<any> {
    await initializeDB();
    const currentPool = await getPool();
    const [rows] = await currentPool.query(sql, params);
    return rows;
}
