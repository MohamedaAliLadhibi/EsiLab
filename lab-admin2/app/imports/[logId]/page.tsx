'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, FileSpreadsheet, XCircle } from 'lucide-react';
import { getImportLog, getSupplier } from '@/lib/api';
import { Badge, Card, PageHeader, Spinner } from '@/components/ui';
import { useLanguage } from '@/components/i18n/LanguageProvider';

type RowIssue = {
  row?: number;
  sku?: string;
  error: string;
};

function parseRowIssues(raw: unknown): RowIssue[] {
  if (Array.isArray(raw)) return raw as RowIssue[];
  if (typeof raw !== 'string' || !raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as RowIssue[] : [];
  } catch {
    return [];
  }
}

export default function ImportLogDetailPage() {
  const { logId } = useParams<{ logId: string }>();
  const { lang, t } = useLanguage();
  const [log, setLog] = useState<any>(null);
  const [supplierName, setSupplierName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const logRes = await getImportLog(logId);
        const logData = logRes.data;
        setLog(logData);

        if (logData?.supplier_id) {
          const supplierRes = await getSupplier(String(logData.supplier_id));
          setSupplierName(supplierRes.data?.name || '');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load import log');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [logId]);

  if (loading) return <Spinner />;

  if (error || !log) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Link href="/imports" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
          <ArrowLeft size={14} /> {t.ui.backToImportLogs}
        </Link>
        <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 text-red text-sm">
          {error || 'Import log not found'}
        </div>
      </div>
    );
  }

  const parsedErrors = parseRowIssues(log.errors);

  const statusColor = (status: string) =>
    status === 'completed' ? 'green' : status === 'failed' ? 'red' : status === 'processing' ? 'amber' : 'default';

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle size={16} className="text-green" />;
    if (status === 'failed') return <XCircle size={16} className="text-red" />;
    if (status === 'processing') return <Clock size={16} className="text-amber" />;
    return <AlertCircle size={16} className="text-dim" />;
  };

  const locale = lang === 'fr' ? 'fr-FR' : undefined;
  const duration = log.started_at && log.completed_at
    ? `${((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000).toFixed(1)}s`
    : '-';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/imports" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToImportLogs}
      </Link>

      <PageHeader
        title={`${t.ui.importLogDetail} #${log.id}`}
        subtitle={t.ui.importLogDetailSubtitle}
      >
        <div className="flex items-center gap-2">
          {statusIcon(log.status)}
          <Badge color={statusColor(log.status) as any}>{log.status}</Badge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: t.ui.supplier, value: supplierName || t.ui.unknownSupplier, icon: <FileSpreadsheet size={16} /> },
          { label: t.ui.inserted, value: log.rows_inserted ?? 0, icon: <CheckCircle size={16} /> },
          { label: t.ui.updated, value: log.rows_updated ?? 0, icon: <Clock size={16} /> },
          { label: t.ui.skipped, value: log.rows_skipped ?? 0, icon: <AlertCircle size={16} /> },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{label}</p>
              <div className="text-dim/60">{icon}</div>
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.importSummary}</p>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.originalFile}</p>
            <p className="text-sm text-ink/80 mt-1 break-all">{log.original_filename}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.processedRows}</p>
            <p className="text-sm text-ink/80 mt-1 font-mono">{log.rows_processed ?? 0}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.startedAt}</p>
            <p className="text-sm text-ink/80 mt-1 font-mono">
              {log.started_at ? new Date(log.started_at).toLocaleString(locale) : '-'}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.completedAt}</p>
            <p className="text-sm text-ink/80 mt-1 font-mono">
              {log.completed_at ? new Date(log.completed_at).toLocaleString(locale) : '-'}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.duration}</p>
            <p className="text-sm text-ink/80 mt-1 font-mono">{duration}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-dim">{t.ui.date}</p>
            <p className="text-sm text-ink/80 mt-1 font-mono">{new Date(log.created_at).toLocaleString(locale)}</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-xs font-mono uppercase tracking-widest text-dim">
              {t.ui.rowIssues} ({parsedErrors.length})
            </p>
          </div>

          {parsedErrors.length === 0 ? (
            <div className="p-5 text-sm text-dim">{t.ui.noRowIssues}</div>
          ) : (
            <div className="divide-y divide-border/40">
              {parsedErrors.map((entry, index) => (
                <div key={`${entry.row ?? 'na'}-${index}`} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-dim">
                        {entry.row ? `Row ${entry.row}` : 'General'}
                        {entry.sku ? ` - SKU ${entry.sku}` : ''}
                      </p>
                      <p className="text-sm text-ink/80 mt-1 whitespace-pre-wrap">{entry.error}</p>
                    </div>
                    <AlertCircle size={15} className="text-amber flex-shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
