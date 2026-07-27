'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { Btn, Input } from '@/components/ui';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('ammamedali@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,86,219,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.12),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-esi/15 bg-white/70 px-4 py-2 text-xs font-mono uppercase tracking-widest text-esi">
            <Sparkles size={14} />
            Secure Admin Portal
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Welcome back to the ESI Lab command room.
          </h1>
          <p className="mt-5 max-w-lg text-base text-dim">
            Sign in to manage suppliers, products, imports, and approved dashboard users.
          </p>
        </section>

        <section className="glass mx-auto w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-esi/10">
          <div className="mb-8">
            <Image src="/logo-esilab-bleu.png" alt="EsiLab logo" width={132} height={132} priority />
            <h2 className="mt-6 text-2xl font-bold">Sign in</h2>
            <p className="mt-1 text-sm text-dim">Use your approved admin or employer account.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">
                {error}
              </div>
            )}

            <Btn type="submit" variant="esi" className="w-full justify-center py-3" disabled={loading}>
              <Lock size={16} />
              {loading ? 'Signing in...' : 'Sign in'}
            </Btn>
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-white/70 p-4 text-sm text-dim">
            <div className="flex items-center gap-2 text-ink">
              <Mail size={15} />
              Need access?
            </div>
            <p className="mt-1">
              Create an employer account and wait for admin approval.
            </p>
            <Link href="/signup" className="mt-3 inline-block text-sm font-semibold text-esi hover:underline">
              Request account →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
