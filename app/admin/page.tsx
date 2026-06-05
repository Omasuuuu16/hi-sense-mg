"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Upload, FileSpreadsheet, Database, Laptop, Cpu,
    CheckCircle2, AlertTriangle, RefreshCw, Plus,
    TrendingUp, Package, LayoutDashboard, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AddDeviceModal from '../components/AddDeviceModal';
import Toast from '../components/Toast';

export default function AdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();

    const [stats,         setStats]         = useState({ total: 0, laptops: 0, pcs: 0 });
    const [uploading,     setUploading]     = useState(false);
    const [file,          setFile]          = useState<File | null>(null);
    const [resultSummary, setResultSummary] = useState<any | null>(null);
    const [showAddModal,  setShowAddModal]  = useState(false);
    const [dragging,      setDragging]      = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

    const showToast = (message: string, type: 'success' | 'error') =>
        setToast({ visible: true, message, type });

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                const laptops = data.filter((p: any) => p.category === 'Laptop').length;
                const pcs     = data.filter((p: any) => p.category === 'PC').length;
                setStats({ total: data.length, laptops, pcs });
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user || !isAdmin) router.push('/login');
            else fetchStats();
        }
    }, [user, isAdmin, loading, router, fetchStats]);

    const handleFileChange = (f: File) => {
        setFile(f);
        setResultSummary(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) handleFileChange(f);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setResultSummary(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res  = await fetch('/api/admin/upload-excel', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok && data.success) {
                setResultSummary(data.summary);
                showToast('Catalog updated successfully!', 'success');
                setFile(null);
                fetchStats();
            } else {
                showToast(data.error || 'Failed to process file.', 'error');
            }
        } catch {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    if (loading || !user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Products', value: stats.total,   icon: Database,    color: 'from-blue-600 to-sky-500',   bg: 'bg-blue-50',   text: 'text-blue-600' },
        { label: 'Laptops',        value: stats.laptops, icon: Laptop,      color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'PC Components',  value: stats.pcs,     icon: Cpu,         color: 'from-sky-500 to-cyan-600',   bg: 'bg-sky-50',    text: 'text-sky-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50/20 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 pt-8">

                {/* ── Header ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-800">Admin Dashboard</h1>
                        </div>
                        <p className="text-slate-400 text-sm ml-13">
                            Welcome back, <span className="font-bold text-blue-600">{user.username}</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={fetchStats}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blue-100 text-slate-600 hover:border-blue-300 hover:text-blue-600 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    </div>
                </motion.div>

                {/* ── Stat Cards ──────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {statCards.map(({ label, value, icon: Icon, color, bg, text }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl border border-blue-100 p-6 flex items-center justify-between shadow-[0_2px_16px_rgba(37,99,235,0.07)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)] transition-shadow"
                        >
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                                <p className={`text-4xl font-black ${text}`}>{value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center`}>
                                <Icon className={`w-7 h-7 ${text}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Section ─────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Upload Card — wider */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 bg-white rounded-2xl border border-blue-100 p-7 shadow-[0_2px_16px_rgba(37,99,235,0.07)]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Update Catalog via Excel</h2>
                                <p className="text-xs text-slate-400">Only the categories in your file will be replaced</p>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-700 text-xs font-medium">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Uploading a <strong>laptop-only</strong> file replaces laptops only. A <strong>PC-only</strong> file replaces PC parts only. Files with both sheets update each category separately. Other categories stay unchanged.</span>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            {/* Drop Zone */}
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
                                    dragging
                                        ? 'border-blue-400 bg-blue-50'
                                        : file
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-blue-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    {file ? (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{file.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="pointer-events-auto text-xs text-red-500 font-semibold hover:underline"
                                                onClick={e => { e.stopPropagation(); setFile(null); }}
                                            >
                                                Remove file
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">Drop Excel file here</p>
                                                <p className="text-xs text-slate-400 mt-0.5">or click to browse · .xlsx / .xls</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                            >
                                {uploading ? (
                                    <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Update Catalog</>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Results / Tips */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 p-7 shadow-[0_2px_16px_rgba(37,99,235,0.07)] flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-sky-600" />
                            </div>
                            <h2 className="text-lg font-black text-slate-800">Import Results</h2>
                        </div>

                        {!resultSummary ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <Package className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">No import yet</p>
                                <p className="text-xs text-slate-300">Results will appear here after processing</p>
                            </div>
                        ) : (
                            <div className="space-y-4 flex-1">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-green-700">Import Successful</p>
                                        <p className="text-xs text-green-600">
                                            {resultSummary.totalAdded} products added
                                            {resultSummary.categoriesReplaced?.length
                                                ? ` · ${resultSummary.categoriesReplaced.join(' & ')} updated`
                                                : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                                        <p className="text-2xl font-black text-blue-600">{resultSummary.laptopsAdded}</p>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Laptops</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-center">
                                        <p className="text-2xl font-black text-sky-600">{resultSummary.pcsAdded}</p>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">PC Parts</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick links */}
                        <div className="mt-6 pt-4 border-t border-blue-50 space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Links</p>
                            {[
                                { href: '/laptops', label: 'View Laptops',   icon: Laptop },
                                { href: '/pcs',     label: 'View PC Parts',  icon: Cpu },
                            ].map(({ href, label, icon: Icon }) => (
                                <a key={href} href={href} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <AddDeviceModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={msg => { showToast(msg, 'success'); fetchStats(); }}
                onError={msg => showToast(msg, 'error')}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={() => setToast(t => ({ ...t, visible: false }))}
            />
        </div>
    );
}
