import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { GlobalNav } from '@/components/landing/GlobalNav';
import { GlobalFooter } from '@/components/landing/GlobalFooter';
import { CatalogueAssistant } from '@/components/landing/CatalogueAssistant';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab-tn.com';
const siteName = 'ESILAB';
const siteDescription =
  'ESILAB accompagne les laboratoires en Tunisie avec des équipements scientifiques, des solutions de mesure, d’inspection, des réactifs et un support technique.';

const sora = localFont({
  src: '../public/fonts/sora-latin.woff2',
  variable: '--font-display',
  weight: '400 800',
  display: 'swap',
});

const manrope = localFont({
  src: '../public/fonts/manrope-latin.woff2',
  variable: '--font-body',
  weight: '400 800',
  display: 'swap',
});

const dmMono = localFont({
  src: [
    { path: '../public/fonts/dm-mono-regular-latin.woff2', weight: '400' },
    { path: '../public/fonts/dm-mono-medium-latin.woff2', weight: '500' },
  ],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'ESILAB – Équipements et instruments de laboratoire en Tunisie',
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo-esilab-bleu.png',
  },
  keywords: [
    'ESILAB',
    'équipement de laboratoire Tunisie',
    'catalogue laboratoire',
    'réactifs de laboratoire',
    'métrologie dimensionnelle',
    'inspection emballage',
    'matériel scientifique',
    'maintenance laboratoire',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: siteUrl,
    siteName,
    title: 'ESILAB – Équipements et instruments de laboratoire en Tunisie',
    description: siteDescription,
    images: [
      {
        url: '/logo-esilab-bleu.png',
        width: 1200,
        height: 630,
        alt: 'ESILAB',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESILAB – Équipements et instruments de laboratoire en Tunisie',
    description: siteDescription,
    images: ['/logo-esilab-bleu.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'Laboratory equipment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo-esilab-bleu.png`,
    email: 'contact.esilab@esilab.tn',
    telephone: '(+216) 70 036 096',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Boulevard de la Qualité de la Vie',
      addressLocality: 'Ariana',
      postalCode: '2058',
      addressCountry: 'TN',
    },
  };

  return (
    <html lang="fr" className={`${sora.variable} ${manrope.variable} ${dmMono.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GlobalNav />
        {children}
        <GlobalFooter />
        <CatalogueAssistant />
      </body>
    </html>
  );
}
