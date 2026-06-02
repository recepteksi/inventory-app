import { apiFetch } from './client.ts';
import type { CatalogEntry } from '../../types/index.ts';

/** Catalog (selectable option values) endpoints. Writes are admin only. */
export const catalogApi = {
  getAll: (): Promise<CatalogEntry[]> => apiFetch<CatalogEntry[]>('/catalog'),

  create: (payload: Record<string, unknown>): Promise<CatalogEntry> =>
    apiFetch<CatalogEntry>('/catalog', { method: 'POST', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/catalog?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
