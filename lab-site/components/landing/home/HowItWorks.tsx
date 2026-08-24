import Link from 'next/link';
import { ArrowRight, ClipboardList, MessageSquareText, PackageSearch } from 'lucide-react';
import { SectionTitle } from '@/components/landing/SectionTitle';

const steps = [
  { number: '01', title: 'Partagez votre besoin', text: 'Application, contraintes, reference connue ou objectif de votre equipe.', icon: MessageSquareText },
  { number: '02', title: 'Recevez une recommandation', text: 'EsiLab vous oriente vers une solution et les documents techniques utiles.', icon: PackageSearch },
  { number: '03', title: 'Avancez sereinement', text: 'Devis, livraison, installation et suivi selon votre contexte.', icon: ClipboardList },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="site-shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionTitle eyebrow="Une approche simple" title="De la question terrain a la bonne solution." text="Notre role ne s arrete pas au catalogue : nous vous aidons a choisir une solution pertinente et a la mettre en place." />
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy lg:justify-self-end">Parler a un expert <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative rounded-[2rem] border border-line bg-panel p-7">
                <span className="font-mono text-xs tracking-[0.24em] text-cyan">{step.number}</span>
                <span className="absolute right-7 top-7 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue shadow-soft"><Icon size={20} /></span>
                <h3 className="mt-8 max-w-[14rem] text-2xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{step.text}</p>
                {index < steps.length - 1 && <ArrowRight className="absolute -right-8 top-1/2 hidden text-cyan lg:block" size={28} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
