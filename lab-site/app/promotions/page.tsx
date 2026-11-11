import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Promotions', description: 'Renseignez-vous auprès d’ESILAB sur les offres et promotions disponibles.' };

export default function PromotionsPage() {
  return (
    <main className="site-shell py-20 sm:py-28">
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-blue">Offres ESILAB</p>
      <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-6xl">Promotions</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">Pour connaître les offres en cours et vérifier leurs conditions, contactez notre équipe.</p>
      <Link href="/contact?subject=promotions" className="mt-8 inline-flex rounded-full bg-blue px-6 py-3 font-semibold text-white">Demander les offres en cours</Link>
    </main>
  );
}
