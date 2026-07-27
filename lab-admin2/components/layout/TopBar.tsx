'use client';

import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Btn } from '@/components/ui';

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-20 border-b border-border/80 bg-[#f5f7fb]/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-esi/20 bg-esi/10 text-esi">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-dim">EsiLab</p>
            <p className="text-sm font-semibold text-ink">Catalogue management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-dim font-mono uppercase">{user.role}</p>
            </div>
          )}
          <Btn variant="ghost" size="sm" onClick={logout}>
            <LogOut size={14} />
            Logout
          </Btn>
        </div>
      </div>
    </div>
  );
}
