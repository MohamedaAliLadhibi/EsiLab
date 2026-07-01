'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createUser, deleteUser, getCurrentAdmin, getUsers } from '@/lib/api';
import { Badge, Btn, Card, Empty, Input, PageHeader, Spinner, Table, Td, Th } from '@/components/ui';
import { Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
};

export default function UsersPage() {
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  async function load() {
    setLoading(true);
    try {
      const [usersRes, meRes] = await Promise.all([getUsers(), getCurrentAdmin()]);
      setUsers(usersRes.data || []);
      setCurrentAdmin(meRes.data || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(key: 'name' | 'email' | 'password', value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await createUser(form);
      setForm({ name: '', email: '', password: '' });
      setSuccess(t.ui.accountCreated);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`${t.ui.delete} "${user.email}"?`)) return;
    setError('');
    setSuccess('');

    try {
      await deleteUser(String(user.id));
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const locale = lang === 'fr' ? 'fr-FR' : undefined;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title={t.ui.users} subtitle={t.ui.usersSubtitle}>
        <Link href="/users">
          <Btn variant="acid"><Plus size={14} /> {t.ui.addUser}</Btn>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        <Card className="p-5 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-acid/10 border border-acid/20 flex items-center justify-center text-acid">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm text-ink">{t.ui.addUser}</p>
              <p className="text-xs text-dim">{t.ui.usersSubtitle}</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label={t.ui.user}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Admin Name"
              required
            />
            <Input
              label={t.ui.contactEmail}
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="admin@example.com"
              required
            />
            <Input
              label={t.ui.password}
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="********"
              hint={t.ui.passwordHint}
              required
            />

            {error && (
              <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 text-red text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green/5 border border-green/20 rounded-xl px-4 py-3 text-green text-sm">
                {success}
              </div>
            )}

            <Btn type="submit" variant="esi" disabled={saving} className="w-full justify-center">
              <UserPlus size={14} /> {saving ? t.ui.saving : t.ui.addUser}
            </Btn>
          </form>
        </Card>

        {loading ? <Spinner /> : users.length === 0 ? (
          <Empty message={t.ui.noUsers} icon={<Users size={48} />} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>{t.ui.user}</Th>
                <Th>{t.ui.contactEmail}</Th>
                <Th>{t.ui.userRole}</Th>
                <Th>{t.ui.status}</Th>
                <Th>{t.ui.lastLogin}</Th>
                <Th>{t.ui.created}</Th>
                <Th className="text-right">{t.ui.actions}</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const isCurrentUser = String(currentAdmin?.sub) === String(user.id);
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-esi/5 transition-colors animate-fadeUp"
                    style={{ animationDelay: `${index * 0.03}s`, opacity: 0 }}
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-acid/10 border border-acid/20 flex items-center justify-center text-acid font-bold text-xs">
                          {user.name?.[0] || 'A'}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{user.name}</p>
                          {isCurrentUser && (
                            <p className="text-xs text-dim">{t.ui.you}</p>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td><span className="text-xs text-dim">{user.email}</span></Td>
                    <Td><Badge color="blue">{user.role}</Badge></Td>
                    <Td>
                      <Badge color={user.is_active ? 'green' : 'red'}>
                        {user.is_active ? t.ui.active : t.ui.inactive}
                      </Badge>
                    </Td>
                    <Td>
                      <span className="text-xs text-dim font-mono">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString(locale) : '-'}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs text-dim font-mono">
                        {new Date(user.created_at).toLocaleDateString(locale)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-2">
                        <Btn
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(user)}
                          disabled={isCurrentUser || users.length <= 1}
                          title={isCurrentUser ? t.ui.selfProtected : users.length <= 1 ? t.ui.lastUserProtected : t.ui.delete}
                        >
                          <Trash2 size={13} />
                        </Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
