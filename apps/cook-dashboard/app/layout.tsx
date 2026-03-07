import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// All pages in this layout are client-authenticated — no static pre-rendering
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maase Cook Dashboard',
  description: 'Manage your home kitchen business on Maase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
