'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (pathname === '/login') {
        if (active) setReady(true);
        return;
      }

      try {
        const res = await fetch('/api/admin/admin/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('unauthorized');
        const json = await res.json();
        if (!json.data) throw new Error('unauthorized');
        if (active) setReady(true);
      } catch {
        router.replace('/login');
      }
    }

    checkAuth();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (pathname !== '/login' && !ready) {
    return <div className="p-8 text-sm text-dim">Loading...</div>;
  }

  return <>{children}</>;
}
