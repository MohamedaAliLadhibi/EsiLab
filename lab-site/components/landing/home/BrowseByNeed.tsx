import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { productGroups } from '@/lib/product-groups';

export function BrowseByNeed() {
  return (
    <section className="bg-panel py-24">
      <div className="site-shell">
        <SectionTitle eyebrow="Explorer par besoin" title="Choisissez votre univers technique." text="Accédez plus vite aux produits et à l’accompagnement adaptés à votre laboratoire." />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {productGroups.map((group) => {
            const Icon = group.icon;

            return (
              <Link key={group.slug} href={`/products?group=${encodeURIComponent(group.slug)}`} className="group rounded-[1.75rem] border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-blue/40 hover:shadow-halo">
                <div className="flex items-start justify-between gap-6">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${group.surface}`}><Icon size={23} /></span>
                  <ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-ink">{group.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{group.summary}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-blue">Explorer la gamme</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
