const BASE = import.meta.env.VITE_API_URL || '/api';
export const DOMAINS = ['AI', 'Web', 'Mobile', 'IoT', 'Data', 'Security'];
export const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export async function api(path, opts = {}) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.error || Object.values(data?.errors || {}).join(', ') || `Request failed (${res.status})`);
    err.fields = data?.errors || {};
    throw err;
  }
  return data;
}
