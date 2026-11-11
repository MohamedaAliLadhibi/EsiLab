'use client';

import { FormEvent, useState } from 'react';

const CONTACT_EMAIL = 'contact.esilab@esilab.tn';

const subjectLabels: Record<string, string> = {
  commande: 'Demande de commande ESILAB',
  documentation: 'Demande de documentation ESILAB',
  actualites: "Demande d'informations actualités ESILAB",
  sav: 'Demande SAV ESILAB',
  destockage: 'Demande de disponibilités déstockage ESILAB',
  promotions: 'Demande d’informations sur les promotions ESILAB',
};

export function ContactForm({ subject = 'contact' }: { subject?: string }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destinationEmail = subject === 'sav' ? 'achraf.kouki@esilab.tn' : CONTACT_EMAIL;
    const body = [
      'Bonjour ESILAB,',
      '',
      'Je souhaite vous contacter pour une demande.',
      '',
      name ? `Nom : ${name}` : '',
      company ? `Société : ${company}` : '',
      email ? `Email : ${email}` : '',
      phone ? `Téléphone : ${phone}` : '',
      '',
      'Message :',
      message,
    ].filter(Boolean).join('\n');

    const emailSubject = subjectLabels[subject] ?? 'Demande de contact ESILAB';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinationEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submitContact} className="mt-8 grid gap-4 md:grid-cols-2">
      <p className="text-sm leading-6 text-slate-600 md:col-span-2">
        Ce formulaire prépare un e-mail adressé à {subject === 'sav' ? 'achraf.kouki@esilab.tn' : CONTACT_EMAIL}. Vérifiez puis envoyez le brouillon qui s'ouvre.
      </p>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="rounded-2xl border border-line px-4 py-3 outline-none"
        placeholder="Nom complet"
      />
      <input
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="rounded-2xl border border-line px-4 py-3 outline-none"
        placeholder="Société"
      />
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        required
        className="rounded-2xl border border-line px-4 py-3 outline-none"
        placeholder="Email"
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="rounded-2xl border border-line px-4 py-3 outline-none"
        placeholder="Téléphone"
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
        className="min-h-40 rounded-2xl border border-line px-4 py-3 outline-none md:col-span-2"
        placeholder="Décrivez votre besoin, vos produits d'intérêt ou votre contexte laboratoire."
      />
      <button
        type="submit"
        className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-scarlet md:col-span-2 md:justify-self-start"
      >
        Préparer l'e-mail
      </button>
    </form>
  );
}
