'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Search } from 'lucide-react';
import { company } from '@/lib/site-data';

const primaryNav = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'A propos' },
  { href: '/contact', label: 'Contact' },
];

export function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      <div className="h-[116px] lg:h-[124px]" />

      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? 'border-b border-line/60 bg-white/95 shadow-[0_16px_42px_rgba(15,27,52,0.12)] backdrop-blur-xl'
              : 'bg-[linear-gradient(180deg,rgba(10,21,44,0.84),rgba(10,21,44,0.72))] backdrop-blur-md'
          }`}
        >
          <div className={`hidden lg:block ${isScrolled ? 'border-b border-line/60' : 'border-b border-white/10'}`}>
            <div
              className={`site-shell flex items-center justify-between py-2 text-[11px] transition-colors ${
                isScrolled ? 'text-slate-500' : 'text-white/72'
              }`}
            >
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2">
                  <Phone size={12} className="text-cyan" />
                  {company.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail size={12} className="text-cyan" />
                  {company.email}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={12} className="text-cyan" />
                  Ariana, Tunisie
                </span>
                <span>Support et accompagnement technique</span>
              </div>
            </div>
          </div>

          <div className="site-shell">
            <div className="flex min-h-[72px] items-center justify-between gap-4 py-3 lg:min-h-[82px]">
              <Link href="/" className="flex shrink-0 items-center">
                <Image src="/logo-esilab-bleu.png" alt="EsiLab" width={160} height={90} className="h-auto w-24 lg:w-28" priority />
              </Link>

              <nav
                className={`hidden flex-1 items-center justify-center gap-8 text-[0.95rem] font-semibold lg:flex ${
                  isScrolled ? 'text-ink' : 'text-white'
                }`}
              >
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition ${
                      isScrolled ? 'hover:text-blue' : 'hover:text-cyan'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <form
                onSubmit={submitSearch}
                className={`flex items-center rounded-full border px-3 py-2 transition ${
                  isScrolled
                    ? 'w-[280px] border-line bg-cloud'
                    : 'w-[300px] border-white/16 bg-white/10 backdrop-blur-md'
                }`}
              >
                <Search size={17} className={isScrolled ? 'text-blue' : 'text-cyan'} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un produit..."
                  className={`min-w-0 flex-1 bg-transparent px-3 text-sm outline-none ${
                    isScrolled ? 'text-ink placeholder:text-slate-400' : 'text-white placeholder:text-white/50'
                  }`}
                />
                <button
                  type="submit"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isScrolled ? 'bg-blue text-white hover:bg-navy' : 'bg-cyan text-ink hover:bg-white'
                  }`}
                >
                  Rechercher
                </button>
              </form>
            </div>

            <div className={`flex items-center justify-between gap-3 pb-3 lg:hidden ${isScrolled ? 'text-ink' : 'text-white'}`}>
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
                {primaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className={isScrolled ? 'hover:text-blue' : 'hover:text-cyan'}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
