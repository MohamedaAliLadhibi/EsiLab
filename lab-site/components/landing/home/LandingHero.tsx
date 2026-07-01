'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, ChevronRight, ShieldCheck, Wrench } from 'lucide-react';
import type { HomeProduct } from '@/lib/catalogue';

type LandingHeroProps = {
  totalProducts: number;
  featuredBrands: string[];
  featuredCount: number;
  product: HomeProduct | null;
};

const slides = [
  {
    src: '/hero-lab-1.png',
    alt: 'Scientifique EsiLab en laboratoire',
    eyebrow: 'Laboratoire moderne',
  },
  {
    src: '/hero-lab-2.png',
    alt: 'Analyse au microscope en laboratoire',
    eyebrow: 'Instrumentation scientifique',
  },
  {
    src: '/hero-lab-3.png',
    alt: 'Equipe scientifique EsiLab',
    eyebrow: 'Performance et precision',
  },
  {
    src: '/hero-lab-4.png',
    alt: 'Chercheur EsiLab en laboratoire moderne',
    eyebrow: 'Qualite et controle',
  },
];

export function LandingHero({ totalProducts, featuredBrands, featuredCount, product }: LandingHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const stats = [
    { label: 'References catalogue', value: totalProducts > 0 ? `${totalProducts.toLocaleString('fr-FR')}+` : 'Live' },
    { label: 'Marques en vitrine', value: `${featuredBrands.length || 1}`.padStart(2, '0') },
    { label: 'Produits mis en avant', value: `${featuredCount}`.padStart(2, '0') },
  ];

  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-navy">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          >
            <Image src={slide.src} alt={slide.alt} fill priority={index === 0} className="object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,21,44,0.84)_0%,rgba(10,21,44,0.64)_38%,rgba(10,21,44,0.34)_58%,rgba(10,21,44,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(72,198,223,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(31,87,184,0.24),transparent_22%)]" />
      </div>

      <div className="site-shell relative flex min-h-[calc(100vh-72px)] items-end py-16 lg:py-20">
        <div className="grid w-full gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="max-w-4xl">
            <p className="eyebrow text-cyan">{slides[activeSlide]?.eyebrow ?? 'Catalogue EsiLab'}</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] text-white md:text-7xl xl:text-[6.2rem]">
              EsiLab, solutions intelligentes pour laboratoires modernes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
              Une presentation plus visuelle, premium et claire du catalogue EsiLab avec mise en avant des
              equipements, de l&apos;expertise technique et de la demande de devis rapide.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan px-7 py-4 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Voir les produits
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
              >
                Demander un devis
              </Link>
            </div>

            <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 shadow-soft backdrop-blur-md">
                  <p className="text-3xl font-semibold text-cyan">{stat.value}</p>
                  <p className="mt-2 text-xs font-mono uppercase tracking-[0.24em] text-white/68">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/10 shadow-halo backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-6 py-5">
              <div>
                <p className="eyebrow text-cyan">Produit mis en avant</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{product?.name ?? 'Selection EsiLab'}</h2>
                <p className="mt-2 text-sm text-white/68">
                  {product ? `${product.brand} - ${product.category}` : 'Reference issue du catalogue'}
                </p>
              </div>
              <div className="rounded-full bg-cyan px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-ink">
                {product?.sku ?? 'Live'}
              </div>
            </div>

            <div className="relative aspect-[16/9]">
              {product?.heroImage ? (
                <Image src={product.heroImage} alt={product.name} fill priority className="object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#16305c] via-[#12264a] to-[#0b1730]" />
              )}
            </div>

            <div className="grid gap-4 border-t border-white/10 px-6 py-5 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-1 text-cyan" />
                <p className="text-sm leading-7 text-white/75">{product?.brand ?? 'Marques techniques selectionnees'}</p>
              </div>
              <div className="flex items-start gap-3">
                <Wrench size={18} className="mt-1 text-orange" />
                <p className="text-sm leading-7 text-white/75">{product?.category ?? 'Accompagnement a l installation et au SAV'}</p>
              </div>
              <div className="flex items-start gap-3">
                <BriefcaseBusiness size={18} className="mt-1 text-lime" />
                <p className="text-sm leading-7 text-white/75">
                  {product?.excerpt ?? 'Conseil applicatif pour laboratoires, qualite et industrie.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? 'w-10 bg-cyan' : 'w-2.5 bg-white/35 hover:bg-white/55'
                    }`}
                    aria-label={`Afficher le visuel ${index + 1}`}
                  />
                ))}
              </div>

              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-white">
                Explorer le catalogue
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
