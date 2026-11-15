import { mockApi } from './mockApi.js';

const URL_ENV = import.meta.env.VITE_API_URL;
const BASE = URL_ENV || '/api';
export const DOMAINS = ['AI', 'Web', 'Mobile', 'IoT', 'Data', 'Security'];
export const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

// Demo mode = in-browser sample data. It is used when forced, when no backend URL is configured in a production
// build, or automatically when the real backend cannot be reached (sleeping, offline or down).
let demo = import.meta.env.VITE_DEMO_ONLY === 'true' || (import.meta.env.PROD && !URL_ENV);
const listeners = [];
export const isDemo = () => demo;
export const onDemo = (fn) => listeners.push(fn);
function goDemo() { if (!demo) { demo = true; listeners.forEach((f) => f()); } }

export async function api(path, opts = {}) {
  if (demo) return mockApi(path, opts);
  let res;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts, signal: ctl.signal, body: opts.body ? JSON.stringify(opts.body) : undefined });
  } catch { goDemo(); return mockApi(path, opts); } finally { clearTimeout(timer); }
  if (res.status >= 502 && res.status <= 504) { goDemo(); return mockApi(path, opts); }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.error || Object.values(data?.errors || {}).join(', ') || `Request failed (${res.status})`);
    err.fields = data?.errors || {};
    throw err;
  }
  return data;
}
