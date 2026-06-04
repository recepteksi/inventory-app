import { apiFetch } from './client.ts';
import type { Movement, MovementResult, BatchUsageResult } from '../../types/index.ts';

/** Movement (delivery/usage) read and write endpoints. */
export const movementsApi = {
  getAll: (siteId: string): Promise<Movement[]> =>
    apiFetch<Movement[]>(`/movements?siteId=${encodeURIComponent(siteId)}`),

  getByMaterial: (materialId: string, siteId?: string): Promise<Movement[]> =>
    apiFetch<Movement[]>(`/movements?materialId=${encodeURIComponent(materialId)}${siteId ? `&siteId=${encodeURIComponent(siteId)}` : ''}`),

  getByWorker: (workerId: string, siteId?: string): Promise<Movement[]> =>
    apiFetch<Movement[]>(`/movements?workerId=${encodeURIComponent(workerId)}${siteId ? `&siteId=${encodeURIComponent(siteId)}` : ''}`),

  postDelivery: (payload: Record<string, unknown>): Promise<MovementResult> =>
    apiFetch<MovementResult>('/movements/delivery', { method: 'POST', body: payload }),

  postUsage: (payload: Record<string, unknown>): Promise<MovementResult> =>
    apiFetch<MovementResult>('/movements/usage', { method: 'POST', body: payload }),

  postUsageBatch: (payload: Record<string, unknown>): Promise<BatchUsageResult> =>
    apiFetch<BatchUsageResult>('/movements/usage-batch', { method: 'POST', body: payload }),
};
