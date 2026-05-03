'use client';
// app/suppliers/[id]/mappings/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMappings, replaceMappings, getSupplier } from '@/lib/api';
import { PageHeader, Btn, Card, Badge, Select } from '@/components/ui';
import { ArrowLeft, Save, Plus, Trash2, Info } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MappingsPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [supplier,   setSupplier]   = useState<any>(null);
  const [allFields,  setAllFields]  = useState<any[]>([]);
  const [mappings,   setMappings]   = useState<{ field_id: number; source_column: string }[]>([]);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    Promise.all([getSupplier(id), getMappings(id)]).then(([s, m]) => {
      setSupplier(s.data);
      setAllFields(m.data.allFields || []);
      setMappings(
        (m.data.mappings || []).map((mp: any) => ({
          field_id:      parseInt(mp.field_id),
          source_column: mp.source_column,
        }))
      );
    });
  }, [id]);

  function addRow() {
    setMappings(prev => [...prev, { field_id: 0, source_column: '' }]);
  }

  function removeRow(i: number) {
    setMappings(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, key: string, val: any) {
    setMappings(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  }

  async function handleSave() {
    setSaving(true); setError(''); setSuccess(false);
    try {
      const valid = mappings.filter(m => m.field_id > 0 && m.source_column.trim());
      await replaceMappings(id, valid);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  const usedFieldIds = new Set(mappings.map(m => m.field_id));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/suppliers" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToSuppliers}
      </Link>

      <PageHeader
        title={`${supplier?.name || '...'} - ${t.ui.fieldMappings}`}
        subtitle={t.ui.fieldMappingsSubtitle}
      >
        <Btn variant="acid" onClick={handleSave} disabled={saving}>
          <Save size={14} /> {saving ? t.ui.saving : t.ui.saveMappings}
        </Btn>
      </PageHeader>

      {/* Info box */}
      <div className="flex gap-3 bg-blue/5 border border-blue/20 rounded-xl px-4 py-3 mb-6">
        <Info size={15} className="text-blue mt-0.5 flex-shrink-0" />
        <p className="text-xs text-ink/70 leading-relaxed">
          {t.ui.fieldMappingsSubtitle}. {t.ui.headerRow}: <strong className="text-ink">{supplier?.header_row_number}</strong>.
        </p>
      </div>

      <Card>
        {/* Header row */}
        <div className="grid grid-cols-[1fr_120px_40px] gap-3 px-5 py-3 border-b border-border">
          <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.field}</p>
          <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.excelColumn}</p>
          <div />
        </div>

        <div className="divide-y divide-border/40">
          {mappings.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_40px] gap-3 px-5 py-3 items-center animate-fadeUp">
              <Select
                value={row.field_id}
                onChange={e => updateRow(i, 'field_id', parseInt(e.target.value))}
                className="py-2"
              >
                <option value={0}>{t.ui.selectAField}</option>
                {allFields.map((f: any) => (
                  <option
                    key={f.id}
                    value={f.id}
                    disabled={usedFieldIds.has(parseInt(f.id)) && parseInt(f.id) !== row.field_id}
                  >
                    {f.field_label} ({f.field_key})
                  </option>
                ))}
              </Select>

              <input
                value={row.source_column}
                onChange={e => updateRow(i, 'source_column', e.target.value.toUpperCase())}
                placeholder="A"
                maxLength={3}
                className="bg-white border border-border rounded-lg px-3 py-2 text-sm text-ink font-mono uppercase focus:outline-none focus:border-acid/40 transition-colors text-center"
              />

              <button
                onClick={() => removeRow(i)}
                className="w-8 h-8 flex items-center justify-center text-dim hover:text-red transition-colors rounded-lg hover:bg-red/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {mappings.length === 0 && (
            <div className="px-5 py-8 text-center text-dim text-sm">
              {t.ui.noMappings}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-acid text-sm hover:opacity-80 transition-opacity"
          >
            <Plus size={14} /> {t.ui.addFieldMapping}
          </button>
          <div className="flex items-center gap-3">
            {error   && <span className="text-red text-xs">{error}</span>}
            {success && <span className="text-green text-xs">{t.ui.saved}</span>}
            <Badge color="default">{mappings.filter(m => m.field_id > 0).length} {t.ui.mapped}</Badge>
          </div>
        </div>
      </Card>

      {/* Field reference */}
      <div className="mt-6">
        <p className="text-xs font-mono uppercase tracking-widest text-dim mb-3">{t.ui.availableFields}</p>
        <div className="grid grid-cols-2 gap-2">
          {allFields.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <div>
                <p className="text-xs font-medium text-ink/80">{f.field_label}</p>
                <p className="text-[10px] font-mono text-dim">{f.field_key}</p>
              </div>
              <Badge color={
                f.field_type === 'image_url' ? 'blue' :
                f.field_type === 'rich_text' ? 'amber' :
                f.field_type === 'url' ? 'acid' : 'default'
              }>{f.field_type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
