import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Déstockage',
  description: 'Contactez ESILAB pour connaître les équipements actuellement disponibles en déstockage.',
};

export default function DestockagePage() {
  return (
    <main className="site-shell py-20 sm:py-28">
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-blue">Offres ESILAB</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-ink sm:text-6xl">Déstockage</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
        Pour connaître les équipements disponibles et leurs conditions, contactez notre équipe. Les disponibilités évoluent régulièrement.
      </p>
      <Link href="/contact?subject=destockage" className="mt-8 inline-flex rounded-full bg-blue px-6 py-3 font-semibold text-white">Demander les disponibilités</Link>
    </main>
  );
}
