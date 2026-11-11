import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Téléchargements', description: 'Demandez les brochures, catalogues et documentations techniques ESILAB.' };

export default function DownloadsPage() {
  return (
    <main className="site-shell py-20 sm:py-28">
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-blue">Documentation</p>
      <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-6xl">Téléchargements</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">Demandez à notre équipe la brochure, le catalogue fabricant ou la fiche technique correspondant à votre besoin.</p>
      <Link href="/contact?subject=documentation" className="mt-8 inline-flex rounded-full bg-blue px-6 py-3 font-semibold text-white">Demander une documentation</Link>
    </main>
  );
}
