'use client';
// app/suppliers/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupplier, updateSupplier } from '@/lib/api';
import { PageHeader, Input, Btn, Card, Badge } from '@/components/ui';
import { ArrowLeft, Save, Settings, Upload, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function EditSupplierPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [form,    setForm]    = useState<any>(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSupplier(id).then(r => setForm(r.data));
  }, [id]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    try {
      await updateSupplier(id, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  if (!form) return <div className="p-8 text-dim text-sm">{t.ui.loading}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/suppliers" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToSuppliers}
      </Link>

      <PageHeader title={form.name} subtitle={t.ui.editSupplierDetails}>
        <div className="flex gap-2">
          <Link href={`/suppliers/${id}/mappings`}><Btn size="sm"><Settings size={13} /> {t.ui.mappings}</Btn></Link>
          <Link href={`/suppliers/${id}/import`}><Btn size="sm" variant="acid"><Upload size={13} /> {t.ui.import}</Btn></Link>
        </div>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-5">
          <Input label={t.ui.supplierName} value={form.name || ''} onChange={e => set('name', e.target.value)} required />
          <Input label={t.ui.contactEmail} type="email" value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)} />
          <Input label={t.ui.contactPhone} value={form.contact_phone || ''} onChange={e => set('contact_phone', e.target.value)} />

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.headerRowNumber}</label>
            <input type="number" min={1} max={20} value={form.header_row_number || 1}
              onChange={e => set('header_row_number', parseInt(e.target.value))}
              className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-acid/40 transition-colors" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.notes}</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-acid/40 transition-colors resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 accent-[#c8ff00]" />
            <label htmlFor="active" className="text-sm text-dim">{t.ui.active}</label>
          </div>

          {error   && <div className="bg-red/10 border border-red/20 rounded-lg px-4 py-3 text-red text-sm">{error}</div>}
          {success && <div className="bg-green/10 border border-green/20 rounded-lg px-4 py-3 text-green text-sm">{t.ui.savedSuccessfully}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/suppliers"><Btn variant="ghost">{t.ui.cancel}</Btn></Link>
            <Btn type="submit" variant="acid" disabled={saving}>
              <Save size={14} /> {saving ? t.ui.saving : t.ui.saveChanges}
            </Btn>
          </div>
        </Card>
      </form>
    </div>
  );
}
