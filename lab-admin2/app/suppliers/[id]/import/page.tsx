'use client';
// app/suppliers/[id]/import/page.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getSupplier, getMappings, importFile, getImportLogs } from '@/lib/api';
import { PageHeader, Card, Btn, Badge } from '@/components/ui';
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { useLanguage } from '@/components/i18n/LanguageProvider';

type ImportResult = {
  message: string;
  importLogId: string;
  inserted: number;
  updated: number;
  skipped: number;
  rowErrors: { row: number; error: string }[];
};

export default function ImportPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier]   = useState<any>(null);
  const [mappings, setMappings]   = useState<any[]>([]);
  const [logs,     setLogs]       = useState<any[]>([]);
  const [file,     setFile]       = useState<File | null>(null);
  const [preview,  setPreview]    = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [result,   setResult]     = useState<ImportResult | null>(null);
  const [error,    setError]      = useState('');

  useEffect(() => {
    Promise.all([getSupplier(id), getMappings(id), getImportLogs(id)]).then(([s, m, l]) => {
      setSupplier(s.data);
      setMappings(m.data.mappings || []);
      setLogs((l.data || []).slice(0, 10));
    });
  }, [id]);

  // Parse Excel preview client-side
  function parsePreview(f: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' }) as string[][];
        const headerRow = (supplier?.header_row_number || 1) - 1;
        const headers = data[headerRow] || [];
        const rows = data.slice(headerRow + 1, headerRow + 6); // first 5 data rows
        setPreview({ headers: headers as string[], rows: rows as string[][] });
      } catch { setPreview(null); }
    };
    reader.readAsArrayBuffer(f);
  }

  function handleFile(f: File) {
    if (!['.xlsx', '.xls'].some(ext => f.name.toLowerCase().endsWith(ext))) {
      setError(t.ui.clickBrowse); return;
    }
    setError(''); setResult(null);
    setFile(f);
    parsePreview(f);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [supplier]);

  async function handleImport() {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await importFile(id, file);
      if (res.error) { setError(res.error); }
      else { setResult(res); }
      // Refresh logs
      const l = await getImportLogs(id);
      setLogs((l.data || []).slice(0, 10));
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  const statusColor = (s: string) =>
    s === 'completed' ? 'green' : s === 'failed' ? 'red' : s === 'processing' ? 'amber' : 'default';
  const StatusIcon = ({ s }: { s: string }) =>
    s === 'completed' ? <CheckCircle size={13} className="text-green" /> :
    s === 'failed'    ? <XCircle     size={13} className="text-red"   /> :
    s === 'processing'? <Clock       size={13} className="text-amber" /> :
                        <AlertCircle size={13} className="text-dim"   />;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/suppliers" className="inline-flex items-center gap-1.5 text-dim text-sm hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> {t.ui.backToSuppliers}
      </Link>

      <PageHeader
        title={`${t.ui.import} - ${supplier?.name || '...'}`}
        subtitle={t.ui.uploadExcelSubtitle}
      />

      {/* Mapping summary */}
      {mappings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-dim font-mono mr-1">{t.ui.mappedFields}</span>
          {mappings.map((m: any) => (
            <Badge key={m.id} color="acid">
              {m.field_key} → col {m.source_column}
            </Badge>
          ))}
        </div>
      )}

      {mappings.length === 0 && (
        <div className="bg-amber/5 border border-amber/20 rounded-xl px-4 py-3 mb-6 text-amber text-sm flex items-center gap-2">
          <AlertCircle size={15} />
          {t.ui.noFieldMappings}{' '}
          <Link href={`/suppliers/${id}/mappings`} className="underline hover:no-underline">{t.ui.setupMappingsFirst} {'->'}</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drop zone */}
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${dragging ? 'border-acid bg-acid/5' : file ? 'border-green/40 bg-green/5' : 'border-border hover:border-esi/30'}
            `}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput" type="file" accept=".xlsx,.xls"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />

            {file ? (
              <div className="space-y-2">
                <FileSpreadsheet size={32} className="mx-auto text-green" />
                <p className="font-medium text-sm text-ink">{file.name}</p>
                <p className="text-xs text-dim">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  className="text-xs text-dim hover:text-red transition-colors"
                  onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}
                >
                  {t.ui.removeFile}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload size={32} className={`mx-auto ${dragging ? 'text-acid' : 'text-dim'}`} />
                <div>
                  <p className="font-medium text-sm">{dragging ? t.ui.dropIt : t.ui.dropExcel}</p>
                  <p className="text-xs text-dim mt-1">{t.ui.clickBrowse}</p>
                </div>
              </div>
            )}
          </div>

          {/* Import button */}
          <div className="mt-4">
            <Btn
              variant="acid"
              onClick={handleImport}
              disabled={!file || loading || mappings.length === 0}
              className="w-full justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  {t.ui.importing}
                </>
              ) : (
                <><Upload size={14} /> {file ? `${t.ui.import} ${file.name}` : t.ui.importFile}</>
              )}
            </Btn>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-4 bg-green/5 border border-green/20 rounded-xl p-4 animate-fadeUp">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={15} className="text-green" />
                <p className="font-semibold text-sm text-green">{t.ui.importCompleted}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: t.ui.inserted, val: result.inserted, color: 'text-green' },
                  { label: t.ui.updated, val: result.updated, color: 'text-blue' },
                  { label: t.ui.skipped, val: result.skipped, color: 'text-amber' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white/5 rounded-lg p-2">
                    <p className={`text-lg font-bold ${color}`}>{val}</p>
                    <p className="text-[10px] text-dim font-mono uppercase">{label}</p>
                  </div>
                ))}
              </div>
              {result.rowErrors.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-amber font-mono">{result.rowErrors.length} {t.ui.rowErrors}</p>
                  {result.rowErrors.slice(0, 5).map((e, i) => (
                    <p key={i} className="text-xs text-dim font-mono">Row {e.row}: {e.error}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red/5 border border-red/20 rounded-xl p-4 text-red text-sm animate-fadeUp flex items-start gap-2">
              <XCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Right side: Preview + History */}
        <div className="space-y-6">
          {/* Preview */}
          {preview && (
            <Card>
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.filePreview}</p>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="text-xs w-full">
                  <thead>
                    <tr>
                      {preview.headers.slice(0, 8).map((h, i) => (
                        <th key={i} className="text-left pr-3 pb-2 text-dim font-mono whitespace-nowrap">
                          {String.fromCharCode(65 + i)}: {String(h).slice(0, 12)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border/30">
                        {row.slice(0, 8).map((cell, j) => (
                          <td key={j} className="pr-3 py-1.5 text-ink/60 font-mono whitespace-nowrap max-w-[80px] truncate">
                            {String(cell).slice(0, 15)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Import history */}
          <Card>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-mono uppercase tracking-widest text-dim">{t.ui.importHistory}</p>
            </div>
            <div className="divide-y divide-border/40">
              {logs.length === 0 && (
                <p className="text-dim text-xs p-4">{t.ui.noSupplierImports}</p>
              )}
              {logs.map((log: any) => (
                <div key={log.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <StatusIcon s={log.status} />
                    <div className="min-w-0">
                      <p className="text-xs text-ink/80 font-mono truncate">{log.original_filename}</p>
                      <p className="text-[10px] text-dim mt-0.5">
                        +{log.rows_inserted} ↺{log.rows_updated} ↷{log.rows_skipped}
                      </p>
                      <p className="text-[10px] text-dim font-mono">
                        {new Date(log.created_at).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}
                      </p>
                    </div>
                  </div>
                  <Badge color={statusColor(log.status) as any}>{log.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
