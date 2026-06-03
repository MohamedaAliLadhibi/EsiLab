import { BookOpenCheck, CreditCard, Headset, UserRound } from 'lucide-react';

const items = [
  {
    title: 'Service SAV Metrologie',
    text: 'Support local, maintenance et suivi d installation.',
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
  {
    title: 'Paiement securise',
    text: 'Une experience plus rassurante pour la partie commerciale.',
    icon: CreditCard,
    accent: 'text-slate-500',
  },
];

export function ServiceHighlights() {
  return (
    <section className="bg-white py-8">
      <div className="site-shell grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="text-center">
              <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-cloud">
                <Icon size={38} className={item.accent} />
              </div>
              <h3 className="mt-6 text-4xl font-semibold uppercase leading-none text-ink">{item.title}</h3>
              <p className="mx-auto mt-4 max-w-xs text-base leading-7 text-slate-600">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
