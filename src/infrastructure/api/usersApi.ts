import { apiFetch } from './client.ts';
import type { PublicUser } from '../../types/index.ts';

/** User management endpoints (admin only). */
export const usersApi = {
  getAll: (): Promise<PublicUser[]> => apiFetch<PublicUser[]>('/users'),

  create: (payload: Record<string, unknown>): Promise<PublicUser> =>
    apiFetch<PublicUser>('/users', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<PublicUser> =>
    apiFetch<PublicUser>(`/users?id=${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
