'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

type AnniversaryPhoto = {
  src: string;
  alt: string;
};

const photoLayout = [
  'lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2',
  'lg:col-start-7 lg:col-span-3 lg:row-start-1',
  'lg:col-start-7 lg:col-span-3 lg:row-start-2',
  'lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-2',
];

const captions = [
  '90 ans de précision',
  'Un anniversaire à célébrer',
  'Un moment partagé',
  'Le gâteau des 90 ans',
];

export function PrecisaAnniversaryGallery({ photos }: { photos: AnniversaryPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<AnniversaryPhoto | null>(null);

  useEffect(() => {
    if (!activePhoto) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activePhoto]);

  return (
    <>
      <div className="mt-10 grid auto-rows-[230px] gap-4 sm:auto-rows-[280px] lg:grid-cols-12 lg:auto-rows-[210px] xl:auto-rows-[240px]">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActivePhoto(photo)}
            aria-label={`Agrandir la photo : ${photo.alt}`}
            className={`group relative overflow-hidden rounded-2xl text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${photoLayout[index % photoLayout.length]}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-5 left-5 right-14 text-left text-sm font-semibold text-white drop-shadow sm:text-base">
              {captions[index % captions.length]}
            </span>
            <span className="absolute bottom-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-navy/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn size={17} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setActivePhoto(null)}
            aria-label="Fermer la photo agrandie"
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
          >
            <X size={22} />
          </button>
          <div className="relative h-[82vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
