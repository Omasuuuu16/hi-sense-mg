"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, X, ChevronDown } from 'lucide-react';

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

interface AddDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    productToEdit?: Product | null;
}

const CATEGORIES = ['Laptop', 'PC'];

const PC_SECTIONS = [
    'HDD & SSD',
    'Monitors',
    'Mice & Keyboards',
    'RAM',
    'Graphics Cards',
    'Desktop PCs',
    'Accessories',
];

export default function AddDeviceModal({ isOpen, onClose, onSuccess, onError, productToEdit }: AddDeviceModalProps) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [specs, setSpecs] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Laptop');
    const [section, setSection] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setBrand(productToEdit.brand);
            setModel(productToEdit.model);
            setSpecs(productToEdit.specs);
            setPrice(String(productToEdit.price));
            setCategory(productToEdit.category);
            setSection(productToEdit.section || '');
        } else {
            setBrand('');
            setModel('');
            setSpecs('');
            setPrice('');
            setCategory('Laptop');
            setSection('');
        }
    }, [productToEdit, isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !model || !specs || !price) return;
        if (category === 'PC' && !section) return;

        setLoading(true);
        try {
            const url = productToEdit ? `/api/products/${productToEdit.id}` : '/api/products';
            const method = productToEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    brand, 
                    model, 
                    specs, 
                    price: Number(price), 
                    category, 
                    section: category === 'PC' ? section : undefined 
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                const msg = data.details ? `${data.error}: ${JSON.stringify(data.details)}` : (data.error || 'Failed to save device.');
                onError(msg);
            } else {
                onSuccess(productToEdit ? `"${model}" updated successfully!` : `"${model}" added successfully!`);
                handleClose();
            }
        } catch (err) {
            console.error("Save device error:", err);
            onError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-white/10 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    {productToEdit ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">
                                        {productToEdit ? 'Edit Device' : 'Add New Device'}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {productToEdit ? 'Modify details of this product' : 'Fill in the device details below'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="px-8 py-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category *</label>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={e => { setCategory(e.target.value); setSection(''); }}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white appearance-none cursor-pointer font-semibold text-sm shadow-sm transition-all"
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* PC Section (only for PC category) */}
                                    {category === 'PC' && (
                                        <div>
                                            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Section *</label>
                                            <div className="relative">
                                                <select
                                                    value={section}
                                                    onChange={e => setSection(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white appearance-none cursor-pointer font-semibold text-sm shadow-sm transition-all"
                                                    required={category === 'PC'}
                                                >
                                                    <option value="">Select...</option>
                                                    {PC_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Brand */}
                                    <div className={category !== 'PC' ? 'col-span-1' : 'col-span-2'}>
                                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Brand *</label>
                                        <input
                                            type="text"
                                            value={brand}
                                            onChange={e => setBrand(e.target.value)}
                                            placeholder="e.g. Dell, HP, Lenovo..."
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm shadow-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Model *</label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={e => setModel(e.target.value)}
                                        placeholder="e.g. Latitude 5420, ThinkPad X1..."
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm shadow-sm transition-all"
                                    />
                                </div>

                                {/* Specs */}
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Specifications *</label>
                                    <textarea
                                        value={specs}
                                        onChange={e => setSpecs(e.target.value)}
                                        placeholder="e.g. Core i5 10th Gen, 8GB RAM, 256GB SSD..."
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm shadow-sm transition-all resize-none"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Price (EGP) *</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="e.g. 15000"
                                        required
                                        min={1}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm shadow-sm transition-all"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={handleClose} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !brand || !model || !specs || !price || (category === 'PC' && !section)}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            productToEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                                        )}
                                        {loading ? 'Saving...' : (productToEdit ? 'Save Changes' : 'Add Device')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
