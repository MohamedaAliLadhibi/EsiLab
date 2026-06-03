import Link from 'next/link';
import { Download, Megaphone, Percent, ShoppingCart } from 'lucide-react';

const panels = [
  {
    title: 'Telechargement',
    text: 'Brochures, catalogues et documentations techniques.',
    icon: Download,
    className: 'bg-[#2db7f5]',
  },
  {
    title: 'Promotions',
    text: 'Mises en avant commerciales sur des familles strategiques.',
    icon: Percent,
    className: 'bg-[#45c3b0]',
  },
  {
    title: 'Destockage',
    text: 'Opportunites produits pour decisions rapides et budgets maitrises.',
    icon: ShoppingCart,
    className: 'bg-[#2851b4]',
  },
  {
    title: 'Actualites',
    text: 'Lancements, conseils applicatifs et vie du laboratoire.',
    icon: Megaphone,
    className: 'bg-[#4a4a4a]',
  },
];

export function QuickPanels() {
  return (
    <section className="bg-white py-12">
      <div className="site-shell grid gap-5 xl:grid-cols-4">
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <Link
              key={panel.title}
              href="/products"
              className={`${panel.className} flex min-h-[190px] flex-col justify-between rounded-[2rem] p-6 text-white transition hover:-translate-y-1`}
            >
              <div>
                <h3 className="text-4xl font-semibold uppercase leading-none">{panel.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-white/85">{panel.text}</p>
              </div>
              <div className="flex justify-end">
                <Icon size={54} className="text-white/95" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
