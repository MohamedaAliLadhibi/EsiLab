'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { motion } from 'motion/react';

const primaryNav = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/evenements', label: 'Événements' },
  { href: '/sav', label: 'SAV' },
  { href: '/contact', label: 'Contact' },
];

export function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    setIsMobileMenuOpen(false);
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <>
      <div className="h-[72px] lg:h-[124px]" />

      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`relative h-[72px] transition-all duration-300 lg:h-[124px] ${
            isScrolled
              ? 'border-b border-line/60 bg-white/95 shadow-[0_16px_42px_rgba(15,27,52,0.12)] backdrop-blur-xl lg:h-[100px]'
              : 'bg-[linear-gradient(180deg,rgba(10,21,44,0.84),rgba(10,21,44,0.72))] backdrop-blur-md'
          }`}
        >
          <div className="site-shell h-full">
            <div className="flex h-full items-center justify-between gap-4">
              <Link href="/" className="flex shrink-0 items-center" aria-label="EsiLab, accueil">
                <div className="w-[82px] transition-[width] duration-300 lg:w-[112px]">
                  <Image
                    src="/logo-esilab-transparent.png"
                    alt="EsiLab"
                    width={160}
                    height={90}
                    className="h-auto w-full"
                    priority
                  />
                </div>
              </Link>

              <nav
                aria-label="Navigation principale"
                className={`hidden flex-1 items-center justify-center gap-8 text-[0.95rem] font-semibold lg:flex ${
                  isScrolled ? 'text-ink' : 'text-white'
                }`}
              >
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`relative transition hover:scale-105 ${isScrolled ? 'hover:text-blue' : 'hover:text-cyan'}`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        layoutId="nav-underline"
                        className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full ${isScrolled ? 'bg-blue' : 'bg-cyan'}`}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center gap-2 lg:flex">
                <form
                  onSubmit={submitSearch}
                  className={`flex items-center rounded-full border px-3 py-2 transition-all duration-300 ${
                    isScrolled
                      ? 'w-[280px] border-line bg-cloud focus-within:w-[320px] focus-within:shadow-md'
                      : 'w-[300px] border-white/16 bg-white/10 backdrop-blur-md focus-within:w-[340px] focus-within:bg-white/20'
                  }`}
                >
                  <Search size={17} className={isScrolled ? 'text-blue' : 'text-cyan'} />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un produit..."
                    aria-label="Rechercher un produit"
                    className={`min-w-0 flex-1 bg-transparent px-3 text-sm outline-none ${
                      isScrolled ? 'text-ink placeholder:text-slate-400' : 'text-white placeholder:text-white/50'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${
                      isScrolled ? 'bg-blue text-white hover:bg-navy' : 'bg-cyan text-ink hover:bg-white'
                    }`}
                  >
                    Rechercher
                  </button>
                </form>

                <div className="ml-4 flex items-center gap-4">
                  <Link
                    href="https://www.linkedin.com/company/esilab-tunisie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn EsiLab Tunisie"
                    className="transition hover:scale-110"
                  >
                    <Image src="/linkedin-logo.png" width={36} height={36} alt="" className="h-9 w-9 rounded-xl object-contain" />
                  </Link>
                  <Link
                    href="https://wa.me/21650601783"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp EsiLab"
                    className="transition hover:scale-110"
                  >
                    <Image src="/whatsapp-logo.png" width={36} height={36} alt="" className="h-9 w-9 rounded-xl object-contain" />
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className={`grid size-11 place-items-center rounded-xl border transition lg:hidden ${
                  isScrolled ? 'border-line text-ink hover:border-blue hover:text-blue' : 'border-white/25 text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div
              id="mobile-navigation"
              className={`absolute inset-x-0 top-full border-t px-5 pb-5 pt-3 shadow-xl lg:hidden ${
                isScrolled ? 'border-line bg-white text-ink' : 'border-white/10 bg-[#0a152c] text-white'
              }`}
            >
              <nav aria-label="Navigation principale mobile" className="grid gap-1">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isScrolled
                        ? pathname === item.href
                          ? 'bg-blue/10 text-blue'
                          : 'hover:bg-blue/5 hover:text-blue'
                        : pathname === item.href
                          ? 'bg-white/10 text-cyan'
                          : 'hover:bg-white/5 hover:text-cyan'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <form onSubmit={submitSearch} className="mt-3 flex items-center gap-2 rounded-xl border border-current/15 px-3 py-2">
                <Search size={17} className={isScrolled ? 'text-blue' : 'text-cyan'} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un produit..."
                  aria-label="Rechercher un produit"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-60"
                />
                <button type="submit" className="rounded-lg bg-blue px-3 py-2 text-xs font-semibold text-white">
                  Rechercher
                </button>
              </form>
              <div className="mt-4 flex gap-5 px-3 text-sm font-semibold">
                <Link href="https://www.linkedin.com/company/esilab-tunisie/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan">
                  LinkedIn
                </Link>
                <Link href="https://wa.me/21650601783" target="_blank" rel="noopener noreferrer" className="hover:text-cyan">
                  WhatsApp
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
