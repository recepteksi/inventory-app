import { apiFetch } from './client.ts';
import type { Movement, MovementResult } from '../../types/index.ts';

/** Movement (delivery/usage) read and write endpoints. */
export const movementsApi = {
  getAll: (): Promise<Movement[]> => apiFetch<Movement[]>('/movements'),

  getByMaterial: (materialId: string): Promise<Movement[]> =>
    apiFetch<Movement[]>(`/movements?materialId=${materialId}`),

  getByWorker: (workerId: string): Promise<Movement[]> =>
    apiFetch<Movement[]>(`/movements?workerId=${workerId}`),

  postDelivery: (payload: Record<string, unknown>): Promise<MovementResult> =>
    apiFetch<MovementResult>('/movements/delivery', { method: 'POST', body: payload }),

  postUsage: (payload: Record<string, unknown>): Promise<MovementResult> =>
    apiFetch<MovementResult>('/movements/usage', { method: 'POST', body: payload }),
};
