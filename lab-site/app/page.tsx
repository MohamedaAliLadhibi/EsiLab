import Link from 'next/link';
import type { Metadata } from 'next';
import { BadgeCheck } from 'lucide-react';
import { ProductCard } from '@/components/landing/ProductCard';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { LandingHero } from '@/components/landing/home/LandingHero';
import { QuickPanels } from '@/components/landing/home/QuickPanels';
import { ServiceHighlights } from '@/components/landing/home/ServiceHighlights';
import { brands, clientReferences, company, featuredProducts, solutions, values } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Découvrez EsiLab, partenaire des laboratoires pour les équipements scientifiques, la métrologie, l inspection, les réactifs et le support technique en Tunisie.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <main>
      <LandingHero />
      <QuickPanels />
      <ServiceHighlights />

      <section className="bg-white py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Nos solutions"
            title="Quatre piliers pour couvrir les besoins critiques du laboratoire moderne."
            text="Les references que tu as envoyees vendent d'abord des univers de besoins. On reprend cette logique ici avec des blocs plus visibles, plus commerciaux et plus faciles a scanner."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {solutions.map((solution) => (
              <div key={solution.slug} className={`rounded-[2rem] border bg-panel p-6 shadow-soft ${solution.border}`}>
                <div className={`h-2 w-16 rounded-full ${solution.accent}`} />
                <h3 className="mt-6 text-2xl font-semibold text-ink">{solution.name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{solution.summary}</p>
                <Link href="/solutions" className={`mt-6 inline-flex text-sm font-semibold ${solution.text}`}>
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-panel py-24">
        <div className="site-shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="Qui sommes-nous ?"
            title="Un partenaire scientifique centre sur la qualite, la precision et l excellence."
            text="Ici on garde le fond de ta marque, mais la forme devient plus proche d'un distributeur laboratoire premium avec davantage de structure et de reassurance."
          />
          <div className="grid gap-5">
            {values.map((value) => (
              <div key={value.title} className="rounded-[1.75rem] border border-line bg-white p-6">
                <div className="flex items-start gap-4">
                  <BadgeCheck className="mt-1 text-blue" size={18} />
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{value.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Produits phares"
            title="Une section produit plus proche d'un vrai catalogue marchand."
            text="On reprend les grands codes des screenshots: image forte, denomination claire, parcours d'action visible et structure plus commerciale."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {brands.map((brand) => (
              <span key={brand} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
                {brand}
              </span>
            ))}
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 text-white">
        <div className="site-shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionTitle
            eyebrow="Marques & References"
            title="Des fabricants reconnus et des clients qui inspirent confiance."
            text="Nous gardons la logique catalogue: la credibilite vient autant des marques representees que des references terrain."
            light
          />
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">Marques mises en avant</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <span key={brand} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">References clients</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {clientReferences.map((client) => (
                  <div key={client} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-white/80">
                    {client}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="site-shell rounded-[2.5rem] bg-gradient-to-r from-blue to-cyan p-10 text-white shadow-halo lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/70">Passer a l action</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight">
              Prets a moderniser votre laboratoire avec une approche plus claire, plus precise et plus performante ?
            </h2>
            <p className="mt-4 max-w-2xl text-white/80">
              Contactez EsiLab pour une recommandation produit, une structuration de gamme ou une demande de devis rapide.
            </p>
          </div>
          <div className="mt-8 space-y-3 lg:mt-0 lg:text-right">
            <p className="text-sm font-semibold">{company.phone}</p>
            <p className="text-sm text-white/80">{company.email}</p>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue transition hover:bg-navy hover:text-white"
            >
              Demander un accompagnement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
