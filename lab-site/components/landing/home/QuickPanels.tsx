import Link from 'next/link';
import { Download, Megaphone, Percent, ShoppingCart } from 'lucide-react';

const panels = [
  {
    title: 'Téléchargement',
    text: 'Brochures, catalogues et documentations techniques.',
    icon: Download,
    className: 'bg-[#2db7f5]',
    href: '/telechargements',
  },
  {
    title: 'Promotions',
    text: 'Renseignez-vous sur nos offres commerciales en cours.',
    icon: Percent,
    className: 'bg-[#45c3b0]',
    href: '/promotions',
  },
  {
    title: 'Déstockage',
    text: 'Équipements disponibles selon les stocks et les conditions du moment.',
    icon: ShoppingCart,
    className: 'bg-[#2851b4]',
    href: '/destockage',
  },
  {
    title: 'Actualités',
    text: 'Lancements, conseils applicatifs et vie du laboratoire.',
    icon: Megaphone,
    className: 'bg-[#4a4a4a]',
    href: '/contact?subject=actualites',
  },
];

export function QuickPanels() {
  return (
    <section className="bg-white py-12">
      <div className="site-shell grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <Link
              key={panel.title}
              href={panel.href}
              className={`${panel.className} flex min-h-[168px] flex-col justify-between rounded-2xl p-4 text-white transition hover:-translate-y-1 sm:min-h-[190px] sm:rounded-[2rem] sm:p-6`}
            >
              <div>
                <h3 className="text-xl font-semibold uppercase leading-tight sm:text-3xl xl:text-4xl">{panel.title}</h3>
                <p className="mt-2 max-w-xs text-xs leading-5 text-white/90 sm:mt-4 sm:text-sm sm:leading-6">{panel.text}</p>
              </div>
              <div className="flex justify-end">
                <Icon size={34} className="text-white/95 sm:h-[54px] sm:w-[54px]" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
