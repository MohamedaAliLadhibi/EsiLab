// lib/api.ts
function getSavedToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function req<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const authToken = token || getSavedToken();
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    cache: 'no-store',
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const login = (body: { email: string; password: string }) =>
  req<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }, null);
export const signup = (body: { name: string; email: string; password: string }) =>
  req<any>('/auth/signup', { method: 'POST', body: JSON.stringify(body) }, null);
export const me = (token?: string) => req<any>('/auth/me', {}, token);
export const getPendingSignups = () => req<any>('/auth/pending-signups');
export const approveSignup = (id: string | number) =>
  req<any>(`/auth/pending-signups/${id}/approve`, { method: 'PATCH' });
export const rejectSignup = (id: string | number) =>
  req<any>(`/auth/pending-signups/${id}/reject`, { method: 'PATCH' });

// ── Users ──────────────────────────────────────────────────────────────────
export const getUsers = () => req<any>('/users');
export const deleteUser = (id: string | number) => req<any>(`/users/${id}`, { method: 'DELETE' });
export const updateUser = (id: string | number, body: {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'employer';
  status?: 'pending' | 'approved' | 'rejected';
}) =>
  req<any>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

// ── Suppliers ──────────────────────────────────────────────────────────────
export const getDashboardSummary = ()      => req<any>('/dashboard/summary');
export const getSuppliers   = ()           => req<any>('/suppliers');
export const getSupplier    = (id: string) => req<any>(`/suppliers/${id}`);
export const createSupplier = (body: any)  => req<any>('/suppliers', { method: 'POST', body: JSON.stringify(body) });
export const updateSupplier = (id: string, body: any) => req<any>(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteSupplier = (id: string) => req<any>(`/suppliers/${id}`, { method: 'DELETE' });

// ── Field Mappings ─────────────────────────────────────────────────────────
export const getMappings     = (id: string) => req<any>(`/suppliers/${id}/mappings`);
export const replaceMappings = (id: string, mappings: any[]) =>
  req<any>(`/suppliers/${id}/mappings`, { method: 'PUT', body: JSON.stringify({ mappings }) });

// ── Products ───────────────────────────────────────────────────────────────
export const getProducts = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return req<any>(`/products${qs}`);
};
export const getProduct      = (id: string)  => req<any>(`/products/${id}`);
export const toggleProduct   = (id: string)  => req<any>(`/products/${id}/toggle-active`, { method: 'PATCH' });
export const deleteProduct   = (id: string)  => req<any>(`/products/${id}`, { method: 'DELETE' });
export const getProductFields = ()           => req<any>('/product-fields');

// ── Imports ────────────────────────────────────────────────────────────────
export const getImportLogs = (supplierId: string) => req<any>(`/suppliers/${supplierId}/imports`);
export const getImportLog  = (logId: string)      => req<any>(`/imports/${logId}`);

export async function importFile(supplierId: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const authToken = getSavedToken();
  const res = await fetch(`/api/admin/suppliers/${supplierId}/import`, {  // <-- fixed path
    method: 'POST',
    body: form,
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Import failed');
  return data;
}