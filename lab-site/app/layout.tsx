import type { Metadata } from 'next';
import { DM_Mono, Manrope, Sora } from 'next/font/google';
import './globals.css';
import { GlobalNav } from '@/components/landing/GlobalNav';
import { GlobalFooter } from '@/components/landing/GlobalFooter';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn';
const siteName = 'EsiLab';
const siteDescription =
  'EsiLab accompagne les laboratoires en Tunisie avec des equipements scientifiques, solutions de mesure, inspection, reactifs et support technique.';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'EsiLab | Catalogue laboratoire, equipements et solutions scientifiques',
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'EsiLab',
    'equipement laboratoire Tunisie',
    'catalogue laboratoire',
    'reactifs laboratoire',
    'metrologie dimensionnelle',
    'inspection emballage',
    'materiel scientifique',
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
    title: 'EsiLab | Catalogue laboratoire et solutions scientifiques',
    description: siteDescription,
    images: [
      {
        url: '/logo-esilab-bleu.png',
        width: 1200,
        height: 630,
        alt: 'EsiLab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EsiLab | Catalogue laboratoire et solutions scientifiques',
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
    email: 'contact@esilab.tn',
    telephone: '(+216) 70 036 096',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bloc C, 4 Boulevard de la qualite de la vie',
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
      </body>
    </html>
  );
}
