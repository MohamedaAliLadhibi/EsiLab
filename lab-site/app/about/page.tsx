import type { Metadata } from 'next';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { values } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'A propos',
  description:
    'EsiLab accompagne les laboratoires avec une approche de proximite, de qualite et de precision pour le choix, l installation et le suivi des equipements.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white py-24">
      <div className="site-shell grid gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionTitle
          eyebrow="Qui sommes-nous ?"
          title="EsiLab construit une relation de confiance autour de la science appliquee."
          text="Le catalogue raconte une entreprise de proximite, rigoureuse, avec une forte dimension de service. Cette page transforme ce discours en un message plus web, plus direct."
        />
        <div className="space-y-6">
          {values.map((value) => (
            <div key={value.title} className="rounded-[2rem] border border-line bg-panel p-6">
              <h3 className="text-2xl font-semibold text-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-8 text-slate-600">{value.text}</p>
            </div>
          ))}
          <div className="rounded-[2rem] bg-navy p-6 text-white">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">Notre culture</p>
            <p className="mt-4 text-base leading-8 text-white/80">
              Qualite, precision et excellence ne sont pas des slogans decoratifs. Ce sont les trois filtres qui guident
              la selection des produits, le niveau d accompagnement et la maniere de servir les laboratoires.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
