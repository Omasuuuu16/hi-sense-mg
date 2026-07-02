"use client";

import React from 'react';
import Link from 'next/link';
import { Laptop, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FB_URL = 'https://www.facebook.com/profile.php?id=61565876215208';

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

export default function Footer() {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-blue-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                                <Laptop className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                Hi-sense
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                            {t('footerDesc')}
                        </p>

                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">{t('footerBrowse')}</h3>
                        <ul className="space-y-2.5">
                            {[
                                { href: '/', label: t('home') },
                                { href: '/laptops', label: t('laptops') },
                                { href: '/pcs', label: t('pcs') },
                                { href: '/contact', label: t('contact') },
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 group-hover:bg-blue-600 transition-colors" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">{t('footerContact')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-500">
                                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span>{t('footerAddress')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <a href="tel:+201005862727" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                                    +20 100 586 2727
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">{t('followUs')}</h3>
                        <a
                            href={FB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-bold hover:bg-[#166fe5] hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                        >
                            <FacebookIcon className="w-4 h-4" />
                            {t('visitFacebook')}
                        </a>
                        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                            {t('footerSocialDesc')}
                        </p>
                    </div>
                </div>

                <div className="section-divider" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-500">
                        {t('copyright')}
                    </p>

                </div>
            </div>
        </footer>
    );
}
