import type { Metadata } from 'next';
import Image from 'next/image';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { EventCountdown } from '@/components/landing/events/EventCountdown';
import { PrecisaAnniversaryGallery } from '@/components/landing/events/PrecisaAnniversaryGallery';

export const metadata: Metadata = {
  title: 'Événements et actualités',
  description: 'Suivez les événements, les actualités et les moments de la vie d’équipe chez EsiLab.',
  alternates: { canonical: '/evenements' },
};

const pastEventPhotos = [
  {
    src: '/evenements/team-building-action.jpg',
    alt: 'L’équipe EsiLab profite d’une partie de paintball en forêt',
    caption: 'Une activité pleine d’énergie',
    className: 'md:col-span-7 md:row-span-2',
  },
  {
    src: '/evenements/team-building-team.jpg',
    alt: 'Des collègues réunis pendant le team building paintball',
    caption: 'L’esprit d’équipe en action',
    className: 'md:col-span-5',
  },
  {
    src: '/evenements/team-building-paintball.jpg',
    alt: 'Préparation du matériel de paintball pendant la sortie d’équipe',
    caption: 'De bons souvenirs partagés',
    className: 'md:col-span-5',
  },
];

const precisaAnniversaryPhotos = [
  {
    src: 'https://media.licdn.com/dms/image/v2/D5622AQFHIvkn96ijMA/feedshare-image-high-res/B56Z6nmUQiJQAY-/0/1780928300397?e=1794441600&v=beta&t=ZAK_X3CfmS--bD4whumTtpe65yoCblTX5n1ox_va6dc',
    alt: 'Célébration du 90e anniversaire de Precisa',
  },
  {
    src: 'https://media.licdn.com/dms/image/v2/D5622AQGdXWs7P10_vA/feedshare-shrink_1280/B56Z6nmT72GgAM-/0/1780928299128?e=1794441600&v=beta&t=pfMmoRiPvuMVnGTob6kdRSwNBYNRJIDTM8JCe3J9UeE',
    alt: 'Moment de la célébration Precisa partagé par EsiLab',
  },
  {
    src: 'https://media.licdn.com/dms/image/v2/D4D22AQHIwUxR20Itwg/feedshare-image-high-res/B4DZ6N0i6UIQAU-/0/1780495822895?e=1794441600&v=beta&t=9fk6a1Ir1lFi5Ya7GZEzPlmtCwV3sFC8Z_N71lF0DZs',
    alt: 'Souvenir de l’événement célébrant les 90 ans de Precisa',
  },
  {
    src: 'https://media.licdn.com/dms/image/v2/D5622AQGSRag6ztB1OA/feedshare-image-high-res/B56Z6nmT.fI4Ac-/0/1780928299164?e=1794441600&v=beta&t=NjRn-fWstq9yLe1Vzo43EfFAo3Ol3Kut1-RlzSBWh0s',
    alt: 'Célébration de l’anniversaire de Precisa avec ses partenaires',
  },
];

export default function EvenementsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy pb-20 pt-14 text-white sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(72,198,223,0.2),transparent_38%),radial-gradient(ellipse_at_0%_100%,rgba(31,87,184,0.45),transparent_45%)]" />
        <div className="site-shell relative grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="eyebrow text-cyan">La vie chez EsiLab</p>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Événements & actualités
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              Les nouvelles de l’équipe, nos rencontres et les moments qui nous rassemblent, au travail comme en dehors .
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2"><CalendarDays size={16} className="text-cyan" /> Samedi 31 octobre 2026 · 08:00</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2"><Users size={16} className="text-cyan" /> Team building</span>
            </div>
            <EventCountdown />
            <p className="mt-3 text-xs text-white/45">Heure de Tunis</p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-cyan/10 blur-2xl" />
            <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl sm:min-h-[400px]">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBrquCeQRu4FupyHcixOticvU1RPusRTsZ4r2j267Oyo6DOKWAfOV9SxPr&s=10"
                alt="Illustration du prochain team building EsiLab"
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="bg-navy object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 sm:p-10">
                <div>
                  <p className="text-sm text-white/75">Team building EsiLab</p>
                  <p className="mt-1 text-xl font-semibold text-white">Samedi 31 octobre · 08:00</p>
                </div>
                <Users size={38} strokeWidth={1.2} className="shrink-0 text-cyan" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="site-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow text-blue">Nos souvenirs</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">Un précédent team building plein de bonne humeur</h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-8 text-slate-600">
                Nous avons partagé une journée de paintball, de rires et de défis en équipe. Une belle occasion de sortir du cadre du travail, de renforcer nos liens et de créer de bons souvenirs ensemble.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500"><Users size={16} className="text-blue" /> Un moment d’équipe EsiLab</p>
            </div>
          </div>

          <div className="mt-10 grid auto-rows-[230px] gap-4 sm:auto-rows-[280px] md:grid-cols-12 md:auto-rows-[240px]">
            {pastEventPhotos.map((photo) => (
              <figure key={photo.src} className={`group relative overflow-hidden rounded-[1.75rem] bg-panel ${photo.className}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-5 pb-5 pt-12 text-sm font-medium text-white">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="site-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow text-blue">Souvenir partenaire</p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">Joyeux 90ᵉ anniversaire à Precisa !</h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-8 text-slate-600">
                Nous vous souhaitons encore de nombreuses années de succès, d'innovation et d'excellence. Ensemble, continuons à construire l'avenir de la technologie et de la précision.
              </p>
            </div>
          </div>
          <PrecisaAnniversaryGallery photos={precisaAnniversaryPhotos} />
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="site-shell">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-panel p-8 text-center sm:p-12">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-blue/10 text-blue"><MapPin size={23} /></span>
            <p className="eyebrow mt-6 text-blue">À suivre</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">Les prochains moments avec EsiLab</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
              Retrouvez ici les prochains événements, rencontres et actualités de notre équipe. Les photos seront ajoutées après chaque événement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-panel py-16 sm:py-20">
        <div className="site-shell">
          <div className="rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <p className="eyebrow text-blue">Restez au courant</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">D’autres nouvelles bientôt</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Retrouvez ici les prochains événements et les temps forts de la vie EsiLab.</p>
            </div>
            <a href="https://www.linkedin.com/company/esilab-tunisie/" target="_blank" rel="noreferrer" className="mt-6 inline-flex shrink-0 rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy sm:mt-0">
              Suivre EsiLab sur LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
