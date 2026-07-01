'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, getProductFields, toggleProduct, deleteProduct } from '@/lib/api';
import { PageHeader, Card, Btn, Badge, Select } from '@/components/ui';
import { ArrowLeft, Eye, EyeOff, Trash2, Package, ExternalLink, Save, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function ProductDetailPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [fields,  setFields]  = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [rows,    setRows]    = useState<{ key: string; value: string }[]>([]);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  async function load() {
    const [p, f] = await Promise.all([getProduct(id), getProductFields()]);
    setProduct(p.data);
    setFields(f.data || []);
    setRows(Object.entries(p.data.data || {}).map(([key, value]) => ({ key, value: String(value) })));
  }

  useEffect(() => { load(); }, [id]);

  async function handleToggle() { await toggleProduct(id); load(); }
  async function handleDelete() {
    if (!confirm(`${t.ui.delete} ${t.ui.product}?`)) return;
    await deleteProduct(id); router.push('/products');
  }

  async function handleSave() {
    setSaving(true); setError(''); setSuccess(false);
    const data: Record<string, string> = {};
    for (const row of rows) {
      if (row.key.trim() && row.value.trim()) data[row.key.trim()] = row.value.trim();
    }
    try {
      const res = await fetch(`/api/admin/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSuccess(true);
      setEditing(false);
      load();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  function addRow() { setRows(r => [...r, { key: '', value: '' }]); }
  function removeRow(i: number) { setRows(r => r.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, k: 'key' | 'value', v: string) {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  }

  if (!product) return <div className="p-8 text-dim text-sm">{t.ui.loading}</div>;

  const data = product.data || {};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToProducts}
      </Link>

      <PageHeader title={data.name || t.ui.product} subtitle={`SKU: ${data.sku || '-'} - ID: ${product.id}`}>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Btn size="sm" variant="ghost" onClick={() => { setEditing(false); setError(''); }}>{t.ui.cancel}</Btn>
              <Btn size="sm" variant="esi" onClick={handleSave} disabled={saving}>
                <Save size={13} /> {saving ? t.ui.saving : t.ui.saveChanges}
              </Btn>
            </>
          ) : (
            <>
              <Btn size="sm" variant="ghost" onClick={() => setEditing(true)}>{t.ui.editFields}</Btn>
              <Btn size="sm" variant="ghost" onClick={handleToggle}>
                {product.is_active ? <><EyeOff size={13} /> {t.ui.hide}</> : <><Eye size={13} /> {t.ui.show}</>}
              </Btn>
              <Btn size="sm" variant="danger" onClick={handleDelete}>
                <Trash2 size={13} /> {t.ui.delete}
              </Btn>
            </>
          )}
        </div>
      </PageHeader>

      {success && (
        <div className="mb-5 bg-green/5 border border-green/20 rounded-xl px-4 py-3 text-green text-sm animate-fadeUp">
          {t.ui.savedSuccessfully}
        </div>
      )}
      {error && (
        <div className="mb-5 bg-red/5 border border-red/20 rounded-xl px-4 py-3 text-red text-sm animate-fadeUp">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: image + meta */}
        <div className="space-y-4">
          {data.image_url ? (
            <Card className="p-4">
              <img src={data.image_url} alt={data.name}
                className="w-full object-contain rounded-lg max-h-48"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </Card>
          ) : (
            <Card className="p-8 flex items-center justify-center">
              <Package size={48} className="text-dim" />
            </Card>
          )}
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.status}</p>
              <div className="mt-1"><Badge color={product.is_active ? 'green' : 'red'}>{product.is_active ? t.ui.active : t.ui.hidden}</Badge></div>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.supplier}</p>
              <p className="text-sm mt-1 font-mono">#{product.supplier_id}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.slug}</p>
              <p className="text-xs mt-1 font-mono text-dim break-all">{product.slug}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.added}</p>
              <p className="text-xs mt-1 font-mono text-dim">{new Date(product.created_at).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.updated}</p>
              <p className="text-xs mt-1 font-mono text-dim">{new Date(product.updated_at).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}</p>
            </div>
          </Card>
        </div>

        {/* Right: fields */}
        <div className="lg:col-span-2">
          {editing ? (
            <Card>
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.editFields}</p>
                <Badge color="esi">{rows.length} {t.ui.fields}</Badge>
              </div>
              <div className="divide-y divide-border/40">
                {rows.map((row, i) => (
                  <div key={i} className="px-5 py-3 grid grid-cols-[1fr_1.5fr_32px] gap-3 items-start">
                    <Select
                      value={row.key}
                      onChange={e => updateRow(i, 'key', e.target.value)}
                      className="py-2"
                    >
                      <option value="">{t.ui.selectField}</option>
                      {fields.map((f: any) => (
                        <option key={f.field_key} value={f.field_key}>
                          {f.field_label}
                        </option>
                      ))}
                    </Select>
                    <input
                      value={row.value}
                      onChange={e => updateRow(i, 'value', e.target.value)}
                      placeholder={t.ui.value}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50"
                    />
                    <button type="button" onClick={() => removeRow(i)}
                      className="w-8 h-8 mt-0.5 flex items-center justify-center text-dim hover:text-red transition-colors rounded-lg hover:bg-red/10">
                      <Trash size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-border">
                <button onClick={addRow} className="flex items-center gap-2 text-esi text-sm hover:opacity-80 transition-opacity">
                  <Plus size={14} /> {t.ui.addField}
                </button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="px-5 py-4 border-b border-border">
                <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.productData} ({Object.keys(data).length} {t.ui.fields})</p>
              </div>
              <div className="divide-y divide-border/40">
                {Object.entries(data).map(([key, value]) => {
                  const strVal = String(value);
                  const isUrl  = strVal.startsWith('http');
                  const isLong = strVal.length > 150;
                  return (
                    <div key={key} className="px-5 py-3.5">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-dim mb-1">{key}</p>
                      {isUrl ? (
                        <a href={strVal} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-esi hover:underline flex items-center gap-1 break-all">
                          {strVal.slice(0, 80)}{strVal.length > 80 && '…'}<ExternalLink size={10} />
                        </a>
                      ) : isLong ? (
                        <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{strVal}</p>
                      ) : (
                        <p className="text-sm text-ink/80 font-mono">{strVal}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
