import { tr } from '../../i18n/tr.ts';

const BASE = '/api';

/**
 * Base fetch wrapper used by all API calls.
 * - Catches network errors with a user-friendly message
 * - Returns null for 204 responses
 * - Handles JSON parse errors
 * - Throws `data.error` or "HTTP {status}" on non-OK responses
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method,
      headers: { 'Content-Type': 'application/json' },
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error(tr.api.networkError);
  }

  if (res.status === 204) return null as T;

  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return null as T;
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      tr.api.parseError
        .replace('{status}', String(res.status))
        .replace('{text}', text.slice(0, 80))
    );
  }

  if (!res.ok) {
    const errData = data as Record<string, unknown> | null;
    throw new Error((errData?.error as string | undefined) ?? `HTTP ${res.status}`);
  }
  return data as T;
}
