import type { Metadata } from 'next';

const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.esilab-tn.com/api';

type ProductResponse = {
  data?: { slug?: string; data?: Record<string, unknown> };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${apiBase}/products/${encodeURIComponent(params.slug)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Product metadata unavailable');
    const result = await response.json() as ProductResponse;
    const product = result.data?.data ?? {};
    const name = String(product.name || product.product_name || product.title || 'Fiche produit');
    const brand = String(product.brand || product.supplier || product.manufacturer || '');
    const description = String(product.short_description || product.description || `${name}${brand ? ` de ${brand}` : ''} : caractéristiques et informations produit auprès d’ESILAB.`).slice(0, 300);
    return {
      title: { absolute: `${name}${brand ? ` – ${brand}` : ''} | ESILAB` },
      description,
      alternates: { canonical: `/products/${params.slug}` },
      openGraph: { title: `${name}${brand ? ` – ${brand}` : ''} | ESILAB`, description },
    };
  } catch {
    return {
      title: { absolute: 'Fiche produit | ESILAB' },
      description: 'Consultez les informations produit et demandez conseil à ESILAB.',
    };
  }
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
