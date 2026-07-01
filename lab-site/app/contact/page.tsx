import type { Metadata } from 'next';
import { company } from '@/lib/site-data';
import { ContactForm } from '@/components/landing/ContactForm';
import { SectionTitle } from '@/components/landing/SectionTitle';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez EsiLab pour un devis, une recommandation produit, une installation ou un accompagnement technique pour votre laboratoire.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { subject?: string | string[] };
}) {
  const subject = Array.isArray(searchParams?.subject) ? searchParams?.subject[0] : searchParams?.subject;

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
          <ContactForm subject={subject} />
        </div>
      </div>
    </main>
  );
}
