'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

const primaryNav = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/sav', label: 'SAV' },
  { href: '/contact', label: 'Contact' },
];

export function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const headerHeight = isScrolled ? 100 : 124;
  const logoWidth = isScrolled ? 100 : 112;
  const verticalPadding = isScrolled ? 'py-4' : 'py-3';

  return (
    <>
      <div className="h-[124px]" />

      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div
          animate={{ height: headerHeight }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`overflow-hidden transition-colors duration-300 ${
            isScrolled
              ? 'border-b border-line/60 bg-white/95 shadow-[0_16px_42px_rgba(15,27,52,0.12)] backdrop-blur-xl'
              : 'bg-[linear-gradient(180deg,rgba(10,21,44,0.84),rgba(10,21,44,0.72))] backdrop-blur-md'
          }`}
        >
          <div className="site-shell h-full">
            <div className={`flex h-full items-center justify-between gap-4 ${verticalPadding}`}>
              <Link href="/" className="flex shrink-0 items-center">
                <motion.div
                  animate={{ width: logoWidth }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Image
                    src="/logo-esilab-transparent.png"
                    alt="EsiLab"
                    width={160}
                    height={90}
                    className="h-auto w-full"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Navigation desktop */}
              <nav
                className={`hidden flex-1 items-center justify-center gap-8 text-[0.95rem] font-semibold lg:flex ${
                  isScrolled ? 'text-ink' : 'text-white'
                }`}
              >
                {primaryNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative transition hover:scale-105 ${
                        isScrolled ? 'hover:text-blue' : 'hover:text-cyan'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full ${
                            isScrolled ? 'bg-blue' : 'bg-cyan'
                          }`}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Groupe de droite : recherche + icônes sociales */}
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className={`min-w-0 flex-1 bg-transparent px-3 text-sm outline-none ${
                      isScrolled
                        ? 'text-ink placeholder:text-slate-400'
                        : 'text-white placeholder:text-white/50'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${
                      isScrolled
                        ? 'bg-blue text-white hover:bg-navy'
                        : 'bg-cyan text-ink hover:bg-white'
                    }`}
                  >
                    Rechercher
                  </button>
                </form>

                {/* 📍 IMAGES AGRANDIES ET BORDS ARRONDIS */}
                <div className="ml-4 flex items-center gap-4">
                  <Link
                    href="https://www.linkedin.com/company/esilab-tunisie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn EsiLab Tunisie"
                    className="transition hover:scale-110"
                  >
                    <Image
                      src="/linkedin-logo.png"
                      width={36}
                      height={36}
                      alt="LinkedIn"
                      className="h-9 w-9 object-contain rounded-xl"
                    />
                  </Link>
                  <Link
                    href="https://wa.me/21650601783"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp EsiLab"
                    className="transition hover:scale-110"
                  >
                    <Image
                      src="/whatsapp-logo.png"
                      width={36}
                      height={36}
                      alt="WhatsApp"
                      className="h-9 w-9 object-contain rounded-xl"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation mobile */}
            <div
              className={`flex items-center justify-between gap-3 pb-3 lg:hidden ${
                isScrolled ? 'text-ink' : 'text-white'
              }`}
            >
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition hover:scale-105 ${
                      isScrolled
                        ? pathname === item.href
                          ? 'text-blue underline underline-offset-4'
                          : 'hover:text-blue'
                        : pathname === item.href
                          ? 'text-cyan underline underline-offset-4'
                          : 'hover:text-cyan'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>
      </header>
    </>
  );
}