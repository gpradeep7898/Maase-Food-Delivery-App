import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maase — Home-cooked meals from your neighbourhood',
  description: 'Order authentic home-cooked meals from verified local cooks in your city. Fresh, affordable, made with love.',
  keywords: ['home cooked food', 'tiffin service', 'local cooks', 'food delivery', 'India'],
  openGraph: {
    title: 'Maase — Home-cooked meals from your neighbourhood',
    description: 'Order authentic home-cooked meals from verified local cooks in your city.',
    type: 'website',
    url: 'https://maaseindia.com',
    siteName: 'Maase',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maase — Home-cooked meals',
    description: 'Fresh, authentic meals from local home cooks. Download the app.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
