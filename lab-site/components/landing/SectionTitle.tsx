import clsx from 'clsx';

export function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={clsx('eyebrow', light ? 'text-cyan' : 'text-blue')}>{eyebrow}</p>
      <h2
        className={clsx(
          'mt-3 text-3xl font-semibold leading-tight text-balance md:text-5xl',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {text ? (
        <p className={clsx('mt-4 text-base leading-8', light ? 'text-white/72' : 'text-slate-600')}>{text}</p>
      ) : null}
    </div>
  );
}
