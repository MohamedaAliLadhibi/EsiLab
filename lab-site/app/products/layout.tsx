import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue produits',
  description:
    'Parcourez le catalogue EsiLab: equipements de laboratoire, instruments de mesure, solutions d inspection, reactifs, accessoires et consommables.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Catalogue produits EsiLab',
    description:
      'Trouvez les references laboratoire, instruments, reactifs et accessoires adaptes a vos workflows scientifiques et industriels.',
    url: '/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
