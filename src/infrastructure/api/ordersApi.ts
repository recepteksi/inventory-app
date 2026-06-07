import { apiFetch } from './client.ts';
import type { Order } from '../../types/index.ts';

/** Purchase-order endpoints. */
export const ordersApi = {
  getAll: (siteId: string): Promise<Order[]> =>
    apiFetch<Order[]>(`/orders?siteId=${encodeURIComponent(siteId)}`),

  create: (payload: Record<string, unknown>): Promise<Order> =>
    apiFetch<Order>('/orders', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<Order> =>
    apiFetch<Order>(`/orders/${id}`, { method: 'PUT', body: { ...payload, action: 'update' } }),

  approve: (id: string, deliveryDate: string): Promise<Order> =>
    apiFetch<Order>(`/orders/${id}`, { method: 'PUT', body: { action: 'approve', deliveryDate } }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/orders/${id}`, { method: 'DELETE' }),
};
