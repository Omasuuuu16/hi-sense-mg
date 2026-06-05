"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import AddDeviceModal from './AddDeviceModal';
import Toast from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Monitor, Mouse, Cable, Cpu, MemoryStick, Plus, Trash2, AlertTriangle, X } from 'lucide-react';

interface Product {
    id: string;
    category: string;
    brand: string;
    model: string;
    specs: string;
    price: number;
    section?: string;
    image?: string;
}

// Define PC subcategories with icons
const PC_SUBCATEGORIES = [
    { id: 'all', label: 'All', icon: Cpu },
    { id: 'hdd-ssd', label: 'HDD & SSD', icon: HardDrive, keywords: ['hdd', 'ssd', 'nvme', 'passport', 'h.s', 'lexar', 'kingston'] },
    { id: 'monitors', label: 'Monitors', icon: Monitor, keywords: ['led', 'monitor', 'lcd'] },
    { id: 'mice-keyboards', label: 'Mice & Keyboards', icon: Mouse, keywords: ['mouse', 'k.b', 'keyboard', 'wireless'] },
    { id: 'ram', label: 'RAM', icon: MemoryStick, keywords: ['ram', 'ddr'] },
    { id: 'graphics', label: 'Graphics Cards', icon: Cpu, keywords: ['vga', 'gtx', 'nvidia', 'ati'] },
    { id: 'desktops', label: 'Desktop PCs', icon: Cpu, keywords: ['core i', 'optiplex', 'amd a6'] },
    { id: 'accessories', label: 'Accessories', icon: Cable, keywords: ['flash', 'headphone', 'bag', 'adaptor', 'speaker', 'cable'] },
];

export default function PCFilterableGrid({ title }: { title: string }) {
    const { t, isRTL } = useLanguage();
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);
    
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ visible: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ visible: true, message, type });
    };

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products?category=PC');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (e) {
            console.error("Failed fetching PC products:", e);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const subcategoryFilteredProducts = useMemo(() => {
        if (selectedSubcategory === 'all') return products;
        const subcategory = PC_SUBCATEGORIES.find(s => s.id === selectedSubcategory);
        if (!subcategory || !subcategory.keywords) return products;
        return products.filter(product => {
            const searchText = `${product.model} ${product.specs}`.toLowerCase();
            return subcategory.keywords!.some(keyword => searchText.includes(keyword.toLowerCase()));
        });
    }, [products, selectedSubcategory]);

    const brands = useMemo(() => {
        const brandSet = new Set(subcategoryFilteredProducts.map(p => p.brand).filter(Boolean));
        return ['All', ...Array.from(brandSet).sort()];
    }, [subcategoryFilteredProducts]);

    const filteredProducts = useMemo(() => {
        return subcategoryFilteredProducts.filter(product => {
            const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
            const matchesSearch = product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.specs.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesBrand && matchesSearch;
        });
    }, [subcategoryFilteredProducts, selectedBrand, searchQuery]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            setDeleteTarget(null);
            if (!res.ok) {
                showToast(data.error || 'Failed to delete device.', 'error');
            } else {
                showToast(`"${deleteTarget.model}" deleted successfully!`, 'success');
                await fetchProducts();
            }
        } catch (err) {
            showToast('Connection error. Failed to delete device.', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" />
                            Add Device
                        </button>
                    )}
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {PC_SUBCATEGORIES.map(subcategory => {
                            const Icon = subcategory.icon;
                            return (
                                <button
                                    key={subcategory.id}
                                    onClick={() => { setSelectedSubcategory(subcategory.id); setSelectedBrand('All'); }}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-medium transition-all ${selectedSubcategory === subcategory.id ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-foreground'}`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-xs text-center">{subcategory.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={`flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-black/20 p-4 rounded-2xl glass dark:glass-dark ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex flex-wrap gap-2">
                        {brands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(brand)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedBrand === brand ? 'bg-primary text-white shadow-lg' : 'bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-foreground'}`}
                            >
                                {brand === 'All' ? t('all') : brand}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border border-gray-200 bg-white text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProductCard 
                            product={product} 
                            onDeleteClick={setDeleteTarget} 
                            onEditClick={setProductToEdit}
                        />
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">No products found matching your criteria.</div>
            )}

            {/* Add / Edit Product Modal */}
            <AddDeviceModal
                isOpen={showAddModal || !!productToEdit}
                onClose={() => { setShowAddModal(false); setProductToEdit(null); }}
                productToEdit={productToEdit}
                onSuccess={msg => { showToast(msg, 'success'); fetchProducts(); }}
                onError={msg => showToast(msg, 'error')}
            />

            {/* Custom Confirm Delete Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 dark:border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-xl">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <h2 className="text-lg font-bold text-foreground">Confirm Delete</h2>
                                </div>
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete <span className="font-bold text-foreground">"{deleteTarget.model}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={() => setToast(t => ({ ...t, visible: false }))}
            />
        </div>
    );
}
