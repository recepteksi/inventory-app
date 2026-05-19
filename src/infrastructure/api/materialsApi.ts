import { apiFetch } from './client.ts';
import type { Material, MaterialsResponse } from '../../types/index.ts';

/** Material CRUD endpoints. */
export const materialsApi = {
  getAll: (): Promise<MaterialsResponse> => apiFetch<MaterialsResponse>('/materials'),

  getById: (id: string): Promise<Material> => apiFetch<Material>(`/materials/${id}`),

  create: (payload: Record<string, unknown>): Promise<Material> =>
    apiFetch<Material>('/materials', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<Material> =>
    apiFetch<Material>(`/materials/${id}`, { method: 'PUT', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/materials/${id}`, { method: 'DELETE' }),
};
