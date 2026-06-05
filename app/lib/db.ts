import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Connection config matching standard XAMPP defaults
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'hisense_db';

let pool: mysql.Pool | null = null;
let initialized = false;

async function getPool(): Promise<mysql.Pool> {
    if (!pool) {
        // Create pool without database first to allow database auto-creation if not exists
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

export async function initializeDB() {
    if (initialized) return;

    try {
        const tempPool = await getPool();

        // 1. Create database if it doesn't exist
        await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`Database '${DB_NAME}' created or already exists.`);

        // Recreate pool with the specific database selected
        await tempPool.end();
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'products' verified.");

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

        initialized = true;
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
