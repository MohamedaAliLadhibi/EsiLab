'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react';

type ProductCard = { slug: string; name: string; sku: string; brand: string; category: string };
type AssistantLink = { label: string; href: string };
type ChatMessage = { role: 'user' | 'assistant'; content: string; products?: ProductCard[]; links?: AssistantLink[] };

const suggestions = [
  'Je cherche une balance analytique',
  'Quel produit pour mesurer le pH ?',
  'Je cherche le Memmert IN55',
];

const greeting: ChatMessage = {
  role: 'assistant',
  content: 'Bonjour ! Je peux vous aider à trouver un équipement et à consulter les informations techniques disponibles dans notre catalogue. Que recherchez-vous ?',
};

export function CatalogueAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy, open]);

  async function sendMessage(value: string) {
    const content = value.trim();
    if (!content || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setBusy(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-8).map(({ role, content: text }) => ({ role, content: text })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Une erreur est survenue.');
      setMessages((current) => [...current, {
        role: 'assistant',
        content: result.answer,
        products: result.products || [],
        links: result.links || [],
      }]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Impossible de joindre l’assistant.');
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && (
        <section aria-label="Assistant catalogue EsiLab" className="flex h-[min(76vh,650px)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,27,52,0.24)]">
          <header className="flex items-center gap-3 bg-navy px-5 py-4 text-white">
            <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-cyan"><Bot size={21} /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-sm font-semibold">Assistant EsiLab</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70"><span className="size-1.5 rounded-full bg-emerald-400" />Conseil produits & catalogue</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le chat" className="grid size-9 place-items-center rounded-xl text-white/75 transition hover:bg-white/10 hover:text-white"><X size={19} /></button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9fc] px-4 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-blue text-white' : 'rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.slice(0, 4).map((product) => (
                        <Link key={product.slug} href={`/products/${encodeURIComponent(product.slug)}`} onClick={() => setOpen(false)} className="group block rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 transition hover:border-blue/40 hover:bg-blue/5">
                          <span className="flex items-start justify-between gap-2 text-xs font-semibold leading-5 text-ink">{product.name}<ArrowUpRight size={14} className="mt-0.5 shrink-0 text-blue" /></span>
                          {(product.brand || product.sku) && <span className="mt-1 block text-[11px] text-slate-500">{[product.brand, product.sku].filter(Boolean).join(' · ')}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.links.map((action) => action.href.startsWith('/') ? (
                        <Link key={`${action.href}-${action.label}`} href={action.href} onClick={() => setOpen(false)} className="inline-flex items-center gap-1 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue transition hover:border-blue/40 hover:bg-blue/10">
                          {action.label}<ArrowUpRight size={13} />
                        </Link>
                      ) : (
                        <a key={`${action.href}-${action.label}`} href={action.href} className="inline-flex items-center gap-1 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue transition hover:border-blue/40 hover:bg-blue/10">
                          {action.label}<ArrowUpRight size={13} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2 pl-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Essayez par exemple</p>
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" disabled={busy} onClick={() => void sendMessage(suggestion)} className="block rounded-full border border-blue/15 bg-white px-3 py-1.5 text-left text-xs text-blue transition hover:border-blue/40 hover:bg-blue/5 disabled:opacity-50">{suggestion}</button>
                ))}
              </div>
            )}

            {busy && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin text-blue" />Recherche dans le catalogue…</div>}
            {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700">{error}</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue/50 focus-within:ring-2 focus-within:ring-blue/10">
              <label className="sr-only" htmlFor="catalogue-assistant-input">Votre question</label>
              <textarea id="catalogue-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(input); } }} placeholder="Posez votre question…" maxLength={1200} rows={1} className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!input.trim() || busy} aria-label="Envoyer le message" className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40"><Send size={16} /></button>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400"><Sparkles size={11} />Réponses fondées sur le catalogue EsiLab</p>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Fermer l’assistant EsiLab' : 'Ouvrir l’assistant EsiLab'} className="group relative grid size-14 place-items-center rounded-full bg-blue text-white shadow-[0_12px_34px_rgba(31,87,184,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/25">
        {open ? <X size={23} /> : <><MessageCircle size={24} /><span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full border-2 border-white bg-cyan text-[10px] font-bold text-navy"> <Sparkles size={10} /></span></>}
      </button>
    </div>
  );
}
