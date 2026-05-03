'use client';
// app/suppliers/new/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupplier } from '@/lib/api';
import { PageHeader, Input, Btn, Card } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function NewSupplierPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', contact_email: '', contact_phone: '', notes: '', header_row_number: 1, is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await createSupplier(form);
      router.push(`/suppliers/${res.data.id}/mappings`);
    } catch (err: any) {
      setError(err.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/suppliers" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToSuppliers}
      </Link>

      <PageHeader title={t.ui.addSupplier} subtitle={t.ui.newSupplierSubtitle} />

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-5">
          <Input label={t.ui.supplierName} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Eppendorf" required />
          <Input label={t.ui.contactEmail} type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="info@supplier.com" />
          <Input label={t.ui.contactPhone} value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="+1 234 567 890" />

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.headerRowNumberReq}</label>
            <input
              type="number" min={1} max={20}
              value={form.header_row_number}
              onChange={e => set('header_row_number', parseInt(e.target.value))}
              className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-acid/40 transition-colors"
            />
            <p className="text-xs text-dim">{t.ui.headerRowHint}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.notes}</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder={t.ui.notes}
              className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-acid/40 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 accent-[#c8ff00]" />
            <label htmlFor="active" className="text-sm text-dim">{t.ui.activeCatalog}</label>
          </div>

          {error && (
            <div className="bg-red/10 border border-red/20 rounded-lg px-4 py-3 text-red text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/suppliers"><Btn variant="ghost">{t.ui.cancel}</Btn></Link>
            <Btn type="submit" variant="acid" disabled={saving}>
              <Save size={14} /> {saving ? t.ui.saving : t.ui.saveConfigureMappings}
            </Btn>
          </div>
        </Card>
      </form>
    </div>
  );
}
