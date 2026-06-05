import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

// DELETE /api/products/:id
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        // 1. Authenticate Admin
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const { id } = await context.params;

        // Check if exists
        const products = await dbQuery('SELECT id FROM products WHERE id = ?', [id]);
        if (!products || products.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Delete from database
        await dbQuery('DELETE FROM products WHERE id = ?', [id]);

        console.log(`Product deleted from database: ${id}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json({ error: 'Failed to delete product from database.' }, { status: 500 });
    }
}

// PUT /api/products/:id
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        // 1. Authenticate Admin
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const { id } = await context.params;

        // Check if exists
        const products = await dbQuery('SELECT id FROM products WHERE id = ?', [id]);
        if (!products || products.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const body = await req.json();
        const { brand, model, specs, price, category, section, image } = body;

        // Validation
        const errors: Record<string, string> = {};
        if (!String(model || '').trim()) {
            errors.model = 'Model is required';
        }
        if (!String(specs || '').trim()) {
            errors.specs = 'Specifications are required';
        }
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            errors.price = 'Price must be a valid number greater than 0';
        }
        if (!String(category || '').trim()) {
            errors.category = 'Category is required';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        const brandVal = String(brand || 'Generic').trim();
        const categoryVal = String(category).trim();
        const sectionVal = section ? String(section).trim() : null;
        const imageVal = image ? String(image).trim() : null;

        // Update in database
        if (imageVal) {
            await dbQuery(
                'UPDATE products SET category = ?, brand = ?, model = ?, specs = ?, price = ?, section = ?, image = ? WHERE id = ?',
                [categoryVal, brandVal, model, specs, numericPrice, sectionVal, imageVal, id]
            );
        } else {
            await dbQuery(
                'UPDATE products SET category = ?, brand = ?, model = ?, specs = ?, price = ?, section = ? WHERE id = ?',
                [categoryVal, brandVal, model, specs, numericPrice, sectionVal, id]
            );
        }

        console.log(`Product updated in database: ${id}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT product error:", error);
        return NextResponse.json({ error: 'Failed to update product in database.' }, { status: 500 });
    }
}
