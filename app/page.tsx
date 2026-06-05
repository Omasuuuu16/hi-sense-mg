"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Laptop, Cpu, ArrowRight, ShieldCheck, Zap, RefreshCw, Star } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Home() {
    const { t, isRTL } = useLanguage();

    const features = [
        { icon: ShieldCheck, title: t('featuresQualityTitle'), desc: t('featuresQualityDesc') },
        { icon: Zap,         title: t('featuresPriceTitle'),   desc: t('featuresPriceDesc') },
        { icon: RefreshCw,   title: t('featuresDailyTitle'),   desc: t('featuresDailyDesc') },
        { icon: Star,        title: t('featuresTrustTitle'),   desc: t('featuresTrustDesc') },
    ];
    return (
        <div className="min-h-screen">

            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-4">

                {/* Background orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl animate-blob" />
                    <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-400/10 blur-3xl animate-blob animation-delay-4000" />
                    {/* Grid overlay */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto">

                    {/* Pill badge */}
                    <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        {t('heroBadge')}
                    </motion.div>

                    <motion.h1 {...fadeUp(0.1)}
                        className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
                    >
                        <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 bg-clip-text text-transparent">
                            {t('heroTitle')}
                        </span>
                    </motion.h1>

                    <motion.p {...fadeUp(0.2)}
                        className="text-lg md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('heroDesc')}
                    </motion.p>

                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/laptops"
                            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-base shadow-[0_6px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_36px_rgba(37,99,235,0.45)] hover:-translate-y-1 transition-all duration-200"
                        >
                            <Laptop className="w-5 h-5 animate-pulse" />
                            {t('browseLaptops')}
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </Link>
                        <Link
                            href="/pcs"
                            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-blue-200 text-blue-700 font-bold text-base shadow-[0_4px_16px_rgba(37,99,235,0.1)] hover:border-blue-400 hover:shadow-[0_8px_28px_rgba(37,99,235,0.18)] hover:-translate-y-1 transition-all duration-200"
                        >
                            <Cpu className="w-5 h-5" />
                            {t('pcParts')}
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div {...fadeUp(0.4)} className="flex flex-wrap justify-center gap-8 mt-16">
                        {[
                            { value: '500+', label: t('statsProducts') },
                            { value: '1000+', label: t('statsCustomers') },
                            { value: '100%', label: t('statsTested') },
                            { value: 'Daily', label: t('statsUpdates') },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{value}</div>
                                <div className="text-xs text-slate-500 font-semibold mt-0.5 uppercase tracking-widest">{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Categories ────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">{t('whatWeOffer')}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">{t('browseCategories')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl mx-auto">{t('browseCategoriesDesc')}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Laptops Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Link href="/laptops" className="group relative flex flex-col h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-[0_8px_32px_rgba(37,99,235,0.3)] hover:shadow-[0_16px_48px_rgba(37,99,235,0.45)] hover:-translate-y-1 transition-all duration-300 block">
                            {/* BG pattern */}
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
                            />
                            <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-auto">
                                    <Laptop className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white mb-2">{t('laptops')}</h3>
                                    <p className="text-blue-200 text-sm mb-4">{t('laptopBrandList')}</p>
                                    <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                                        {t('shopNow')} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* PC Parts Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link href="/pcs" className="group relative flex flex-col h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-600 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.3)] hover:shadow-[0_16px_48px_rgba(14,165,233,0.45)] hover:-translate-y-1 transition-all duration-300 block">
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
                            />
                            <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-auto">
                                    <Cpu className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white mb-2">{t('pcParts')}</h3>
                                    <p className="text-sky-100 text-sm mb-4">{t('pcPartList')}</p>
                                    <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                                        {t('shopNow')} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Why Choose Us ─────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="section-divider" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">{t('whyHisense')}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">{t('whyChooseUs')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl mx-auto">{t('whyChooseUsDesc')}</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-6 bg-white rounded-2xl border border-blue-100 shadow-[0_2px_16px_rgba(37,99,235,0.07)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.14)] hover:-translate-y-1 transition-all duration-300 text-center group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                            <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ────────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 overflow-hidden p-12 text-center shadow-[0_16px_64px_rgba(37,99,235,0.35)]"
                >
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
                    />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-white mb-4">{t('ctaTitle')}</h2>
                        <p className="text-blue-100 text-lg mb-8">{t('ctaDesc')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/laptops"
                                className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
                            >
                                {t('viewAllLaptops')}
                            </Link>
                            <Link href="/contact"
                                className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                            >
                                {t('contact')}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}
