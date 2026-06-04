import { apiFetch } from './client.ts';
import type { Order } from '../../types/index.ts';

/** Purchase-order endpoints. */
export const ordersApi = {
  getAll: (siteId: string): Promise<Order[]> =>
    apiFetch<Order[]>(`/orders?siteId=${encodeURIComponent(siteId)}`),

  create: (payload: Record<string, unknown>): Promise<Order> =>
    apiFetch<Order>('/orders', { method: 'POST', body: payload }),

  approve: (id: string): Promise<Order> =>
    apiFetch<Order>(`/orders/${id}`, { method: 'PUT', body: { action: 'approve' } }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/orders/${id}`, { method: 'DELETE' }),
};
