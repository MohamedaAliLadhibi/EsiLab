import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { brandSlug, partnerBrands } from '@/lib/brands';
import { API_BASE_URL } from '@/lib/catalogue';

type ProductResult = {
  slug: string;
  data?: Record<string, unknown>;
};

function getBrand(slug: string) {
  return partnerBrands.find((brand) => brandSlug(brand) === slug);
}

export function generateStaticParams() {
  return partnerBrands.map((brand) => ({ brand: brandSlug(brand) }));
}

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const brand = getBrand(params.brand);
  if (!brand) return { title: 'Marque introuvable | ESILAB' };
  return {
    title: { absolute: `${brand} | ESILAB` },
    description: `Découvrez les produits ${brand} proposés par ESILAB et contactez notre équipe pour un conseil ou un devis.`,
    alternates: { canonical: `/marques/${params.brand}` },
  };
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();

  let products: ProductResult[] = [];
  try {
    const query = new URLSearchParams({ brand, limit: '12' });
    const response = await fetch(`${API_BASE_URL}/products?${query}`, { next: { revalidate: 300 } });
    if (response.ok) {
      const result = await response.json() as { data?: ProductResult[] };
      products = result.data || [];
    }
  } catch {
    products = [];
  }

  return (
    <main className="site-shell min-h-[60vh] py-16 sm:py-24">
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-blue">Marque partenaire</p>
      <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-6xl">{brand}</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
        Retrouvez les références de cette marque dans le catalogue ESILAB ou contactez notre équipe pour être conseillé.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/products?brand=${encodeURIComponent(brand)}`} className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white">Voir le catalogue {brand}<ArrowRight size={16} /></Link>
        <Link href="/contact" className="inline-flex rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">Contacter ESILAB</Link>
      </div>
      {products.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-ink">Références associées</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`} className="block rounded-2xl border border-line bg-white p-5 transition hover:border-blue/40 hover:shadow-soft">
                  <span className="font-semibold text-ink">{String(product.data?.name || product.data?.product_name || product.slug)}</span>
                  {typeof product.data?.sku === 'string' && product.data.sku && <span className="mt-2 block text-xs text-slate-500">Référence : {product.data.sku}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-12 rounded-2xl border border-line bg-white p-5 text-sm leading-6 text-slate-600">
          Aucune référence confirmée n'est actuellement affichée pour cette marque. Contactez-nous pour vérifier sa disponibilité.
        </p>
      )}
    </main>
  );
}
