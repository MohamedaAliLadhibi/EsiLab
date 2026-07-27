'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { Btn, Input } from '@/components/ui';
import { signup } from '@/lib/api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await signup(form);
      setSuccess(true);
      setForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,86,219,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
        <section className="glass grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl shadow-esi/10 lg:grid-cols-2">
          <div className="bg-esi p-8 text-white">
            <Image src="/logo-esilab-bleu.png" alt="EsiLab logo" width={128} height={128} priority className="rounded-xl bg-white/95 p-2" />
            <h1 className="mt-10 text-4xl font-extrabold leading-tight">
              Request dashboard access.
            </h1>
            <p className="mt-4 text-white/75">
              New accounts are created as employer accounts and stay pending until an admin accepts them.
            </p>
          </div>

          <div className="bg-white/85 p-8">
            <h2 className="text-2xl font-bold">Sign up</h2>
            <p className="mt-1 text-sm text-dim">Your request will appear in the admin pending box.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <Input label="Name" value={form.name} onChange={(event) => update('name', event.target.value)} required />
              <Input label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                hint="Use at least 8 characters."
                required
              />

              {error && <div className="rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">{error}</div>}
              {success && (
                <div className="rounded-xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">
                  <CheckCircle2 size={16} className="mr-2 inline" />
                  Request sent. Wait for admin approval, then sign in.
                </div>
              )}

              <Btn type="submit" variant="esi" className="w-full justify-center py-3" disabled={loading}>
                <UserPlus size={16} />
                {loading ? 'Sending request...' : 'Create request'}
              </Btn>
            </form>

            <p className="mt-6 text-center text-sm text-dim">
              Already approved?{' '}
              <Link href="/login" className="font-semibold text-esi hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
