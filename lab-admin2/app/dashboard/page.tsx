'use client';
// app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/lib/api';
import { StatCard, PageHeader, Card, Spinner, Badge } from '@/components/ui';
import { Package, Building2, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function Dashboard() {
  const { lang, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [logs,      setLogs]      = useState<any[]>([]);
  const [totals,    setTotals]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const summary = await getDashboardSummary();
        setSuppliers(summary.data?.suppliers || []);
        setLogs(summary.data?.recentImports || []);
        setTotals(summary.data?.totals || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8"><Spinner /></div>;

  const totalProducts  = totals?.products || 0;
  const activeSuppliers = totals?.activeSuppliers ?? suppliers.filter((s) => s.is_active).length;
  const totalImports   = totals?.imports || 0;
  const failedImports  = totals?.failedImports || 0;

  // Recent imports (last 5)
  const recentLogs = logs.slice(0, 5);

  const statusColor = (s: string) =>
    s === 'completed' ? 'green' : s === 'failed' ? 'red' : s === 'processing' ? 'amber' : 'default';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title={t.dashboard.title}
        subtitle={`${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stagger-1 animate-fadeUp">
          <StatCard label={t.dashboard.totalProducts} value={totalProducts.toLocaleString()} accent="acid" icon={<Package size={18} />} sub={t.dashboard.totalProductsSub} />
        </div>
        <div className="stagger-2 animate-fadeUp">
          <StatCard label={t.dashboard.activeSuppliers} value={activeSuppliers} accent="blue" icon={<Building2 size={18} />} sub={t.dashboard.activeSuppliersSub(suppliers.length)} />
        </div>
        <div className="stagger-3 animate-fadeUp">
          <StatCard label={t.dashboard.totalImports} value={totalImports} accent="green" icon={<Upload size={18} />} sub={t.dashboard.totalImportsSub} />
        </div>
        <div className="stagger-4 animate-fadeUp">
          <StatCard label={t.dashboard.failedImports} value={failedImports} accent={failedImports > 0 ? 'amber' : 'green'} icon={<AlertCircle size={18} />} sub={t.dashboard.failedImportsSub} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Suppliers overview */}
        <div className="lg:col-span-2 stagger-5 animate-fadeUp">
          <Card>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm">{t.dashboard.suppliers}</h2>
              <Link href="/suppliers" className="text-xs text-acid hover:underline">{t.dashboard.viewAll} {'->'}</Link>
            </div>
            <div className="divide-y divide-border/50">
              {suppliers.length === 0 && (
                <p className="text-dim text-sm p-5">{t.dashboard.noSuppliers}</p>
              )}
              {suppliers.map((s) => (
                <Link
                  key={s.id}
                  href={`/suppliers/${s.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-esi/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-acid/10 border border-acid/20 flex items-center justify-center text-acid font-bold text-xs">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-dim font-mono">{t.dashboard.headerRow}: {s.header_row_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color={s.is_active ? 'green' : 'red'}>
                      {s.is_active ? t.dashboard.active : t.dashboard.inactive}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-border">
              <Link href="/suppliers/new">
                <span className="text-xs text-acid hover:underline">+ {t.dashboard.addNewSupplier}</span>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent imports */}
        <div className="stagger-6 animate-fadeUp">
          <Card className="h-full">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm">{t.dashboard.recentImports}</h2>
              <Link href="/imports" className="text-xs text-acid hover:underline">{t.dashboard.allLogs} {'->'}</Link>
            </div>
            <div className="divide-y divide-border/50">
              {recentLogs.length === 0 && (
                <p className="text-dim text-sm p-5">{t.dashboard.noImports}</p>
              )}
              {recentLogs.map((log) => (
                <div key={log.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-ink/80 truncate font-mono">{log.original_filename}</p>
                    <Badge color={statusColor(log.status) as any}>{log.status}</Badge>
                  </div>
                  <div className="flex gap-3 mt-1.5 text-xs text-dim font-mono">
                    <span>+{log.rows_inserted ?? 0}</span>
                    <span>↺{log.rows_updated ?? 0}</span>
                    <span>↷{log.rows_skipped ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-3 gap-4 stagger-6 animate-fadeUp">
        {[
          { label: t.dashboard.importExcel, desc: t.dashboard.importExcelDesc, href: '/import', icon: Upload, accent: 'acid' },
          { label: t.dashboard.browseProducts, desc: t.dashboard.browseProductsDesc(totalProducts.toLocaleString()), href: '/products', icon: Package, accent: 'blue' },
          { label: t.dashboard.manageSuppliers, desc: t.dashboard.manageSuppliersDesc(suppliers.length), href: '/suppliers', icon: Building2, accent: 'green' },
        ].map(({ label, desc, href, icon: Icon, accent }) => (
          <Link key={href} href={href}>
            <div className="glass rounded-xl p-5 card-hover border border-border cursor-pointer h-full">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                accent === 'acid' ? 'bg-acid/10 text-acid' :
                accent === 'blue' ? 'bg-blue/10 text-blue' : 'bg-green/10 text-green'
              }`}>
                <Icon size={16} />
              </div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-dim mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
