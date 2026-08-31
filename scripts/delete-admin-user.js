/**
 * One-time script to delete the legacy admin@hisense.com account from Redis.
 *
 * Usage (requires REDIS_URL in env):
 *   1. Pull Vercel production env:  npx vercel env pull --environment=production .env.production.local
 *   2. Run this script:             node -r dotenv/config scripts/delete-admin-user.js dotenv_config_path=.env.production.local
 *
 * Or if you already have REDIS_URL set in your shell:
 *   REDIS_URL="rediss://..." node scripts/delete-admin-user.js
 */

const { createClient } = require('redis');

const USERS_KEY = 'hisense:users';
const TARGET_EMAIL = 'admin@hisense.com';

async function main() {
    const url = process.env.REDIS_URL;
    if (!url) {
        console.error('ERROR: REDIS_URL environment variable is not set.');
        console.error('Pull the production env first:');
        console.error('  npx vercel env pull --environment=production .env.production.local');
        console.error('Then run:');
        console.error('  node -r dotenv/config scripts/delete-admin-user.js dotenv_config_path=.env.production.local');
        process.exit(1);
    }

    const client = createClient({ url });
    client.on('error', (err) => console.error('Redis error:', err));
    await client.connect();

    console.log('Connected to Redis.');

    const raw = await client.get(USERS_KEY);
    if (!raw) {
        console.log(`Key "${USERS_KEY}" not found in Redis — nothing to delete.`);
        await client.disconnect();
        return;
    }

    const users = JSON.parse(raw);
    console.log(`Found ${users.length} user(s) in Redis.`);

    const before = users.map(u => `  - ${u.email} (role: ${u.role})`).join('\n');
    console.log('Current users:\n' + before);

    const filtered = users.filter(u => u.email.toLowerCase() !== TARGET_EMAIL.toLowerCase());

    if (filtered.length === users.length) {
        console.log(`\nUser "${TARGET_EMAIL}" was NOT found — nothing to delete.`);
    } else {
        await client.set(USERS_KEY, JSON.stringify(filtered));
        console.log(`\n✅ Deleted "${TARGET_EMAIL}" from Redis. Remaining users: ${filtered.length}`);
    }

    await client.disconnect();
    console.log('Done.');
}

main().catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
});
