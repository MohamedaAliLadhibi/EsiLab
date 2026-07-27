'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { Spinner } from '@/components/ui';
import { useAuth } from './AuthProvider';

const publicPaths = ['/login', '/signup'];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicPath) router.replace('/login');
    if (!loading && user && isPublicPath) router.replace('/dashboard');
  }, [isPublicPath, loading, router, user]);

  if (isPublicPath) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
