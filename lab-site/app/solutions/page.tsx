import type { Metadata } from 'next';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { solutions } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Solutions laboratoire',
  description:
    'Explorez les univers EsiLab: equipements de laboratoire, metrologie dimensionnelle, inspection et emballage, produits chimiques et reactifs.',
  alternates: {
    canonical: '/solutions',
  },
};

export default function SolutionsPage() {
  return (
    <main className="bg-panel py-24">
      <div className="site-shell">
        <SectionTitle
          eyebrow="Nos solutions"
          title="Une architecture simple pour naviguer entre les grands univers EsiLab."
          text="Cette page sert a orienter les visiteurs tres vite vers la bonne famille de besoin, avec une lecture claire et color-codee."
        />
        <div className="mt-14 grid gap-8">
          {solutions.map((solution, index) => (
            <section id={solution.slug} key={solution.slug} className="scroll-mt-32 grid gap-6 rounded-[2.25rem] border border-line bg-white p-8 shadow-halo lg:grid-cols-[0.3fr_0.7fr]">
              <div>
                <p className="text-sm font-mono uppercase tracking-[0.22em] text-slate-400">0{index + 1}</p>
                <div className={`mt-4 h-3 w-20 rounded-full ${solution.accent}`} />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-ink">{solution.name}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{solution.summary}</p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-mist p-4 text-sm text-slate-700">Selection de marques adaptees au contexte client</div>
                  <div className="rounded-2xl bg-mist p-4 text-sm text-slate-700">Support avant-vente et recommandation technique</div>
                  <div className="rounded-2xl bg-mist p-4 text-sm text-slate-700">Mise en service, maintenance et formation disponibles</div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
