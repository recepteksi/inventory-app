import { apiFetch } from './client.ts';
import type { Worker } from '../../types/index.ts';

/** Worker CRUD endpoints. */
export const workersApi = {
  getAll: (): Promise<Worker[]> => apiFetch<Worker[]>('/workers'),

  create: (payload: Record<string, unknown>): Promise<Worker> =>
    apiFetch<Worker>('/workers', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<Worker> =>
    apiFetch<Worker>(`/workers/${id}`, { method: 'PUT', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/workers/${id}`, { method: 'DELETE' }),
};
