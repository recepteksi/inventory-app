const BASE = '/api';

export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    throw new Error('Sunucuya bağlanılamadı. Sunucu çalışıyor mu? (node server/index.js)');
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return null;
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Sunucudan geçersiz yanıt (${res.status}): ${text.slice(0, 80)}`);
  }

  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}
