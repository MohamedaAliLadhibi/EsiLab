import Link from 'next/link';
import { ArrowRight, FileText, MessagesSquare, Wrench } from 'lucide-react';

const highlights = [
  { label: 'Fiches techniques', icon: FileText },
  { label: 'Conseil applicatif', icon: MessagesSquare },
  { label: 'Mise en service', icon: Wrench },
];

export function AdviceCallout() {
  return (
    <section className="bg-navy py-24 text-white">
      <div className="site-shell overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
        <div>
          <p className="eyebrow text-cyan">Besoin d etre oriente ?</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight">Expliquez votre application : nous vous aidons a cadrer la solution.</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">Reference, compatibilite, documentation ou accompagnement terrain : ESILAB vous aide a avancer avec les bonnes informations.</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-navy">Demander un conseil <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return <div key={highlight.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/90"><Icon size={18} className="text-cyan" />{highlight.label}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
