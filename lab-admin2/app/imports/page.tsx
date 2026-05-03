'use client';
// app/imports/page.tsx
import { useEffect, useState } from 'react';
import { getSuppliers, getImportLogs } from '@/lib/api';
import { PageHeader, Table, Th, Td, Badge, Spinner, Empty } from '@/components/ui';
import { ClipboardList, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function ImportsPage() {
  const { lang, t } = useLanguage();
  const [logs,      setLogs]      = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getSuppliers();
      const supList = s.data || [];
      setSuppliers(supList);
      const allLogs = await Promise.all(
        supList.map((sup: any) =>
          getImportLogs(sup.id)
            .then((r: any) => (r.data || []).map((l: any) => ({ ...l, supplierName: sup.name })))
            .catch(() => [])
        )
      );
      setLogs(allLogs.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
    }
    load();
  }, []);

  const statusColor = (s: string) =>
    s === 'completed' ? 'green' : s === 'failed' ? 'red' : s === 'processing' ? 'amber' : 'default';

  const StatusIcon = ({ s }: { s: string }) => {
    if (s === 'completed')  return <CheckCircle  size={14} className="text-green" />;
    if (s === 'failed')     return <XCircle      size={14} className="text-red"   />;
    if (s === 'processing') return <Clock        size={14} className="text-amber" />;
    return <AlertCircle size={14} className="text-dim" />;
  };

  // Summary stats
  const total      = logs.length;
  const completed  = logs.filter(l => l.status === 'completed').length;
  const failed     = logs.filter(l => l.status === 'failed').length;
  const totalInserted = logs.reduce((sum, l) => sum + (l.rows_inserted || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title={t.ui.importLogs} subtitle={t.ui.importLogsSubtitle} />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: t.dashboard.totalImports, value: total, color: '' },
          { label: t.ui.completed, value: completed, color: 'text-green' },
          { label: t.ui.failed, value: failed, color: failed > 0 ? 'text-red' : 'text-dim' },
          { label: t.ui.totalInserted, value: totalInserted.toLocaleString(), color: 'text-acid' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl px-4 py-4 animate-fadeUp">
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : logs.length === 0 ? (
        <Empty message={t.ui.noImportLogs} icon={<ClipboardList size={48} />} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>{t.ui.supplier}</Th>
              <Th>{t.ui.file}</Th>
              <Th>{t.ui.status}</Th>
              <Th>{t.ui.inserted}</Th>
              <Th>{t.ui.updated}</Th>
              <Th>{t.ui.skipped}</Th>
              <Th>{t.ui.errors}</Th>
              <Th>{t.ui.date}</Th>
              <Th>{t.ui.duration}</Th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => {
              const duration = log.started_at && log.completed_at
                ? ((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000).toFixed(1) + 's'
                : '—';
              const errors = typeof log.errors === 'string' ? JSON.parse(log.errors) : (log.errors || []);

              return (
                <tr key={log.id} className="hover:bg-esi/5 transition-colors animate-fadeUp"
                    style={{ animationDelay: `${i * 0.02}s`, opacity: 0 }}>
                  <Td><span className="font-mono text-xs text-dim">#{log.id}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-acid/10 border border-acid/20 flex items-center justify-center text-acid font-bold text-[10px]">
                        {log.supplierName?.[0]}
                      </div>
                      <span className="text-xs">{log.supplierName}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="font-mono text-xs text-dim max-w-[180px] truncate block" title={log.original_filename}>
                      {log.original_filename}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon s={log.status} />
                      <Badge color={statusColor(log.status) as any}>{log.status}</Badge>
                    </div>
                  </Td>
                  <Td><span className="text-green font-mono text-xs">+{log.rows_inserted ?? 0}</span></Td>
                  <Td><span className="text-blue font-mono text-xs">↺{log.rows_updated ?? 0}</span></Td>
                  <Td><span className="text-amber font-mono text-xs">↷{log.rows_skipped ?? 0}</span></Td>
                  <Td>
                    {errors.length > 0 ? (
                      <span className="text-red font-mono text-xs" title={JSON.stringify(errors.slice(0, 3))}>
                        {errors.length} {t.ui.errors}
                      </span>
                    ) : (
                      <span className="text-dim text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    <span className="text-xs text-dim font-mono whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}
                    </span>
                  </Td>
                  <Td><span className="text-xs font-mono text-dim">{duration}</span></Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
