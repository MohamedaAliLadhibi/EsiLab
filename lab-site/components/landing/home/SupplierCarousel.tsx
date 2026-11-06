'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, MoveUpRight } from 'lucide-react';

const suppliers = [
  { name: 'MEMMERT', domain: 'memmert.com', logo: '/suppliers/memmert.png' },
  { name: 'EPPENDORF', domain: 'eppendorf.com' },
  { name: 'PRECISA', domain: 'precisa.com' },
  {
    name: 'LABTHINK',
    domain: 'labthinkinternational.com',
    externalUrl: 'https://www.labthinkinternational.com/',
    logo: 'https://www.azom.com/images/suppliers/ImageForSupplier_12457.jpg',
  },
  { name: 'NOVASINA', domain: 'novasina.ch', logo: '/suppliers/novasina.png' },
  { name: 'ZWIEBEL', domain: 'zwiebel.fr', logo: '/suppliers/zwiebel.png', externalUrl: 'https://www.zwiebel.fr/en/' },
  { name: 'TESTO', domain: 'testo.com' },
  { name: 'NABERTHERM', domain: 'nabertherm.com' },
  {
    name: 'ESCO',
    domain: 'escoglobal.com',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ku1GXNoExSRIlRACHW3_Mz1KnIfmKnB-ZXRufGRAtg&s=10',
  },
  { name: 'MITUTOYO', domain: 'mitutoyo.com' },
  {
    name: 'WIKA',
    domain: 'wika.com',
    logo: 'https://cdn.consentmanager.net/delivery/img/logo1671437972x6508.gif',
  },
  {
    name: 'BROOKFIELD',
    domain: 'brookfieldengineering.com',
    logo: 'https://www.brookfieldengineering.com/-/media/ametekbrookfield/2023-ametek-logo-and-product-catalogue/brookfield-logo2023.png?h=100&la=en&w=200&revision=28139100-e097-4e21-9856-672650d41907&hash=70B7D5F90759AD60D6EE60A631301C9C',
  },
  {
    name: 'VWR',
    domain: 'vwr.com',
    logo: 'https://occapi.avantorsciences.com/medias/vwr-part-of-avantor-logo.svg?context=bWFzdGVyfGltYWdlc3w1ODI1fGltYWdlL3N2Zyt4bWx8YUdWaEwyZzFaQzh4TURNNE16Z3hPVFUzTVRJek1DOTJkM0l0Y0dGeWRDMXZaaTFoZG1GdWRHOXlMV3h2WjI4dWMzWm58MTYzNTM4ZGQwNzhhZDQ4NjNjYTEzOWZkZTQzNWZhNGU4YTgzZTEyMGE3Y2Y3MGMzMjRkYWY4YjVhOWY3OTUxYg',
  },
  {
    name: 'ASECOS',
    domain: 'asecos.com',
    logo: 'https://www.asecos-configurator.com/EN/US/media/LOG_ASE_asecos-box-rot-4c_IN.jpg',
  },
  {
    name: 'MICHELL INSTRUMENTS',
    domain: 'processsensing.com',
    externalUrl: 'https://www.processsensing.com/',
    logo: 'https://www.processsensing.com/primg/50-years-michell.png',
  },
  { name: 'ADVANCED INSTRUMENTS', domain: 'aicompanies.com' },
];

export function SupplierCarousel() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previousTime = 0;
    let position = element.scrollLeft;
    const pixelsPerSecond = 28;

    const scroll = (time: number) => {
      if (element.matches(':focus-within')) {
        position = element.scrollLeft;
      } else if (previousTime && !reducedMotion.matches) {
        const maxScroll = element.scrollWidth - element.clientWidth;
        position = element.scrollLeft + (pixelsPerSecond * (time - previousTime)) / 1000;
        if (maxScroll > 0 && position >= maxScroll) position = 0;
        element.scrollLeft = position;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(scroll);
    };

    frame = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function move(direction: -1 | 1) {
    track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.78, behavior: 'smooth' });
  }

  return (
    <section aria-labelledby="supplier-title" className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] py-16 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-blue/[0.045] blur-3xl" />
      <div className="site-shell">
        <div className="relative flex items-end justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue/10 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue shadow-sm">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-blue" /> Nos partenaires
            </p>
            <h2 id="supplier-title" className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Les marques qui équipent vos laboratoires
            </h2>
            <p className="mt-2 text-sm text-slate-600">Une sélection de fabricants et fournisseurs de confiance.</p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" onClick={() => move(-1)} aria-label="Defiler les marques vers la gauche" className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Defiler les marques vers la droite" className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div ref={track} className="supplier-track relative mt-9 flex gap-5 overflow-x-auto px-1 pb-5 pt-1" role="list" aria-label="Fournisseurs partenaires">
          {suppliers.map((supplier) => (
            <a
              key={supplier.name}
              href={supplier.externalUrl ?? `https://${supplier.domain}`}
              target="_blank"
              rel="noreferrer"
              role="listitem"
              aria-label={`Visiter le site officiel de ${supplier.name}`}
              className="group flex h-32 w-[260px] shrink-0 snap-start items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/90 px-5 shadow-[0_8px_30px_rgba(15,27,52,0.055)] transition duration-200 hover:-translate-y-1.5 hover:border-blue/30 hover:bg-white hover:shadow-[0_18px_42px_rgba(31,87,184,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <span className={supplier.logo
                ? 'flex h-16 w-28 shrink-0 items-center justify-center'
                : 'grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue/[0.08] to-slate-50 ring-1 ring-blue/[0.08] transition-colors group-hover:from-blue/[0.12] group-hover:to-blue/[0.04]'}>
                <img
                  src={supplier.logo ?? `https://www.google.com/s2/favicons?domain=${supplier.domain}&sz=96`}
                  alt=""
                  loading="lazy"
                  className={supplier.logo ? 'max-h-14 w-full object-contain' : 'size-11 object-contain'}
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold leading-4 tracking-[0.07em] text-slate-700 group-hover:text-blue">{supplier.name}</span>
                <span className="mt-1.5 block text-[11px] text-slate-400">Marque partenaire</span>
              </span>
              <MoveUpRight size={14} className="shrink-0 self-start text-slate-300 transition group-hover:text-blue" />
            </a>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400 sm:hidden">Défilement automatique · faites glisser pour parcourir les marques.</p>
      </div>
      <style jsx>{`
        .supplier-track { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        @media (prefers-reduced-motion: reduce) { .supplier-track { scroll-behavior: auto; } }
        .supplier-track::-webkit-scrollbar { height: 6px; }
        .supplier-track::-webkit-scrollbar-track { background: transparent; }
        .supplier-track::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
      `}</style>
    </section>
  );
}
