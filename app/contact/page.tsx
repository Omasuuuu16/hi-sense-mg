"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-6">
                    {t('contact')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    We are here to help you find the best laptop or PC component for your needs.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Contact Info Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass dark:glass-dark p-8 rounded-3xl"
                >
                    <div className="space-y-6">
                        {/* General Manager */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl border-l-4 border-purple-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold mb-1">General Manager</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">
                                        Mohamed Galal
                                    </p>
                                    <a href="tel:+201005862727" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-base block mb-2" dir="ltr">
                                        📞 +20 100 586 2727
                                    </a>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/201005862727"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-center transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Mohamed Galal
                            </a>
                        </div>

                        {/* Ahmed Phone 1 */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold mb-1">Ahmed - Phone 1</h3>
                                    <a href="tel:+201114576255" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-base" dir="ltr">
                                        📞 +20 11 14576255
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Ahmed Phone 2 */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold mb-1">Ahmed - Phone 2</h3>
                                    <a href="tel:+201224576255" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-base" dir="ltr">
                                        📞 +20 12 24576255
                                    </a>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/201224576255"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-center transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Ahmed
                            </a>
                        </div>

                        {/* Karem */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold mb-1">Karem</h3>
                                    <a href="tel:+201033535638" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-base" dir="ltr">
                                        📞 +20 10 33535638
                                    </a>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/201033535638"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-center transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Karem
                            </a>
                        </div>

                        {/* Mall Phone */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold mb-1">Mall Phone</h3>
                                    <a href="tel:0222571760" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-base" dir="ltr">
                                        📞 0222571760
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="glass dark:glass-dark p-6 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Location</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        50 El-Khalifa El-Maamoun, Manshîyet el Bakri, Heliopolis, Cairo Governorate 4460043
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Google Map Embed */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass dark:glass-dark rounded-3xl overflow-hidden h-full min-h-[400px] relative shadow-lg"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.899874836697!2d31.3126989!3d30.0869209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e20e81b67f1%3A0x6b168923a1372b7a!2s50%20El-Khalifa%20El-Maamoun%2C%20Al%20Golf%2C%20Heliopolis%2C%20Cairo%20Governorate%204460043!5e0!3m2!1sen!2seg!4v1707345600000!5m2!1sen!2seg"
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: '400px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hi-sense Location"
                        className="absolute inset-0 w-full h-full"
                    />
                </motion.div>
            </div>
        </div>
    );
}
