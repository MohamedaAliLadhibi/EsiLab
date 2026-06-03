import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Wrench } from 'lucide-react';

const stats = [
  { label: 'Solutions metier', value: '04' },
  { label: 'Marques representees', value: '20+' },
  { label: 'Support terrain', value: '360°' },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(72,198,223,0.16),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]" />
      <div className="site-shell relative py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-blue">Landing page catalogue</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.03] text-ink md:text-7xl">
              Une homepage qui ressemble enfin a un vrai distributeur laboratoire.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Direction plus claire, plus commerciale et plus inspiree des references que tu as envoyees: gros hero
              produit, navigation catalogue, blocs services et sections produits plus marchandes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-blue px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-navy"
              >
                Voir les produits
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue"
              >
                Demander un devis
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
                  <p className="text-3xl font-semibold text-blue">{stat.value}</p>
                  <p className="mt-2 text-xs font-mono uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-halo">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-[#f8fbff] px-6 py-4">
              <div>
                <p className="eyebrow text-cyan">Produit mis en avant</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Advanced 4250 Single-Sample Cryoscope</h2>
              </div>
              <div className="rounded-full bg-cyan px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white">
                Slide 01
              </div>
            </div>

            <div className="relative aspect-[16/8.7]">
              <Image
                src="/product-hero-cryoscope.svg"
                alt="Visuel hero inspiré du produit Advanced 4250 Cryoscope"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="grid gap-4 border-t border-line px-6 py-5 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-1 text-cyan" />
                <p className="text-sm leading-7 text-slate-600">Selection rigoureuse des marques et des gammes critiques.</p>
              </div>
              <div className="flex items-start gap-3">
                <Wrench size={18} className="mt-1 text-orange" />
                <p className="text-sm leading-7 text-slate-600">Installation, maintenance et formation adaptees a vos equipes.</p>
              </div>
              <div className="flex items-start gap-3">
                <BriefcaseBusiness size={18} className="mt-1 text-lime" />
                <p className="text-sm leading-7 text-slate-600">Approche conseil pour laboratoires, controle qualite et industrie.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
