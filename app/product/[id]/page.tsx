import React from 'react';
import { getProductById } from '@/app/lib/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Check, Shield } from 'lucide-react';
import { getSmartLaptopImage, getSmartPcImage, getStringHash } from '@/app/lib/image-utils';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // Resolve dynamic smart image based on model & brand if it's not a full external HTTP link
    let finalImage = product.image;
    if (!finalImage || !finalImage.startsWith('http')) {
        const hash = getStringHash(product.model + '-' + product.id);
        finalImage = product.category === 'Laptop'
            ? getSmartLaptopImage(product.brand, product.model, hash)
            : getSmartPcImage(product.model, hash);
    }

    // Fallback image based on category
    const fallbackImage = product.category === 'Laptop'
        ? '/images/laptops/HP.jpg'
        : '/images/pc/ram 8GB Crucial PC Used DDR4 2400.jpg';

    const imageSrc = finalImage || fallbackImage;

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href={`/${product.category.toLowerCase()}s`} className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2 rtl:hidden" />
                    <ArrowLeft className="w-5 h-5 ml-2 hidden rtl:block transform rotate-180" />
                    Back to {product.category}s
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="glass dark:glass-dark rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="relative w-full aspect-square">
                        <Image
                            src={imageSrc}
                            alt={product.model}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <div className="mb-3">
                            <span className="text-sm font-bold px-4 py-2 bg-primary/10 text-primary rounded-full">
                                {product.brand}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{product.model}</h1>
                        {product.section && <p className="text-xl text-primary font-semibold">{product.section}</p>}
                    </div>

                    <div className="glass dark:glass-dark p-6 rounded-2xl border-l-4 border-primary">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Specifications
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {product.specs}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 py-6 border-t border-b border-gray-200 dark:border-white/10">
                        <div className="flex-grow">
                            <p className="text-sm text-gray-500 mb-1">Price</p>
                            <p className="text-4xl font-bold text-foreground">
                                {product.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">EGP</span>
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/contact"
                            className="w-full px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Contact Us
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Available in Stock</span>
                        <span className="mx-2">•</span>
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Verified Condition</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
