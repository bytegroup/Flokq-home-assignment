import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Auto Parts Inventory System',
    description: 'Manage and browse auto parts inventory',
    keywords: ['auto parts', 'inventory', 'car parts', 'automotive'],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        </body>
        </html>
    );
}