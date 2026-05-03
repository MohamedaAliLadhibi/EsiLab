'use client';
// app/products/new/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSuppliers, getProductFields } from '@/lib/api';
import { PageHeader, Card, Btn, Select } from '@/components/ui';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const BASE = process.env.NEXT_PUBLIC_ADMIN_API || 'http://localhost:3001';
const KEY  = process.env.NEXT_PUBLIC_ADMIN_KEY  || '';

export default function NewProductPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [fields,    setFields]    = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Dynamic field rows: [{ field_key, value }]
  const [rows, setRows] = useState<{ key: string; value: string }[]>([
    { key: 'sku',  value: '' },
    { key: 'name', value: '' },
  ]);

  useEffect(() => {
    Promise.all([getSuppliers(), getProductFields()]).then(([s, f]) => {
      setSuppliers(s.data || []);
      setFields(f.data || []);
      if (s.data?.[0]) setSupplierId(String(s.data[0].id));
    });
  }, []);

  function addRow() { setRows(r => [...r, { key: '', value: '' }]); }
  function removeRow(i: number) { setRows(r => r.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, k: 'key' | 'value', v: string) {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) { setError(t.ui.selectSupplier); return; }

    // Build data object from rows
    const data: Record<string, string> = {};
    for (const row of rows) {
      if (row.key.trim() && row.value.trim()) {
        data[row.key.trim()] = row.value.trim();
      }
    }
    if (!data.sku)  { setError('SKU is required'); return; }
    if (!data.name) { setError('Product name is required'); return; }

    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/admin/products/manual`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_id: parseInt(supplierId), data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create product');
      router.push(`/products/${json.data.id}`);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  const usedKeys = new Set(rows.map(r => r.key));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToProducts}
      </Link>
      <PageHeader title={t.ui.addProduct} subtitle={t.ui.productSubtitle} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Supplier select */}
        <Card className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Select
              label={`${t.ui.supplier} *`}
              value={supplierId}
              onChange={e => setSupplierId(e.target.value)}
              required
            >
              <option value="">{t.ui.selectSupplier}</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        {/* Dynamic field rows */}
        <Card>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t.ui.productFields}</p>
              <p className="text-xs text-dim mt-0.5">{t.ui.productFieldsHint}</p>
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {rows.map((row, i) => (
              <div key={i} className="px-5 py-3 grid grid-cols-[1fr_1.5fr_32px] gap-3 items-start animate-fadeUp">
                {/* Field key selector */}
                <Select
                  value={row.key}
                  onChange={e => updateRow(i, 'key', e.target.value)}
                  className="py-2"
                >
                  <option value="">{t.ui.selectField}</option>
                  {fields.map((f: any) => (
                    <option
                      key={f.field_key} value={f.field_key}
                      disabled={usedKeys.has(f.field_key) && f.field_key !== row.key}
                    >
                      {f.field_label}
                    </option>
                  ))}
                  {/* Allow custom keys not in master list */}
                  <option value="_custom">-- {t.ui.customKey} --</option>
                </Select>

                {/* Value input — textarea for long fields */}
                {row.key === '_custom' ? (
                  <input
                    placeholder="custom_key_name"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50 font-mono"
                    onChange={e => updateRow(i, 'key', e.target.value)}
                  />
                ) : fields.find(f => f.field_key === row.key)?.field_type === 'rich_text' ||
                   fields.find(f => f.field_key === row.key)?.field_type === 'textarea' ? (
                  <textarea
                    value={row.value}
                    onChange={e => updateRow(i, 'value', e.target.value)}
                    rows={2}
                    placeholder={t.ui.value}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50 resize-none"
                  />
                ) : (
                  <input
                    value={row.value}
                    onChange={e => updateRow(i, 'value', e.target.value)}
                    placeholder={row.key === 'image_url' ? 'https://...' : t.ui.value}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50"
                  />
                )}

                <button type="button" onClick={() => removeRow(i)}
                  className="w-8 h-8 mt-0.5 flex items-center justify-center text-dim hover:text-red transition-colors rounded-lg hover:bg-red/10">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-border">
            <button type="button" onClick={addRow}
              className="flex items-center gap-2 text-esi text-sm hover:opacity-80 transition-opacity">
              <Plus size={14} /> {t.ui.addField}
            </button>
          </div>
        </Card>

        {error && (
          <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 text-red text-sm">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/products"><Btn variant="ghost">{t.ui.cancel}</Btn></Link>
          <Btn type="submit" variant="esi" disabled={saving}>
            <Save size={14} /> {saving ? t.ui.saving : t.ui.createProduct}
          </Btn>
        </div>
      </form>
    </div>
  );
}
