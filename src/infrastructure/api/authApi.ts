import { apiFetch } from './client.ts';
import type { PublicUser } from '../../types/index.ts';

/** Authentication endpoints. Session is kept in an httpOnly cookie. */
export const authApi = {
  me: (): Promise<PublicUser> => apiFetch<PublicUser>('/auth/me'),

  login: (username: string, password: string): Promise<PublicUser> =>
    apiFetch<PublicUser>('/auth/login', { method: 'POST', body: { username, password } }),

  logout: (): Promise<void> => apiFetch<void>('/auth/logout', { method: 'POST' }),
};
