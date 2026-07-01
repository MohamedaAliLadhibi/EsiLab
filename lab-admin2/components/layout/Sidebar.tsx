'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Building2, Upload,
  ClipboardList, ChevronRight, PlusCircle, Users
} from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const nav = [
  { labelKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'suppliers', href: '/suppliers', icon: Building2 },
  { labelKey: 'products', href: '/products', icon: Package },
  { labelKey: 'users', href: '/users', icon: Users },
  { labelKey: 'import', href: '/import', icon: Upload },
  { labelKey: 'importLogs', href: '/imports', icon: ClipboardList },
] as const;

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  async function handleLogout() {
    await fetch('/api/admin/admin/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-panel shadow-sm">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex flex-col items-start gap-1.5">
          <Image
            src="/logo-esilab-bleu.png"
            alt="EsiLab logo"
            width={180}
            height={180}
            priority
            className="h-auto w-[112px]"
          />
          <p className="text-[10px] text-dim font-mono uppercase tracking-[0.22em]">
            {t.nav.adminConsole}
          </p>
        </div>
      </div>

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
        <Link
          href="/users"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dim hover:text-ink hover:bg-muted border border-transparent transition-all"
        >
          <PlusCircle size={15} strokeWidth={1.8} />
          <span className="font-medium">{t.nav.addUser}</span>
        </Link>
      </nav>

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
            <span className="text-xs text-ink/70">{t.nav.connected}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-dim hover:text-ink hover:bg-muted transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
