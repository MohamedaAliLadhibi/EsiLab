// lib/api.ts
async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

// ── Suppliers ──────────────────────────────────────────────────────────────
export const getDashboardSummary = ()      => req<any>('/admin/dashboard/summary');
export const getSuppliers   = ()           => req<any>('/admin/suppliers');
export const getSupplier    = (id: string) => req<any>(`/admin/suppliers/${id}`);
export const createSupplier = (body: any)  => req<any>('/admin/suppliers', { method: 'POST', body: JSON.stringify(body) });
export const updateSupplier = (id: string, body: any) => req<any>(`/admin/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteSupplier = (id: string) => req<any>(`/admin/suppliers/${id}`, { method: 'DELETE' });

// ── Field Mappings ─────────────────────────────────────────────────────────
export const getMappings     = (id: string) => req<any>(`/admin/suppliers/${id}/mappings`);
export const replaceMappings = (id: string, mappings: any[]) =>
  req<any>(`/admin/suppliers/${id}/mappings`, { method: 'PUT', body: JSON.stringify({ mappings }) });

// ── Products ───────────────────────────────────────────────────────────────
export const getProducts = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return req<any>(`/admin/products${qs}`);
};
export const getProduct      = (id: string)  => req<any>(`/admin/products/${id}`);
export const toggleProduct   = (id: string)  => req<any>(`/admin/products/${id}/toggle-active`, { method: 'PATCH' });
export const deleteProduct   = (id: string)  => req<any>(`/admin/products/${id}`, { method: 'DELETE' });
export const getProductFields = ()           => req<any>('/admin/product-fields');

// ── Imports ────────────────────────────────────────────────────────────────
export const getImportLogs = (supplierId: string) => req<any>(`/admin/suppliers/${supplierId}/imports`);
export const getImportLog  = (logId: string)      => req<any>(`/admin/imports/${logId}`);

export async function importFile(supplierId: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`/api/admin/admin/suppliers/${supplierId}/import`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Import failed');
  return data;
}
