import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { getProducts } from '@/app/lib/store';
import { generatePost } from '@/app/lib/image-generator';
import { generateCatalogPostText } from '@/app/lib/post-text';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const user = getCurrentUser(req);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        let categories: string[] | undefined = undefined;
        try {
            const body = await req.json();
            if (body && Array.isArray(body.categories)) {
                categories = body.categories;
            }
        } catch {
            // No body or invalid JSON is fine
        }

        const allProducts = await getProducts();
        if (allProducts.length === 0) {
            return NextResponse.json(
                { error: 'No products found. Please upload a catalog first.' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

        // Filter products for the post.txt list if categories are specified
        let textProducts = allProducts;
        if (categories && categories.length > 0) {
            const lowerCats = new Set(categories.map(c => c.toLowerCase()));
            textProducts = allProducts.filter(p => lowerCats.has(p.category.toLowerCase()));
        }

        // Build the post text (Arabic + English, date + product list)
        const postText = generateCatalogPostText(textProducts);

        // Generate images and save to Post generation/<date>/ (only for the requested categories)
        const result = await generatePost(allProducts, postText, baseUrl, categories);

        return NextResponse.json({
            success: true,
            folderPath:      result.folderPath,
            textFilePath:    result.textFilePath,
            totalImages:     result.totalImages,
            laptopsGenerated: result.laptopsGenerated,
            pcsGenerated:    result.pcsGenerated,
            errors:          result.errors,
        });
    } catch (error: unknown) {
        console.error('Generate post error:', error);
        const msg = error instanceof Error ? error.message : 'Failed to generate post.';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
