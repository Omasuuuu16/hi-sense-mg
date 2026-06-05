"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { JWTPayload } from '@/app/lib/auth';

interface AuthContextType {
    user: JWTPayload | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; details?: Record<string, string>; error?: string }>;
    register: (username: string, email: string, phone: string, password: string) => Promise<{ success: boolean; details?: Record<string, string>; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Failed checking auth session:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    details: data.details, 
                    error: data.error || 'Login failed.' 
                };
            }
        } catch (e) {
            return { success: false, error: 'Connection error. Please try again.' };
        }
    };

    const register = async (username: string, email: string, phone: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                return { success: true };
            } else {
                return { 
                    success: false, 
                    details: data.details, 
                    error: data.error || 'Registration failed.' 
                };
            }
        } catch (e) {
            return { success: false, error: 'Connection error. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error("Failed calling logout API:", e);
        } finally {
            setUser(null);
            // Redirect to home page on logout
            window.location.href = '/';
        }
    };

    const isAdmin = user?.role === 'Admin';

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
