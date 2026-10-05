'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselSlide = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

type Props = {
  slides: CarouselSlide[];
  autoPlayMs?: number;
};

export function SavCarousel({ slides, autoPlayMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || autoPlayMs <= 0) return;
    const id = setInterval(() => go(1), autoPlayMs);
    return () => clearInterval(id);
  }, [go, paused, autoPlayMs]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      className="group relative overflow-hidden rounded-[2rem] border border-line bg-navy shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
<div
  key={slide.src}
  className="relative aspect-[16/9] max-h-[60vh] w-full shrink-0 md:max-h-[65vh]"
>            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />

            {(slide.title || slide.caption) && (
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                {slide.title && (
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
                    {slide.title}
                  </p>
                )}
                {slide.caption && (
                  <p className="mt-2 max-w-2xl text-lg font-semibold text-white md:text-xl">
                    {slide.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Image précédente"
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/60 text-white backdrop-blur transition hover:bg-cyan hover:text-ink md:inline-flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Image suivante"
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/60 text-white backdrop-blur transition hover:bg-cyan hover:text-ink md:inline-flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Aller à l'image ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-cyan' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}