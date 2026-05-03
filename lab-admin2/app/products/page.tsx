'use client';
import { useEffect, useState, useCallback } from 'react';
import { getProducts, getSuppliers, toggleProduct, deleteProduct } from '@/lib/api';
import { PageHeader, Table, Th, Td, Badge, Btn, Spinner, Empty, Select } from '@/components/ui';
import { Package, Search, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useLanguage } from '@/components/i18n/LanguageProvider';

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products,   setProducts]   = useState<any[]>([]);
  const [meta,       setMeta]       = useState<any>(null);
  const [suppliers,  setSuppliers]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [suppFilter, setSuppFilter] = useState('');
  const [page,       setPage]       = useState(1);
  const LIMIT = 25;
  const debouncedSearch = useDebouncedValue(search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(LIMIT) };
      if (debouncedSearch) params.search = debouncedSearch;
      if (suppFilter) params.supplier_id = suppFilter;
      const res = await getProducts(params);
      setProducts(res.data || []);
      setMeta(res.meta);
    } finally { setLoading(false); }
  }, [page, debouncedSearch, suppFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getSuppliers().then(r => setSuppliers(r.data || [])); }, []);
  useEffect(() => { setPage(1); }, [debouncedSearch, suppFilter]);

  async function handleToggle(id: string) { await toggleProduct(id); load(); }
  async function handleDelete(id: string) {
    if (!confirm(`${t.ui.delete} ${t.ui.product}?`)) return;
    await deleteProduct(id); load();
  }

  const supplierName = (sid: string) => suppliers.find(s => String(s.id) === String(sid))?.name || '—';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader title={t.ui.products} subtitle={meta ? `${meta.total.toLocaleString()} ${t.ui.productsTotal}` : t.ui.loading}>
        <Link href="/products/new">
          <Btn variant="esi"><Plus size={14} /> {t.ui.addProduct}</Btn>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.ui.searchProducts}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-dim/60 focus:outline-none focus:border-esi/50 transition-colors"
          />
        </div>
        <Select
          value={suppFilter}
          onChange={e => setSuppFilter(e.target.value)}
          className="min-w-[190px]"
        >
          <option value="">{t.ui.allSuppliers}</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <Empty message={t.ui.noProductsFound} icon={<Package size={48} />} />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>{t.ui.product}</Th>
                <Th>SKU</Th>
                <Th>{t.ui.supplier}</Th>
                <Th>{t.ui.category}</Th>
                <Th>{t.ui.image}</Th>
                <Th>{t.ui.status}</Th>
                <Th className="text-right">{t.ui.actions}</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id}
                  className="hover:bg-esi/5 transition-colors animate-fadeUp"
                  style={{ animationDelay: `${i * 0.02}s`, opacity: 0 }}
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      {p.data?.image_url ? (
                        <img src={p.data.image_url} alt="" className="w-9 h-9 rounded-lg object-contain bg-white/5 border border-border" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center">
                          <Package size={14} className="text-dim" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-ink truncate max-w-[220px]">{p.data?.name || '—'}</p>
                        {p.data?.short_description && (
                          <p className="text-xs text-dim truncate max-w-[220px]">{p.data.short_description}</p>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td><span className="font-mono text-xs text-dim">{p.data?.sku || '—'}</span></Td>
                  <Td><span className="text-xs">{supplierName(p.supplier_id)}</span></Td>
                  <Td><span className="text-xs text-dim">{p.data?.category || '—'}</span></Td>
                  <Td>
                    {p.data?.image_url ? <Badge color="green">{t.ui.yes}</Badge> : <Badge color="default">{t.ui.no}</Badge>}
                  </Td>
                  <Td>
                    <Badge color={p.is_active ? 'green' : 'red'}>
                      {p.is_active ? t.ui.active : t.ui.hidden}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/products/${p.id}`}>
                        <Btn size="sm" variant="ghost">{t.ui.edit}</Btn>
                      </Link>
                      <Btn size="sm" variant="ghost" onClick={() => handleToggle(p.id)}
                        title={p.is_active ? t.ui.hide : t.ui.show}>
                        {p.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="text-xs text-dim font-mono">
                {t.ui.page} {meta.page} {t.ui.of} {meta.totalPages} - {meta.total.toLocaleString()} {t.ui.products}
              </p>
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft size={14} /> {t.ui.prev}
                </Btn>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(meta.totalPages - 4, page - 2)) + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={clsx(
                          'w-8 h-8 rounded-lg text-xs font-mono transition-colors',
                          p === page ? 'bg-esi text-white font-bold' : 'text-dim hover:text-ink hover:bg-muted'
                        )}>
                        {p}
                      </button>
                    );
                  })}
                </div>
                <Btn size="sm" variant="ghost" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>
                  {t.ui.next} <ChevronRight size={14} />
                </Btn>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
