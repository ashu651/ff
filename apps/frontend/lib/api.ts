const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Accept': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { const j = await res.json(); message = j.message || message; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function uploadFile(path: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}${path}`, { method: 'POST', body: form, credentials: 'include' });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}