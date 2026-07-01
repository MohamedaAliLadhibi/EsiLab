'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Heart, Shuffle } from 'lucide-react';

type ProductCardProps = {
  slug: string;
  brand: string;
  name: string;
  category: string;
  image: string;
  excerpt: string;
};

export function ProductCard({ slug, brand, name, category, image, excerpt }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('esilab:favorites') ?? '[]') as string[];
    const compared = JSON.parse(localStorage.getItem('esilab:compare') ?? '[]') as string[];
    setIsFavorite(favorites.includes(slug));
    setIsCompared(compared.includes(slug));
  }, [slug]);

  const toggleStoredItem = (key: string, isActive: boolean, setActive: (value: boolean) => void) => {
    const current = JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
    const next = isActive ? current.filter((item) => item !== slug) : Array.from(new Set([...current, slug]));
    localStorage.setItem(key, JSON.stringify(next));
    setActive(!isActive);
  };

  return (
    <article className="overflow-hidden rounded-[2rem] border border-line/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-halo">
      <div className="relative flex h-72 items-center justify-center bg-gradient-to-br from-[#f6fbff] via-white to-[#edf5ff] p-6">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="border-t border-line/70 p-6">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-blue">{category}</p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">{name}</h3>
        <p className="mt-2 text-sm font-medium text-slate-500">{brand}</p>
        <p className="mt-4 text-sm leading-7 text-slate-600">{excerpt}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleStoredItem('esilab:favorites', isFavorite, setIsFavorite)}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue/25 transition hover:bg-blue hover:text-white ${
              isFavorite ? 'bg-blue text-white' : 'text-blue'
            }`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            title={isFavorite ? 'Favori ajoute' : 'Ajouter aux favoris'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <Link
            href={`/products/${slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue px-4 py-3 text-sm font-semibold text-blue transition hover:bg-blue hover:text-white"
          >
            En savoir plus
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={() => toggleStoredItem('esilab:compare', isCompared, setIsCompared)}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue/25 transition hover:bg-blue hover:text-white ${
              isCompared ? 'bg-blue text-white' : 'text-blue'
            }`}
            aria-label={isCompared ? 'Retirer du comparateur' : 'Comparer'}
            title={isCompared ? 'Produit ajoute au comparateur' : 'Comparer'}
          >
            <Shuffle size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
