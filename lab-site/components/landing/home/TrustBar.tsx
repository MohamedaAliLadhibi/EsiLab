import { Award, BadgeCheck, MapPin, Wrench } from 'lucide-react';

const trustPoints = [
  { label: 'Selection technique', detail: 'Marques et solutions verifiees', icon: BadgeCheck },
  { label: 'Support local', detail: 'Accompagnement en Tunisie', icon: MapPin },
  { label: 'Mise en service', detail: 'Installation et prise en main', icon: Wrench },
  { label: 'Qualite suivie', detail: 'Conseil, SAV et maintenance', icon: Award },
];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-cloud/70 py-5">
      <div className="site-shell grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {trustPoints.map((point) => {
          const Icon = point.icon;

          return (
            <div key={point.label} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue shadow-soft">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{point.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{point.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
