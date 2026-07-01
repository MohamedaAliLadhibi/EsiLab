'use client';

import { FormEvent, useState } from 'react';

const CONTACT_EMAIL = 'contact@esilab.tn';

const subjectLabels: Record<string, string> = {
  commande: 'Demande de commande EsiLab',
  documentation: 'Demande de documentation EsiLab',
  actualites: 'Demande d informations actualites EsiLab',
};

export function ContactForm({ subject = 'contact' }: { subject?: string }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      'Bonjour EsiLab,',
      '',
      'Je souhaite vous contacter pour une demande.',
      '',
      name ? `Nom : ${name}` : '',
      company ? `Societe : ${company}` : '',
      email ? `Email : ${email}` : '',
      phone ? `Telephone : ${phone}` : '',
      '',
      'Message :',
      message,
    ].filter(Boolean).join('\n');

    const emailSubject = subjectLabels[subject] ?? 'Demande de contact EsiLab';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submitContact} className="mt-8 grid gap-4 md:grid-cols-2">
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
        placeholder="Societe"
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
        placeholder="Telephone"
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
        className="min-h-40 rounded-2xl border border-line px-4 py-3 outline-none md:col-span-2"
        placeholder="Decrivez votre besoin, vos produits d interet ou votre contexte laboratoire."
      />
      <button type="submit" className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-scarlet md:col-span-2 md:justify-self-start">
        Envoyer la demande
      </button>
    </form>
  );
}
