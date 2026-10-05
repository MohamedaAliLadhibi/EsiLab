import type { Metadata } from 'next';
import Image from 'next/image';
import { company } from '@/lib/site-data';
import { ContactForm } from '@/components/landing/ContactForm';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { ThisIsUs } from '@/components/landing/ThisIsUs';

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
  const subject = Array.isArray(searchParams?.subject)
    ? searchParams?.subject[0]
    : searchParams?.subject;

  return (
    <main className="bg-panel">
      {/* === HERO with background image === */}
      <section className="relative overflow-hidden bg-navy py-24 text-white">
        <Image
          src="/Us/us-1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy/70" />

        <div className="site-shell relative">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
            Contact
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Parlons de votre laboratoire, de vos projets et de vos équipements.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
            Devis, recommandation produit, installation ou accompagnement
            technique : notre équipe vous répond dans les meilleurs délais.
          </p>
        </div>
      </section>

      {/* === THIS IS US + SUR LE TERRAIN === */}
      <ThisIsUs />

      {/* === CONTACT FORM + INFOS === */}
      <section className="bg-panel py-24">
        <div className="site-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionTitle
            eyebrow="Contact"
            title="Un site qui pousse naturellement vers le devis et la prise de contact."
            text="Pour le lancement, cette page peut servir de formulaire simple, puis evoluer plus tard vers un vrai workflow de demande de devis."
          />
          <div className="rounded-[2.25rem] border border-line bg-white p-8 shadow-halo">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-mist p-5">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
                  Telephone
                </p>
                <p className="mt-2 text-lg font-semibold text-ink">{company.phone}</p>
              </div>
              <div className="rounded-2xl bg-mist p-5">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold text-ink">{company.email}</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-mist p-5">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
                Adresse
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">{company.address}</p>
            </div>
            <ContactForm subject={subject} />
          </div>
        </div>
      </section>
    </main>
  );
}