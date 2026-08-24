import Link from 'next/link';
import { ArrowUpRight, Beaker, Microscope, PackageCheck, Ruler, Snowflake, TestTube2 } from 'lucide-react';
import { SectionTitle } from '@/components/landing/SectionTitle';

const needs = [
  { title: 'Analyse & reactifs', text: 'Consommables, solutions et references analytiques.', icon: TestTube2, query: 'reactif', tone: 'bg-orange/10 text-orange' },
  { title: 'Microbiologie', text: 'Equipements et accessoires pour vos controles.', icon: Microscope, query: 'microbiologie', tone: 'bg-cyan/10 text-cyan' },
  { title: 'Metrologie', text: 'Mesurer, verifier et fiabiliser vos resultats.', icon: Ruler, query: 'metrologie', tone: 'bg-blue/10 text-blue' },
  { title: 'Controle qualite', text: 'Inspection, tests et suivi de conformite.', icon: PackageCheck, query: 'inspection', tone: 'bg-lime/15 text-ink' },
  { title: 'Temperature', text: 'Conservation, refroidissement et controle thermique.', icon: Snowflake, query: 'temperature', tone: 'bg-sky-100 text-sky-700' },
  { title: 'Equipement labo', text: 'Une gamme utile pour les operations quotidiennes.', icon: Beaker, query: 'laboratoire', tone: 'bg-violet-100 text-violet-700' },
];

export function BrowseByNeed() {
  return (
    <section className="bg-panel py-24">
      <div className="site-shell">
        <SectionTitle eyebrow="Explorer par besoin" title="Commencez par votre application, pas par une reference produit." text="Choisissez votre univers technique pour acceder plus vite aux produits et a l accompagnement adaptes a votre laboratoire." />
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {needs.map((need) => {
            const Icon = need.icon;

            return (
              <Link key={need.title} href={`/products?search=${encodeURIComponent(need.query)}`} className="group rounded-[1.75rem] border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-blue/40 hover:shadow-halo">
                <div className="flex items-start justify-between gap-6">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${need.tone}`}><Icon size={23} /></span>
                  <ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-ink">{need.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{need.text}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-blue">Explorer la gamme</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
