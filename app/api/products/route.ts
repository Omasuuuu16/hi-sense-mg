import { NextRequest, NextResponse } from 'next/server';
import { getProducts, insertProduct } from '@/app/lib/store';
import { getCurrentUser } from '@/app/lib/auth';
import { pickLaptopImage, pickPcImage } from '../admin/upload-excel/route';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    try {
        const products = await getProducts(category || undefined);
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET products error:", error);
        return NextResponse.json({ error: 'Failed to fetch products from database' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
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

        const newId = crypto.randomUUID();
        const brandVal = String(brand || 'Generic').trim();
        const categoryVal = String(category).trim();
        const sectionVal = section ? String(section).trim() : null;
        
        let imageVal = image ? String(image).trim() : null;
        if (!imageVal) {
            const randomIndex = Math.floor(Math.random() * 100);
            imageVal = categoryVal.toLowerCase() === 'laptop' 
                ? pickLaptopImage(brandVal, model, randomIndex)
                : pickPcImage(model, randomIndex);
        }

        const product = {
            id: newId,
            category: categoryVal,
            brand: brandVal,
            model,
            specs,
            price: numericPrice,
            section: sectionVal,
            image: imageVal,
        };

        await insertProduct(product);

        console.log(`Product added: ${model}`);
        return NextResponse.json({ success: true, product }, { status: 201 });

    } catch (error) {
        console.error("POST products error:", error);
        return NextResponse.json({ error: 'Failed to save product to database.' }, { status: 500 });
    }
}
