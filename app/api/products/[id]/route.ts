import { NextRequest, NextResponse } from 'next/server';
import { productExists, deleteProduct, updateProduct } from '@/app/lib/store';
import { getCurrentUser } from '@/app/lib/auth';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const { id } = await context.params;

        if (!(await productExists(id))) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await deleteProduct(id);

        console.log(`Product deleted: ${id}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json({ error: 'Failed to delete product from database.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const { id } = await context.params;

        if (!(await productExists(id))) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const body = await req.json();
        const { brand, model, specs, price, category, section, image } = body;

        const errors: Record<string, string> = {};
        if (!String(model || '').trim()) errors.model = 'Model is required';
        if (!String(specs || '').trim()) errors.specs = 'Specifications are required';
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) errors.price = 'Price must be a valid number greater than 0';
        if (!String(category || '').trim()) errors.category = 'Category is required';

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        const brandVal = String(brand || 'Generic').trim();
        const categoryVal = String(category).trim();
        const sectionVal = section ? String(section).trim() : null;
        const imageVal = image ? String(image).trim() : null;

        await updateProduct(id, {
            category: categoryVal,
            brand: brandVal,
            model,
            specs,
            price: numericPrice,
            section: sectionVal,
            ...(imageVal ? { image: imageVal } : {}),
        });

        console.log(`Product updated: ${id}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT product error:", error);
        return NextResponse.json({ error: 'Failed to update product in database.' }, { status: 500 });
    }
}
