"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, Laptop } from 'lucide-react';

export default function LoginPage() {
    const { login, user, loading } = useAuth();
    const router = useRouter();

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors]     = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState('');
    const [submitting, setSubmitting]     = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push(user.role === 'Admin' ? '/admin' : '/');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');

        const newErrors: Record<string, string> = {};
        if (!email.trim())  newErrors.email    = 'Email is required';
        if (!password)      newErrors.password = 'Password is required';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setSubmitting(true);
        const result = await login(email, password);
        setSubmitting(false);

        if (!result.success) {
            if (result.details) setErrors(result.details);
            else setGeneralError(result.error || 'Login failed. Check your credentials.');
        }
    };

    if (loading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[92vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-3xl" />
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(37,99,235,0.05) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                            Hi-sense
                        </span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-3xl border border-blue-100 shadow-[0_8px_48px_rgba(37,99,235,0.12)] p-8"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome back</h1>
                        <p className="text-slate-400 text-sm">Sign in to your Hi-sense account</p>
                    </div>

                    {/* General Error */}
                    {generalError && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {generalError}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-3 ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                                            : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-3 ${
                                        errors.password
                                            ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                                            : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                                    }`}
                                />
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {submitting ? (
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 font-bold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </form>
                </motion.div>

                {/* Admin hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6 text-xs text-slate-400"
                >
                    Admin default: <span className="font-mono text-slate-500">admin@hisense.com</span>
                </motion.p>
            </div>
        </div>
    );
}
