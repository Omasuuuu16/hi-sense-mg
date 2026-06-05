import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Hi-sense | Premium Computers',
  description: 'Premium used laptops and PC components in Egypt. Best prices guaranteed.',
  keywords: 'laptops, used laptops, PC components, Egypt, hi-sense',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
