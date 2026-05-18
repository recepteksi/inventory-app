const BASE = '/api';

/**
 * Base fetch wrapper used by all API calls.
 * - Catches network errors with a user-friendly message
 * - Returns null for 204 responses
 * - Handles JSON parse errors
 * - Throws `data.error` or "HTTP {status}" on non-OK responses
 * @param {string} path - Path after /api (e.g. '/materials')
 * @param {{ method?: string, headers?: object, body?: unknown }} [options] - Fetch options
 * @returns {Promise<unknown>} Parsed JSON response, or null for 204/empty responses
 * @throws {Error} On network failure, HTTP error status, or invalid JSON
 */
export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
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
