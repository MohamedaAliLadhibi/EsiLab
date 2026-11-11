import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue produits',
  description:
    "Parcourez le catalogue ESILAB : équipements de laboratoire, instruments de mesure, solutions d'inspection, réactifs, accessoires et consommables.",
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Catalogue produits ESILAB',
    description:
      'Trouvez les références de laboratoire, instruments, réactifs et accessoires adaptés à vos workflows scientifiques et industriels.',
    url: '/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
