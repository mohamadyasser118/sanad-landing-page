// app/layout.js
// ─── NEXT.JS ROOT LAYOUT ─────────────────────────────────────────────────────
// Place this file at: app/layout.js
// ─────────────────────────────────────────────────────────────────────────────

import { Fira_Mono, Almarai } from 'next/font/google';
import './globals.css';

// ── Google Font configs ───────────────────────────────────────────────────────
const firaMono = Fira_Mono({
  subsets:  ['latin'],
  weight:   ['400', '500', '700'],
  variable: '--font-mono',
  display:  'swap',
});

const almarai = Almarai({
  subsets:  ['arabic'],
  weight:   ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display:  'swap',
});

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata = {
  title:       'Sanad — Your Legal Outcome Starts Here',
  description: 'Egypt\'s first outcome-driven legal platform. Find verified, specialised lawyers, book consultations, and resolve your legal challenges — with clarity and structure.',
  keywords:    ['legal platform Egypt', 'lawyer booking', 'legal consultation', 'محامي مصر', 'استشارة قانونية'],
  openGraph: {
    title:       'Sanad — Legal Outcomes Platform',
    description: 'Connect with verified Egyptian lawyers. Book consultations. Resolve your legal challenges.',
    type:        'website',
    locale:      'en_EG',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Sanad — Legal Outcomes Platform',
  },
};

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect for Google Fonts performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1E2D3A" />
      </head>
      <body className={`${firaMono.variable} ${almarai.variable}`}>
        {children}
      </body>
    </html>
  );
}
