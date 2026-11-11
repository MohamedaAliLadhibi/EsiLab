import { BookOpenCheck, Headset, UserRound } from 'lucide-react';

const items = [
  {
    title: 'Service SAV métrologie',
    text: "Support local, maintenance et suivi d'installation.",
    icon: Headset,
    accent: 'text-cyan',
  },
  {
    title: 'Conseils personnalises',
    text: 'Orientation produit selon le contexte reel du laboratoire.',
    icon: UserRound,
    accent: 'text-blue',
  },
  {
    title: 'Compte client',
    text: 'Historique, favoris et parcours devis plus fluide.',
    icon: BookOpenCheck,
    accent: 'text-[#45c3b0]',
  },
];

export function ServiceHighlights() {
  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="site-shell grid gap-5 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-4 text-left sm:flex-col sm:text-center">
              <div className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-cloud sm:size-20 sm:rounded-full xl:size-24">
                <Icon size={30} className={`${item.accent} sm:h-9 sm:w-9`} />
              </div>
              <div className="min-w-0 sm:mt-5">
                <h3 className="text-lg font-semibold uppercase leading-tight text-ink sm:text-2xl xl:text-3xl">{item.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-600 sm:mx-auto sm:mt-3 sm:text-base sm:leading-7">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
