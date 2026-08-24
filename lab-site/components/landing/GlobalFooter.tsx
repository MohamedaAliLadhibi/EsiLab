import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { company, solutions } from '@/lib/site-data';

export function GlobalFooter() {
  return (
    <footer className="border-t border-white/70 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ---------- Left column (unchanged) ---------- */}
          <div className="space-y-6">
            {/* Brand & tagline */}
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_18px_30px_-18px_rgba(37,99,235,0.75)]">
                <Image
                  src="/logo-esilab-transparent.png"
                  alt="EsiLab"
                  width={34}
                  height={34}
                  className="h-auto w-8"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">EsiLab</p>
                <p className="text-sm text-slate-300">Expert du laboratoire</p>
              </div>
            </div>

            {/* Descriptive paragraph */}
            <div>
              <h2 className="text-4xl font-semibold">EsiLab</h2>
              <p className="mt-3 max-w-xl text-base leading-8 text-slate-300">
                Depuis plus de 85 ans dans l’esprit des grandes maisons du laboratoire,
                EsiLab accompagne les équipes avec des équipements, des réactifs,
                des services et un support technique centré sur la qualité,
                la précision et la performance.
              </p>
            </div>

            {/* Contact cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">
                  Adresse
                </p>
                <p className="mt-3 text-lg font-medium text-white">
                  {company.address}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">
                  Email
                </p>
                <p className="mt-3 text-lg font-medium text-white">
                  {company.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">
                Téléphone
              </p>
              <a
                href={`tel:${company.phone}`}
                className="mt-3 inline-flex items-center text-lg font-medium text-white transition hover:text-cyan"
              >
                <Phone size={20} className="mr-2 text-cyan" />
                {company.phone}
              </a>
            </div>

            {/* Solutions pills */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">
                Nos solutions
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {solutions.map((item) => (
                  <span
                    key={item.slug}
                    className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan-100"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>


          </div>

          {/* ---------- Right column (Fixed Map) ---------- */}
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
              {/* Responsive map container with 16:9 aspect ratio */}
              <div className="aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5]">
                <iframe
                  title="EsiLab location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    company.address
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              {/* “View larger map” link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  company.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-800 shadow backdrop-blur transition hover:bg-white"
              >
                <ExternalLink size={13} />
                Agrandir le plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}