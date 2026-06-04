import { apiFetch } from './client.ts';
import type { Site } from '../../types/index.ts';

/** Site (şantiye) endpoints. Reads are any-auth; writes are admin only. */
export const sitesApi = {
  getAll: (): Promise<Site[]> => apiFetch<Site[]>('/sites'),

  create: (payload: Record<string, unknown>): Promise<Site> =>
    apiFetch<Site>('/sites', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<Site> =>
    apiFetch<Site>(`/sites?id=${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/sites?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
