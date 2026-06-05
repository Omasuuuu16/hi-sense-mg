"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Shield, Laptop, Cpu, Home, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/laptops', label: 'Laptops', icon: Laptop },
    { href: '/pcs', label: 'PCs & Parts', icon: Cpu },
    { href: '/contact', label: 'Contact Us', icon: Phone },
];

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(37,99,235,0.08)] border-b border-blue-100'
                    : 'bg-white/70 backdrop-blur-lg border-b border-blue-50'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-[0_2px_12px_rgba(37,99,235,0.35)]">
                            <Laptop className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent tracking-tight">
                            Hi-sense
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                    {active && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/admin'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-blue-600 hover:bg-blue-50/70'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Auth UI */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-sm text-slate-600 font-semibold">
                                    Hi, <span className="text-blue-600 font-bold">{user.username}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-all">
                                    Login
                                </Link>
                                <Link href="/register" className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md hover:-translate-y-0.5 transition-all">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100 shadow-lg overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === href
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            ))}

                            {isAdmin && (
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="border-t border-blue-50 pt-3 mt-2">
                                {user ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white text-sm font-bold">
                                                {user.username[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{user.username}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setIsMenuOpen(false); logout(); }}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}
                                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
                                        >
                                            Login
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}
                                            className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm hover:opacity-90 transition-all"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </nav>
    );
}
