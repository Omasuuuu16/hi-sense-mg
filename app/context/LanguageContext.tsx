"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const translations = {
    en: {
        home: "Home",
        laptops: "Laptops",
        pcs: "PCs",
        contact: "Contact Us",
        searchPlaceholder: "Search models...",
        viewDetails: "View Details",
        price: "Price",
        egp: "EGP",
        specifications: "Specifications",
        relatedProducts: "Related Products",
        contactCompany: "Contact Company",
        copyright: "© 2026 Hi-sense. All rights reserved.",
        categories: "Categories",
        all: "All",
        brand: "Brand",
        
        // Home Page
        heroBadge: "Egypt's Premier Used Computers Store",
        heroTitle: "Hi-sense",
        heroDesc: "Premium used laptops & PC components at unbeatable prices. Quality guaranteed, updated daily.",
        browseLaptops: "Browse Laptops",
        pcParts: "PC Parts",
        statsProducts: "Products Listed",
        statsCustomers: "Happy Customers",
        statsTested: "Tested Devices",
        statsUpdates: "Price Updates",
        whatWeOffer: "What We Offer",
        browseCategories: "Browse Categories",
        browseCategoriesDesc: "Find the perfect laptop or PC component for your needs and budget.",
        laptopBrandList: "HP, Dell, Lenovo, Acer, Asus & more",
        pcPartList: "RAM, SSD, HDD, Monitors & more",
        shopNow: "Shop Now",
        whyHisense: "Why Hi-sense",
        whyChooseUs: "Why Choose Us?",
        whyChooseUsDesc: "We're committed to delivering the best experience every time.",
        featuresQualityTitle: "Quality Tested",
        featuresQualityDesc: "Every device is thoroughly tested before listing.",
        featuresPriceTitle: "Best Prices",
        featuresPriceDesc: "Competitive prices with no hidden fees.",
        featuresDailyTitle: "Updated Daily",
        featuresDailyDesc: "New stock arrives and prices update regularly.",
        featuresTrustTitle: "Trusted Store",
        featuresTrustDesc: "Hundreds of happy customers across Egypt.",
        ctaTitle: "Ready to find your next device?",
        ctaDesc: "Browse our full catalog and get the best deal today.",
        viewAllLaptops: "View All Laptops",

        // Footer
        footerDesc: "Premium used laptops and PC components in Egypt. Quality tested, best prices, updated daily.",
        footerBrowse: "Browse",
        footerContact: "Contact Info",
        footerAddress: "Cairo, Egypt",

        // Contact Page
        contactSubtitle: "We are here to help you find the best laptop or PC component for your needs.",
        generalManager: "General Manager",
        phone1: "Ahmed - Phone 1",
        phone2: "Ahmed - Phone 2",
        karem: "Karem",
        mallPhone: "Mall Phone",
        whatsappManager: "WhatsApp Mohamed Galal",
        whatsappAhmed: "WhatsApp Ahmed",
        whatsappKarem: "WhatsApp Karem",
        location: "Location",

        // PC Subcategories
        'hdd-ssd': "HDD & SSD",
        'monitors': "Monitors",
        'mice-keyboards': "Mice & Keyboards",
        'ram': "RAM",
        'graphics': "Graphics Cards",
        'desktops': "Desktop PCs",
        'accessories': "Accessories",

        // Grids & Confirm Delete Dialog
        addDevice: "Add Device",
        confirmDelete: "Confirm Delete",
        confirmDeleteMsg: "Are you sure you want to delete",
        cancel: "Cancel",
        delete: "Delete",
        noProducts: "No products found matching your criteria.",

        // Add / Edit Modal
        addNewDevice: "Add New Device",
        editDevice: "Edit Device",
        fillDetails: "Fill in the device details below",
        modifyDetails: "Modify details of this product",
        categoryLabel: "Category *",
        sectionLabel: "Section *",
        brandLabel: "Brand *",
        modelLabel: "Model *",
        specsLabel: "Specifications *",
        priceLabel: "Price (EGP) *",
        saveChanges: "Save Changes",
        saving: "Saving...",
    },
    ar: {
        home: "الرئيسية",
        laptops: "اللابتوب",
        pcs: "الكمبيوتر وقطعه",
        contact: "اتصل بنا",
        searchPlaceholder: "ابحث عن الموديل...",
        viewDetails: "عرض التفاصيل",
        price: "السعر",
        egp: "جم",
        specifications: "المواصفات",
        relatedProducts: "منتجات ذات صلة",
        contactCompany: "تواصل مع الشركة",
        copyright: "© 2026 هاي سينس. جميع الحقوق محفوظة.",
        categories: "التصنيفات",
        all: "الكل",
        brand: "الماركة",

        // Home Page
        heroBadge: "متجر اللابتوبات وأجهزة الكمبيوتر المستعملة الأول في مصر",
        heroTitle: "هاي سينس",
        heroDesc: "أجهزة لابتوب وقطع كمبيوتر مستعملة وممتازة بأسعار لا تقبل المنافسة. جودة مضمونة، وتحديثات يومية.",
        browseLaptops: "تصفح اللابتوبات",
        pcParts: "قطع الكمبيوتر",
        statsProducts: "المنتجات المدرجة",
        statsCustomers: "العملاء السعداء",
        statsTested: "الأجهزة المفحوصة",
        statsUpdates: "تحديثات الأسعار",
        whatWeOffer: "ما نقدمه",
        browseCategories: "تصفح التصنيفات",
        browseCategoriesDesc: "ابحث عن اللابتوب أو قطعة الكمبيوتر المناسبة لاحتياجاتك وميزانيتك.",
        laptopBrandList: "إتش بي، ديل، لينوفو، إيسر، أسوس والمزيد",
        pcPartList: "رامات، هاردات، شاشات والمزيد",
        shopNow: "تسوق الآن",
        whyHisense: "لماذا هاي سينس",
        whyChooseUs: "لماذا تختارنا؟",
        whyChooseUsDesc: "نحن ملتزمون بتقديم أفضل تجربة لعملائنا في كل مرة.",
        featuresQualityTitle: "جودة مضمونة ومفحوصة",
        featuresQualityDesc: "كل جهاز يتم فحصه واختباره بدقة قبل عرضه للبيع.",
        featuresPriceTitle: "أفضل الأسعار",
        featuresPriceDesc: "أسعار منافسة للغاية وبدون أي رسوم خفية.",
        featuresDailyTitle: "تحديثات يومية",
        featuresDailyDesc: "أجهزة جديدة تصل بانتظام وأسعار يتم تحديثها يومياً.",
        featuresTrustTitle: "متجر موثوق",
        featuresTrustDesc: "مئات العملاء السعداء في جميع أنحاء مصر.",
        ctaTitle: "هل أنت مستعد لاختيار جهازك القادم؟",
        ctaDesc: "تصفح كتالوج المنتجات الكامل واحصل على أفضل العروض اليوم.",
        viewAllLaptops: "عرض جميع اللابتوبات",

        // Footer
        footerDesc: "لابتوبات وقطع كمبيوتر مستعملة وممتازة في مصر. جودة مفحوصة، أفضل الأسعار، وتحديثات يومية.",
        footerBrowse: "تصفح",
        footerContact: "معلومات الاتصال",
        footerAddress: "القاهرة، مصر",

        // Contact Page
        contactSubtitle: "نحن هنا لمساعدتك في العثور على أفضل جهاز لابتوب أو قطعة كمبيوتر تناسب احتياجاتك.",
        generalManager: "المدير العام",
        phone1: "أحمد - هاتف 1",
        phone2: "أحمد - هاتف 2",
        karem: "كريم",
        mallPhone: "تليفون المول",
        whatsappManager: "واتساب محمد جلال",
        whatsappAhmed: "واتساب أحمد",
        whatsappKarem: "واتساب كريم",
        location: "الموقع",

        // PC Subcategories
        'hdd-ssd': "هارديسك ووسائط تخزين",
        'monitors': "الشاشات",
        'mice-keyboards': "الماوس ولوحة المفاتيح",
        'ram': "الرامات",
        'graphics': "كروت الشاشة",
        'desktops': "أجهزة كمبيوتر كاملة",
        'accessories': "إكسسوارات ومستلزمات",

        // Grids & Confirm Delete Dialog
        addDevice: "إضافة جهاز",
        confirmDelete: "تأكيد الحذف",
        confirmDeleteMsg: "هل أنت متأكد من رغبتك في حذف",
        cancel: "إلغاء",
        delete: "حذف",
        noProducts: "لم يتم العثور على منتجات تطابق بحثك.",

        // Add / Edit Modal
        addNewDevice: "إضافة جهاز جديد",
        editDevice: "تعديل الجهاز",
        fillDetails: "يرجى ملء تفاصيل الجهاز أدناه",
        modifyDetails: "تعديل بيانات هذا المنتج",
        categoryLabel: "الفئة *",
        sectionLabel: "القسم *",
        brandLabel: "الماركة *",
        modelLabel: "الموديل *",
        specsLabel: "المواصفات *",
        priceLabel: "السعر (جنيه مصري) *",
        saveChanges: "حفظ التغييرات",
        saving: "جاري الحفظ...",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Persist language preference
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang) {
            setLanguage(storedLang);
            document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = storedLang;
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string) => {
        // @ts-expect-error: handling dynamic keys safely
        return translations[language][key] || key;
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
