'use client';
// app/import/page.tsx — Quick import from any supplier
import { useEffect, useState } from 'react';
import { getSuppliers } from '@/lib/api';
import { PageHeader } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function ImportPage() {
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => { getSuppliers().then(r => setSuppliers(r.data || [])); }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PageHeader title={t.ui.importProducts} subtitle={t.ui.importProductsSubtitle} />

      <div className="space-y-3">
        {suppliers.map((s, i) => (
          <button
            key={s.id}
            onClick={() => router.push(`/suppliers/${s.id}/import`)}
            className="w-full flex items-center justify-between gap-4 bg-card border border-border rounded-xl px-5 py-4 hover:border-acid/30 hover:bg-acid/5 transition-all group animate-fadeUp card-hover"
            style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-acid/10 border border-acid/20 flex items-center justify-center text-acid font-bold text-sm">
                {s.name[0]}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-xs text-dim font-mono mt-0.5">
                  {t.ui.headerRow}: {s.header_row_number} - {s.is_active ? t.ui.active : t.ui.inactive}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-dim group-hover:text-acid transition-colors" />
          </button>
        ))}

        {suppliers.length === 0 && (
          <div className="text-center py-16 text-dim text-sm">
            <Building2 size={40} className="mx-auto mb-3 opacity-20" />
            {t.ui.noSuppliersConfigured}
          </div>
        )}
      </div>
    </div>
  );
}
