'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Btn, Input, Card } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      router.replace('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 space-y-5">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-dim">Admin Login</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">Sign in to the dashboard</h1>
          <p className="mt-2 text-sm text-dim">Use the admin account you created in the backend.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">{error}</div>}
          <Btn type="submit" variant="esi" className="w-full justify-center" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Btn>
        </form>
      </Card>
    </div>
  );
}
