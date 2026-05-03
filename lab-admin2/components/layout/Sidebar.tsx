'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Building2, Upload,
  ClipboardList, ChevronRight, PlusCircle
} from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const nav = [
  { labelKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'suppliers', href: '/suppliers', icon: Building2 },
  { labelKey: 'products', href: '/products', icon: Package },
  { labelKey: 'import', href: '/import', icon: Upload },
  { labelKey: 'importLogs', href: '/imports', icon: ClipboardList },
] as const;

export default function Sidebar() {
  const path = usePathname();
  const { lang, setLang, t } = useLanguage();

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-panel shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          {/* ESI Logo mark — triangle + red bar */}
          <div className="w-8 h-8 flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="4,36 20,6 36,36" fill="none" stroke="#1a56db" strokeWidth="5" strokeLinejoin="round"/>
              <line x1="14" y1="28" x2="36" y2="28" stroke="#e02424" strokeWidth="5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight leading-none">
              <span className="text-esi">ESI</span><span className="text-scarlet">LAB</span>
            </p>
            <p className="text-[10px] text-dim mt-0.5 font-mono">{t.nav.adminConsole}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ labelKey, href, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                active
                  ? 'bg-esi/10 text-esi border border-esi/25 esi-glow'
                  : 'text-dim hover:text-ink hover:bg-muted border border-transparent'
              )}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
              <span className="flex-1 font-medium">{t.nav[labelKey]}</span>
              {active && <ChevronRight size={12} className="opacity-60" />}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="pt-3 pb-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-dim/70 px-3">{t.nav.quickActions}</p>
        </div>
        <Link
          href="/suppliers/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dim hover:text-ink hover:bg-muted border border-transparent transition-all"
        >
          <PlusCircle size={15} strokeWidth={1.8} />
          <span className="font-medium">{t.nav.addSupplier}</span>
        </Link>
        <Link
          href="/products/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dim hover:text-ink hover:bg-muted border border-transparent transition-all"
        >
          <PlusCircle size={15} strokeWidth={1.8} />
          <span className="font-medium">{t.nav.addProduct}</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border space-y-3">
        <div className="grid grid-cols-2 rounded-lg border border-border bg-[#f8fafc] p-1">
          {(['en', 'fr'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLang(option)}
              className={clsx(
                'rounded-md px-2 py-1.5 text-xs font-bold transition-colors',
                lang === option ? 'bg-white text-esi shadow-sm' : 'text-dim hover:text-ink'
              )}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="glass rounded-lg px-3 py-2.5">
          <p className="text-[10px] text-dim font-mono uppercase tracking-widest">{t.nav.apiStatus}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-esi" />
            <span className="text-xs text-ink/70">{t.nav.connected} · :3001</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
