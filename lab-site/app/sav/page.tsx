import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  GraduationCap,
  Ruler,
  Package,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  User,
} from 'lucide-react';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { TrustBar } from '@/components/landing/home/TrustBar';
import { ContactForm } from '@/components/landing/ContactForm';
import { SavCarousel } from '@/components/landing/SavCarousel';
import { brands, clientReferences, company, savContact } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Service Après-Vente',
  description:
    "Installation, maintenance, formation et suivi d'équipements de laboratoire en Tunisie. Nos ingénieurs et techniciens assurent la continuité de vos analyses.",
  alternates: {
    canonical: '/sav',
  },
};

const services = [
  {
    title: 'Installation & mise en service',
    text: "Installation sur site, vérification de fonctionnement et prise en main de vos équipes dès la livraison.",
    icon: Wrench,
    accent: 'text-blue',
    bg: 'bg-blue/10',
  },
  {
    title: 'Maintenance préventive',
    text: 'Contrats et visites planifiées pour prévenir les pannes et garantir la régularité de vos analyses.',
    icon: ShieldCheck,
    accent: 'text-cyan',
    bg: 'bg-cyan/10',
  },
  {
    title: 'Maintenance curative',
    text: 'Diagnostic, réparation sur site ou en atelier et remise en service rapide de vos équipements.',
    icon: Wrench,
    accent: 'text-orange',
    bg: 'bg-orange/10',
  },
  {
    title: 'Formation utilisateurs',
    text: 'Formation opérateur adaptée à votre application : bonnes pratiques, méthodes et sécurité.',
    icon: GraduationCap,
    accent: 'text-lime',
    bg: 'bg-lime/10',
  },
  {
    title: 'Métrologie & calibration',
    text: 'Vérification, étalonnage et traçabilité de vos instruments pour des résultats conformes.',
    icon: Ruler,
    accent: 'text-navy',
    bg: 'bg-navy/10',
  },
  {
    title: 'Pièces détachées & consommables',
    text: 'Fourniture de pièces d’origine et consommables pour prolonger la durée de vie de vos équipements.',
    icon: Package,
    accent: 'text-blue',
    bg: 'bg-blue/10',
  },
];

const steps = [
  {
    number: '01',
    title: 'Contactez-nous',
    text: 'Par téléphone, WhatsApp ou via le formulaire. Décrivez votre équipement et le problème rencontré.',
  },
  {
    number: '02',
    title: 'Diagnostic',
    text: 'Nos techniciens analysent votre demande et proposent une solution adaptée (à distance ou sur site).',
  },
  {
    number: '03',
    title: 'Intervention',
    text: 'Réparation, maintenance ou installation réalisée par nos ingénieurs et techniciens certifiés.',
  },
  {
    number: '04',
    title: 'Suivi durable',
    text: 'Rapport d’intervention, formation si nécessaire et suivi pour garantir la performance dans la durée.',
  },
];

const faqs = [
  {
    q: 'Quels équipements prenez-vous en charge ?',
    a: 'Nous intervenons sur l’ensemble des équipements que nous distribuons : instrumentation de laboratoire, centrifugation, enceintes thermiques, métrologie dimensionnelle, inspection et consommables associés.',
  },
  {
    q: 'Proposez-vous des contrats de maintenance ?',
    a: 'Oui. Nous proposons des contrats de maintenance préventive et curative adaptés à votre parc, avec des visites planifiées et un suivi tracé.',
  },
  {
    q: 'Quels sont vos délais d’intervention ?',
    a: 'Nos délais dépendent de la nature de la demande et de votre localisation. Contactez-nous pour connaître notre engagement précis selon votre contrat.',
  },
  {
    q: 'Intervenez-vous partout en Tunisie ?',
    a: 'Oui, EsiLab accompagne les laboratoires sur l’ensemble du territoire tunisien, avec un support local et une équipe technique dédiée.',
  },
];

