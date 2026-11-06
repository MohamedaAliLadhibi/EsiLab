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
    <main className="bg-panel py-14 sm:py-20 lg:py-24">
      <div className="site-shell">
        <SectionTitle
          eyebrow="Nos solutions"
          title="Une architecture simple pour naviguer entre les grands univers EsiLab."
          text="Cette page sert a orienter les visiteurs tres vite vers la bonne famille de besoin, avec une lecture claire et color-codee."
        />
        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-8">
          {solutions.map((solution, index) => (
            <section id={solution.slug} key={solution.slug} className="scroll-mt-24 grid gap-5 rounded-3xl border border-line bg-white p-5 shadow-halo sm:scroll-mt-32 sm:gap-6 sm:rounded-[2.25rem] sm:p-8 lg:grid-cols-[0.3fr_0.7fr]">
              <div>
                <p className="text-sm font-mono uppercase tracking-[0.22em] text-slate-400">0{index + 1}</p>
                <div className={`mt-4 h-3 w-20 rounded-full ${solution.accent}`} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{solution.name}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">{solution.summary}</p>
                <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
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
