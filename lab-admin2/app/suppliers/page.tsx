'use client';
// app/suppliers/page.tsx
import { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier } from '@/lib/api';
import { PageHeader, Table, Th, Td, Badge, Btn, Spinner, Empty } from '@/components/ui';
import { Building2, Plus, Trash2, Settings, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function SuppliersPage() {
  const { lang, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await getSuppliers();
    setSuppliers(res.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${t.ui.delete} "${name}"?`)) return;
    await deleteSupplier(id);
    load();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title={t.ui.suppliers} subtitle={t.ui.supplierSubtitle}>
        <Link href="/suppliers/new">
          <Btn variant="acid"><Plus size={14} /> {t.ui.addSupplier}</Btn>
        </Link>
      </PageHeader>

      {loading ? <Spinner /> : suppliers.length === 0 ? (
        <Empty message={t.ui.noSuppliers} icon={<Building2 size={48} />} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>{t.ui.supplier}</Th>
              <Th>Slug</Th>
              <Th>{t.ui.headerRow}</Th>
              <Th>{t.ui.contact}</Th>
              <Th>{t.ui.status}</Th>
              <Th>{t.ui.created}</Th>
              <Th className="text-right">{t.ui.actions}</Th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s.id} className={`hover:bg-esi/5 transition-colors animate-fadeUp`}
                  style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-acid/10 border border-acid/20 flex items-center justify-center text-acid font-bold text-xs">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      {s.notes && <p className="text-xs text-dim truncate max-w-[160px]">{s.notes}</p>}
                    </div>
                  </div>
                </Td>
                <Td><span className="font-mono text-xs text-dim">{s.slug}</span></Td>
                <Td><span className="font-mono text-xs">{s.header_row_number}</span></Td>
                <Td><span className="text-xs text-dim">{s.contact_email || '—'}</span></Td>
                <Td><Badge color={s.is_active ? 'green' : 'red'}>{s.is_active ? t.ui.active : t.ui.inactive}</Badge></Td>
                <Td><span className="text-xs text-dim font-mono">{new Date(s.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : undefined)}</span></Td>
                <Td>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/suppliers/${s.id}/import`}>
                      <Btn size="sm" variant="ghost"><Upload size={13} /> {t.ui.import}</Btn>
                    </Link>
                    <Link href={`/suppliers/${s.id}/mappings`}>
                      <Btn size="sm" variant="ghost"><Settings size={13} /> {t.ui.mappings}</Btn>
                    </Link>
                    <Link href={`/suppliers/${s.id}`}>
                      <Btn size="sm">{t.ui.edit}</Btn>
                    </Link>
                    <Btn size="sm" variant="danger" onClick={() => handleDelete(s.id, s.name)}>
                      <Trash2 size={13} />
                    </Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
