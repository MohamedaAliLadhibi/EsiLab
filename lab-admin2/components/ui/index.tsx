// components/ui/index.tsx
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export function PageHeader({ title, subtitle, children }: {
  title: string; subtitle?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-dim mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, accent, icon }: {
  label: string; value: string | number; sub?: string;
  accent?: 'esi' | 'acid' | 'blue' | 'scarlet' | 'green' | 'amber'; icon?: React.ReactNode;
}) {
  const colors = {
    esi:     'text-esi     border-esi/25     bg-esi/5',
    acid:    'text-esi     border-esi/25     bg-esi/5',
    blue:    'text-blue    border-blue/25    bg-blue/5',
    scarlet: 'text-scarlet border-scarlet/25 bg-scarlet/8',
    green:   'text-green   border-green/25   bg-green/8',
    amber:   'text-amber   border-amber/25   bg-amber/8',
  };
  return (
    <div className={clsx(
      'rounded-xl border p-5 animate-fadeUp card-hover',
      accent ? colors[accent] : 'border-border bg-card'
    )}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-dim">{label}</p>
        {icon && <div className="opacity-50">{icon}</div>}
      </div>
      <p className="text-3xl font-bold mt-2 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-dim mt-1">{sub}</p>}
    </div>
  );
}

export function Btn({ children, variant = 'default', size = 'md', type = 'button', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'default' | 'esi' | 'acid' | 'scarlet' | 'ghost' | 'danger';
  size?: 'sm' | 'md'; type?: 'button' | 'submit';
  className?: string;
}) {
  const v = {
    default: 'bg-white hover:bg-[#f4f7fb] text-ink border border-border shadow-sm',
    esi:     'bg-esi text-white font-bold hover:bg-esi-dark esi-glow',
    acid:    'bg-esi text-white font-bold hover:bg-esi-dark esi-glow',
    scarlet: 'bg-scarlet text-white font-bold hover:bg-scarlet-dark scarlet-glow',
    ghost:   'text-dim hover:text-ink hover:bg-muted',
    danger:  'bg-red/10 hover:bg-red/20 text-red border border-red/20',
  };
  const s = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  return (
    <button
      type={type}
      {...props}
      className={clsx(
        'rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed',
        v[variant], s[size], className
      )}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = 'default' }: {
  children: React.ReactNode;
  color?: 'default' | 'green' | 'red' | 'amber' | 'esi' | 'acid' | 'blue' | 'scarlet';
}) {
  const c = {
    default: 'bg-muted text-dim',
    green:   'bg-green/10 text-green border border-green/25',
    red:     'bg-red/10 text-red border border-red/25',
    amber:   'bg-amber/10 text-amber border border-amber/25',
    esi:     'bg-esi/10 text-esi border border-esi/25',
    acid:    'bg-esi/10 text-esi border border-esi/25',
    blue:    'bg-blue/10 text-blue border border-blue/25',
    scarlet: 'bg-scarlet/10 text-scarlet border border-scarlet/25',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono', c[color])}>
      {children}
    </span>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={clsx('px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-dim bg-[#f8fafc] border-b border-border', className)}>
      {children}
    </th>
  );
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={clsx('px-4 py-3 border-b border-border/50 text-ink/80', className)}>
      {children}
    </td>
  );
}

export function Input({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-mono uppercase tracking-widest text-dim">{label}</label>}
      <input
        {...props}
        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50 transition-colors"
      />
      {hint && <p className="text-xs text-dim">{hint}</p>}
    </div>
  );
}

export function Select({ label, children, hint, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-mono uppercase tracking-widest text-dim">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className={clsx(
            'w-full bg-white border border-border rounded-lg py-2.5 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition-all appearance-none cursor-pointer',
            'hover:border-esi/35 focus:border-esi/60 focus:ring-4 focus:ring-esi/10 disabled:cursor-not-allowed disabled:bg-muted disabled:text-dim',
            className
          )}
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dim" />
      </div>
      {hint && <p className="text-xs text-dim">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, hint, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-mono uppercase tracking-widest text-dim">{label}</label>}
      <textarea
        {...props}
        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50 transition-colors resize-none"
      />
      {hint && <p className="text-xs text-dim">{hint}</p>}
    </div>
  );
}

export function Empty({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-dim/25 mb-4">{icon}</div>}
      <p className="text-dim text-sm">{message}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-esi/30 border-t-esi rounded-full animate-spin" />
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-card border border-border rounded-xl', className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-dim mb-3">{children}</p>
  );
}
