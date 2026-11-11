import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="site-shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="text-sm font-mono uppercase tracking-[0.2em] text-blue">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-5xl">Page introuvable.</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white">Retour à l'accueil</Link>
          <Link href="/products" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">Voir le catalogue</Link>
        </div>
      </div>
    </main>
  );
}
