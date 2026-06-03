'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { FileText, Mail, MapPin, Phone, Search, ShoppingCart } from 'lucide-react';
import { company } from '@/lib/site-data';

const primaryNav = [
  { href: '/products', label: 'Produits' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'EsiLab' },
  { href: '/contact', label: 'Contact' },
];

const quickNav = [
  { href: '/products', label: 'Promotions' },
  { href: '/solutions', label: 'Documentation' },
];

export function GlobalNav() {
  const [isCompact, setIsCompact] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <>
      <div className={`transition-all duration-300 ${isCompact ? 'h-[72px]' : 'h-[254px]'}`} />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-full border-b border-line/70 bg-white shadow-[0_14px_34px_rgba(15,27,52,0.08)]">
          <div
            className={`overflow-hidden bg-navy text-white transition-all duration-300 ${
              isCompact ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
            }`}
          >
            <div className="site-shell flex flex-col gap-2 py-3 text-xs md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <span className="inline-flex items-center gap-2">
                  <Phone size={13} className="text-cyan" />
                  {company.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail size={13} className="text-cyan" />
                  {company.email}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/70">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={13} className="text-cyan" />
                  Ariana, Tunisie
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileText size={13} className="text-cyan" />
                  Support, devis et accompagnement technique
                </span>
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden border-b border-line/70 transition-all duration-300 ${
              isCompact ? 'max-h-0 opacity-0' : 'max-h-[220px] opacity-100'
            }`}
          >
            <div className="site-shell py-5">
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.45fr_0.65fr] lg:items-center">
                <Link href="/" className="flex items-center gap-4">
                  <Image src="/logo-esilab-bleu.png" alt="EsiLab" width={170} height={96} className="h-auto w-36" priority />
                  <div className="hidden sm:block">
                    <p className="text-2xl font-semibold text-blue">EsiLab</p>
                    <p className="text-sm text-slate-500">Expert du laboratoire</p>
                  </div>
                </Link>

                <form onSubmit={submitSearch} className="flex items-center rounded-2xl border border-line bg-white shadow-soft transition focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/15">
                  <div className="hidden border-r border-line/80 px-4 py-4 text-sm text-slate-500 sm:block">Catalogue</div>
                  <div className="flex flex-1 items-center gap-3 px-4 py-4 text-slate-500">
                    <Search size={20} className="text-blue" />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Rechercher une marque, un produit, une categorie ou une application..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button type="submit" className="m-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan text-white transition hover:bg-blue" aria-label="Rechercher">
                    <Search size={20} />
                  </button>
                </form>

                <div className="flex items-center gap-3 justify-self-start lg:justify-self-end">
                  <Link
                    href="/contact"
                    className="inline-flex rounded-xl bg-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy"
                  >
                    Nous contacter
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line text-slate-500 transition hover:border-blue hover:text-blue"
                    aria-label="Panier"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <div
              className={`site-shell flex flex-col gap-4 transition-all duration-300 lg:flex-row lg:items-center lg:justify-between ${
                isCompact ? 'py-3' : 'py-4'
              }`}
            >
              <Link href="/" className={`hidden items-center gap-3 lg:flex ${isCompact ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}>
                <Image src="/logo-esilab-bleu.png" alt="EsiLab" width={88} height={50} className="h-auto w-20" />
                <span className="text-lg font-semibold text-blue">EsiLab</span>
              </Link>

              <nav className={`flex flex-wrap items-center gap-x-8 gap-y-3 text-ink transition-all duration-300 ${isCompact ? 'text-base' : 'text-lg'}`}>
                {primaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-blue">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                {isCompact ? (
                  <>
                    <form onSubmit={submitSearch} className="hidden items-center rounded-xl border border-line bg-cloud px-3 py-2 transition focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/15 md:flex">
                      <Search size={16} className="text-blue" />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Recherche"
                        className="ml-2 w-32 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                      />
                    </form>
                    <Link
                      href={search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : '/products'}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-slate-600 transition hover:border-blue hover:text-blue"
                      aria-label="Recherche"
                    >
                      <Search size={18} />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-slate-600 transition hover:border-blue hover:text-blue"
                      aria-label="Panier"
                    >
                      <ShoppingCart size={18} />
                    </button>
                    <Link
                      href="/contact"
                      className="rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue"
                    >
                      Contact
                    </Link>
                  </>
                ) : (
                  <>
                    {quickNav.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="rounded-xl border border-line bg-cloud px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue hover:text-blue"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      href="/contact"
                      className="rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue"
                    >
                      Commande express
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
