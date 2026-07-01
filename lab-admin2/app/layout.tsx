// app/layout.tsx
import type { Metadata } from 'next';
import { Syne, DM_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import AuthGate from '@/components/layout/AuthGate';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'ESI Lab — Admin',
  description: 'Laboratory Equipment Catalogue Admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="bg-[#f5f7fb] text-ink font-display antialiased">
        <LanguageProvider>
          <AuthGate>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </AuthGate>
        </LanguageProvider>
      </body>
    </html>
  );
}
