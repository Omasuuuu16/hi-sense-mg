"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type, visible, onClose }: ToastProps) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-white
                        ${type === 'success'
                            ? 'bg-green-500/90 border-green-400/50'
                            : 'bg-red-500/90 border-red-400/50'
                        }`}
                >
                    {type === 'success'
                        ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        : <XCircle className="w-5 h-5 flex-shrink-0" />
                    }
                    <span className="text-sm font-medium">{message}</span>
                    <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
