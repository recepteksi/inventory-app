import { apiFetch } from './client.ts';
import type { CatalogEntry } from '../../types/index.ts';

/** Catalog (selectable option values) endpoints. Writes are admin only. */
export const catalogApi = {
  getAll: (): Promise<CatalogEntry[]> => apiFetch<CatalogEntry[]>('/catalog'),

  create: (payload: Record<string, unknown>): Promise<CatalogEntry> =>
    apiFetch<CatalogEntry>('/catalog', { method: 'POST', body: payload }),

  /** Moves a value up/down within its group. Returns the full re-sorted catalog. */
  reorder: (id: string, direction: 'up' | 'down'): Promise<CatalogEntry[]> =>
    apiFetch<CatalogEntry[]>('/catalog', { method: 'PUT', body: { id, direction } }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/catalog?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
