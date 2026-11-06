import Link from 'next/link';
import type { Metadata } from 'next';
import { BadgeCheck } from 'lucide-react';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { LandingHero } from '@/components/landing/home/LandingHero';
import { QuickPanels } from '@/components/landing/home/QuickPanels';
import { SupplierCarousel } from '@/components/landing/home/SupplierCarousel';
import { ServiceHighlights } from '@/components/landing/home/ServiceHighlights';
import { TrustBar } from '@/components/landing/home/TrustBar';
import { BrowseByNeed } from '@/components/landing/home/BrowseByNeed';
import { HowItWorks } from '@/components/landing/home/HowItWorks';
import { AdviceCallout } from '@/components/landing/home/AdviceCallout';
import { getHomePageCatalogue } from '@/lib/catalogue';
import { brands, clientReferences, company, solutions, values } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Decouvrez EsiLab, partenaire des laboratoires pour les equipements scientifiques, la metrologie, l inspection, les reactifs et le support technique en Tunisie.',
  alternates: {
    canonical: '/',
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const { totalProducts, featuredBrands, featuredProducts, heroProduct } = await getHomePageCatalogue();

  return (
    <main>
      <LandingHero
  totalProducts={totalProducts}
  featuredBrands={featuredBrands}
  featuredCount={featuredProducts.length}
  product={heroProduct}
  products={featuredProducts}
/>
      <TrustBar />
      <QuickPanels />
      <SupplierCarousel />
      <BrowseByNeed />
      <ServiceHighlights />

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Nos solutions"
            title="Quatre piliers pour couvrir les besoins critiques du laboratoire moderne."
            text="Des univers plus lisibles pour orienter rapidement les equipes vers les equipements, solutions de mesure, inspections et consommables adaptes."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {solutions.map((solution) => (
              <div key={solution.slug} className={`rounded-3xl border bg-panel p-5 shadow-soft sm:rounded-[2rem] sm:p-6 ${solution.border}`}>
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

      <HowItWorks />

      <section className="bg-panel py-14 sm:py-20 lg:py-24">
        <div className="site-shell grid gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="Qui sommes-nous ?"
            title="Un partenaire scientifique centre sur la qualite, la precision et l excellence."
            text="EsiLab accompagne les laboratoires avec une selection technique exigeante, un support local et une approche terrain orientee resultat."
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

      <section className="bg-navy py-14 sm:py-20 lg:py-24 text-white">
        <div className="site-shell grid gap-8 sm:gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionTitle
            eyebrow="Marques & References"
            title="Des fabricants reconnus et des clients qui inspirent confiance."
            text="La credibilite se construit autant par les marques representees que par les references terrain accompagnees par EsiLab."
            light
          />
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:rounded-[2rem] sm:p-6">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">Marques mises en avant</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <span key={brand} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:rounded-[2rem] sm:p-6">
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

      <AdviceCallout />

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="site-shell rounded-[2rem] bg-gradient-to-r from-blue to-cyan p-6 text-white shadow-halo sm:rounded-[2.5rem] sm:p-10 lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/70">Passer a l action</p>
            <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
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