const savSlides = [
  {
    src: '/SAV/SAV-1.jpeg',
    alt: 'Intervention technique EsiLab sur équipement de laboratoire',
    title: 'Sur le terrain',
    caption: 'Installation et mise en service réalisées par nos ingénieurs.',
  },
  {
    src: '/SAV/SAV-2.jpeg',
    alt: 'Maintenance préventive sur instrument de laboratoire',
    title: 'Maintenance préventive',
    caption: 'Visites planifiées pour garantir la continuité de vos analyses.',
  },
  {
    src: '/SAV/SAV-3.jpeg',
    alt: 'Diagnostic et réparation d’équipement scientifique',
    title: 'Diagnostic & réparation',
    caption: 'Un diagnostic précis avant chaque intervention.',
  },
  {
    src: '/SAV/SAV-4.jpeg',
    alt: 'Calibration et métrologie EsiLab',
    title: 'Métrologie & calibration',
    caption: 'Traçabilité et conformité de vos instruments.',
  },
  {
    src: '/SAV/SAV-5.jpeg',
    alt: 'Formation utilisateurs EsiLab',
    title: 'Formation utilisateurs',
    caption: 'Vos équipes formées aux bonnes pratiques.',
  },
];

export default function SavPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-24 text-white">
        <Image
          src="/SAV/SAV-1.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy/70" />

        <div className="site-shell relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
              Service Après-Vente
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
              Un support technique qui garantit la continuité de vos analyses.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
              Installation, maintenance, formation et suivi durable : nos ingénieurs et
              techniciens accompagnent vos équipements tout au long de leur cycle de vie,
              partout en Tunisie.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#demande-sav"
                className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Demander une intervention
                <ArrowRight size={16} />
              </a>
              <a
                href={`tel:+216${savContact.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone size={16} />
                Appeler le SAV
              </a>
            </div>
          </div>

          {/* RIGHT CARD — CONTACTS */}
          <div className="rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
            {/* SAV DEDICATED CONTACT */}
            <div className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-white/5 to-transparent p-5">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan/25 blur-3xl"
              />

              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan/20 text-cyan">
                  <User size={16} />
                </span>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
                  Votre contact SAV dédié
                </p>
              </div>

              <div className="relative mt-4">
                <p className="text-lg font-semibold text-white">{savContact.name}</p>
                <p className="mt-0.5 text-xs text-white/60">{savContact.role}</p>
              </div>

              <div className="relative mt-5 space-y-2">
                {/* Email */}
                <a
                  href={`mailto:${savContact.email}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-cyan/40 hover:bg-white/10"
                >
                  <Mail size={16} className="shrink-0 text-cyan" />
                  <span className="truncate text-sm text-white/90 group-hover:text-white">
                    {savContact.email}
                  </span>
                </a>

                {/* Phone */}
                <a
                  href={`tel:+216${savContact.phone}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-cyan/40 hover:bg-white/10"
                >
                  <Phone size={16} className="shrink-0 text-cyan" />
                  <span className="text-sm text-white/90 group-hover:text-white">
                    {savContact.phoneDisplay}
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${savContact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-2.5 transition hover:border-[#25D366] hover:bg-[#25D366]/20"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#25D366]/25 blur-2xl transition group-hover:bg-[#25D366]/40"
                  />
                  <MessageCircle size={16} className="relative shrink-0 text-[#25D366]" />
                  <span className="relative flex-1 text-sm font-semibold text-white">
                    WhatsApp direct
                  </span>
                  <ArrowRight
                    size={14}
                    className="relative shrink-0 text-[#25D366] transition group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>

            {/* GENERAL CONTACT */}
            <p className="mt-8 text-xs font-mono uppercase tracking-[0.25em] text-white/50">
              Standard EsiLab
            </p>

            <div className="mt-4 space-y-2">
              <a
                href={`tel:${company.phone.replace(/\s|\/|\(|\)/g, '')}`}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-cyan/40 hover:bg-white/10"
              >
                <Phone size={16} className="shrink-0 text-white/60" />
                <span className="truncate text-sm text-white/80 group-hover:text-white">
                  {company.phone}
                </span>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-cyan/40 hover:bg-white/10"
              >
                <Mail size={16} className="shrink-0 text-white/60" />
                <span className="truncate text-sm text-white/80 group-hover:text-white">
                  {company.email}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* SERVICES */}
      <section className="py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Nos prestations"
            title="Un service complet, du premier contact au suivi durable."
            text="Nos ingénieurs et techniciens interviennent sur l’ensemble du cycle de vie de vos équipements, avec une exigence de qualité et de traçabilité."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-[2rem] border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-halo"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${service.bg} ${service.accent}`}
                  >
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERIE SAV — CARROUSEL */}
      <section className="bg-cloud/60 py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Nos interventions en images"
            title="Le SAV EsiLab, en action sur le terrain."
            text="Installation, maintenance, calibration et formation : un aperçu de nos interventions auprès des laboratoires tunisiens."
          />

          <div className="mt-14">
            <SavCarousel slides={savSlides} autoPlayMs={5000} />
          </div>

          {/* Mini strip — thumbnails */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            {savSlides.map((slide) => (
              <div
                key={`thumb-${slide.src}`}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Notre processus"
            title="De votre demande à la remise en service."
            text="Une méthode simple et transparente pour vous garantir une prise en charge rapide et efficace."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[2rem] border border-line bg-white p-6">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue">
                  {step.number}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUES */}
      <section className="bg-cloud/60 py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Marques supportées"
            title="Nous intervenons sur les marques que nous distribuons."
            text="Un support technique maîtrisé sur l’ensemble des équipements que nous représentons."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {brands.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Ils nous font confiance"
            title="Des laboratoires qui s’appuient sur notre SAV au quotidien."
            text="La crédibilité se construit aussi par les références terrain que nous accompagnons."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {clientReferences.map((client) => (
              <span
                key={client}
                className="rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DEMANDE SAV */}
      <section id="demande-sav" className="bg-cloud/60 py-24">
        <div className="site-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle
              eyebrow="Demande d’intervention"
              title="Décrivez votre besoin, nous prenons le relais."
              text="Remplissez le formulaire ou contactez-nous directement. Nos techniciens vous répondent dans les meilleurs délais."
            />
            <ul className="mt-8 space-y-3 text-sm text-slate-600">
              {[
                'Prise en charge rapide',
                'Intervention sur site ou à distance',
                'Rapport et suivi d’intervention',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-cyan" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-[2rem] border border-line bg-white p-6">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue">
                Contact SAV direct
              </p>
              <p className="mt-3 text-base font-semibold text-ink">{savContact.name}</p>
              <p className="text-xs text-slate-500">{savContact.role}</p>
              <div className="mt-4 space-y-2 text-sm">
                <a
                  href={`mailto:${savContact.email}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue"
                >
                  <Mail size={15} /> {savContact.email}
                </a>
                <a
                  href={`tel:+216${savContact.phone}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue"
                >
                  <Phone size={15} /> {savContact.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${savContact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-[#25D366] hover:text-[#1ebe5d]"
                >
                  <MessageCircle size={15} /> WhatsApp direct
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
            <ContactForm subject="sav" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="site-shell">
          <SectionTitle
            eyebrow="Questions fréquentes"
            title="Tout ce qu’il faut savoir sur notre SAV."
            text="Une question qui n’est pas listée ? Contactez-nous directement."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[2rem] border border-line bg-white p-6">
                <h3 className="text-lg font-semibold text-ink">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-cloud/60 py-24">
        <div className="site-shell">
          <div className="rounded-[2rem] bg-navy p-12 text-center text-white">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
              Passer à l’action
            </p>
            <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
              Une panne, un entretien ou une installation à planifier ?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75">
              Contactez notre équipe SAV pour une prise en charge rapide et adaptée à votre
              laboratoire.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#demande-sav"
                className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Demander une intervention
                <ArrowRight size={16} />
              </a>
              <a
                href={`https://wa.me/${savContact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#25D366]/20"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                WhatsApp direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}