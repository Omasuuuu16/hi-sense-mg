"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2, Laptop } from 'lucide-react';

export default function RegisterPage() {
    const { register, user, loading } = useAuth();
    const { language, t } = useLanguage();
    const router = useRouter();

    const [username,        setUsername]        = useState('');
    const [email,           setEmail]           = useState('');
    const [phone,           setPhone]           = useState('');
    const [password,        setPassword]        = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors,          setErrors]          = useState<Record<string, string>>({});
    const [generalError,    setGeneralError]    = useState('');
    const [submitting,      setSubmitting]      = useState(false);
    const [success,         setSuccess]         = useState(false);

    useEffect(() => {
        if (!loading && user) router.push('/');
    }, [user, loading, router]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!username.trim() || username.length < 3) e.username = 'Username must be at least 3 characters';
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
        if (!phone.trim() || !/^[0-9+\-\s]{7,15}$/.test(phone)) e.phone = 'Enter a valid phone number';
        if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setErrors({});

        setSubmitting(true);
        const result = await register(username, email, phone, password);
        setSubmitting(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2500);
        } else {
            if (result.details) setErrors(result.details);
            else setGeneralError(result.error || 'Registration failed. Please try again.');
        }
    };

    if (loading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl border border-green-100 shadow-[0_8px_48px_rgba(34,197,94,0.12)] p-12 text-center max-w-sm w-full"
                >
                    <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">{language === 'ar' ? 'تم إنشاء الحساب!' : 'Account Created!'}</h2>
                    <p className="text-slate-400 text-sm">{language === 'ar' ? 'جاري تحويلك لصفحة تسجيل الدخول...' : 'Redirecting you to login...'}</p>
                </motion.div>
            </div>
        );
    }

    const fields = [
        { id: 'username', label: t('fullName'), icon: User,  type: 'text',     value: username,        set: setUsername,        placeholder: t('fullNamePlaceholder') },
        { id: 'email',    label: 'Email',     icon: Mail,  type: 'email',    value: email,           set: setEmail,           placeholder: 'your@email.com' },
        { id: 'phone',    label: t('phoneField'),     icon: Phone, type: 'tel',      value: phone,           set: setPhone,           placeholder: '01xxxxxxxxx' },
        { id: 'password', label: 'Password',  icon: Lock,  type: 'password', value: password,        set: setPassword,        placeholder: 'Min. 6 characters' },
        { id: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password', value: confirmPassword, set: setConfirmPassword, placeholder: 'Repeat password' },
    ];

    return (
        <div className="min-h-[92vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-3xl" />
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(37,99,235,0.05) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Link href="/" className="inline-flex items-center gap-2.5">
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
                        <h1 className="text-3xl font-black text-slate-800 mb-2">{t('createAccount')}</h1>
                        <p className="text-slate-400 text-sm">{t('joinHisense')}</p>
                    </div>

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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(({ id, label, icon: Icon, type, value, set, placeholder }) => (
                            <div key={id}>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                        <Icon className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input
                                        type={type}
                                        value={value}
                                        onChange={e => set(e.target.value)}
                                        placeholder={placeholder}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-3 ${
                                            errors[id]
                                                ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                                                : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                                        }`}
                                    />
                                </div>
                                {errors[id] && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors[id]}</p>}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {submitting ? (
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>{t('register')} <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-400 pt-1">
                            {t('alreadyHaveAccount')}{' '}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                {t('signIn')}
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
