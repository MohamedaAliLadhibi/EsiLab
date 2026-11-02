'use client';

import { useEffect, useState } from 'react';

const EVENT_DATE = new Date('2026-10-31T08:00:00+01:00').getTime();

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

function getCountdown(): Countdown {
  const remaining = Math.max(0, EVENT_DATE - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

export function EventCountdown() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!countdown) {
    return <div className="mt-8 h-24 animate-pulse rounded-2xl bg-white/10" aria-hidden="true" />;
  }

  if (EVENT_DATE <= Date.now()) {
    return <p className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 text-sm font-medium text-white/80">Cet événement est terminé. D’autres nouvelles bientôt.</p>;
  }

  const units = [
    { label: 'Jours', value: countdown.days },
    { label: 'Heures', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Secondes', value: countdown.seconds },
  ];

  return (
    <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Compte à rebours avant l’événement">
      {units.map(({ label, value }) => (
        <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-4 text-center backdrop-blur-sm sm:px-4 sm:py-5">
          <div className="font-display text-3xl font-semibold tabular-nums text-white sm:text-4xl">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/65 sm:text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
}
