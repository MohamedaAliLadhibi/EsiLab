import type { Metadata } from 'next';
import { company } from '@/lib/site-data';
import { SectionTitle } from '@/components/landing/SectionTitle';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez EsiLab pour un devis, une recommandation produit, une installation ou un accompagnement technique pour votre laboratoire.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="bg-panel py-24">
      <div className="site-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow="Contact"
          title="Un site qui pousse naturellement vers le devis et la prise de contact."
          text="Pour le lancement, cette page peut servir de formulaire simple, puis evoluer plus tard vers un vrai workflow de demande de devis."
        />
        <div className="rounded-[2.25rem] border border-line bg-white p-8 shadow-halo">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-mist p-5">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">Telephone</p>
              <p className="mt-2 text-lg font-semibold text-ink">{company.phone}</p>
            </div>
            <div className="rounded-2xl bg-mist p-5">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">Email</p>
              <p className="mt-2 text-lg font-semibold text-ink">{company.email}</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-mist p-5">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">Adresse</p>
            <p className="mt-2 text-lg font-semibold text-ink">{company.address}</p>
          </div>
          <form className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Nom complet" />
            <input className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Societe" />
            <input className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Email" />
            <input className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Telephone" />
            <textarea
              className="min-h-40 rounded-2xl border border-line px-4 py-3 outline-none md:col-span-2"
              placeholder="Decrivez votre besoin, vos produits d interet ou votre contexte laboratoire."
            />
            <button className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-scarlet md:col-span-2 md:justify-self-start">
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
