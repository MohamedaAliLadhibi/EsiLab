// app/layout.tsx
import type { Metadata } from 'next';
import { Syne, DM_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import AuthShell from '@/components/auth/AuthShell';

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
          <AuthProvider>
            <AuthShell>{children}</AuthShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
