import { apiFetch } from './client.ts';
import type { Material, MaterialsResponse } from '../../types/index.ts';

/** Material CRUD endpoints. */
export const materialsApi = {
  getAll: (siteId: string): Promise<MaterialsResponse> =>
    apiFetch<MaterialsResponse>(`/materials?siteId=${encodeURIComponent(siteId)}`),

  getById: (id: string): Promise<Material> => apiFetch<Material>(`/materials/${id}`),

  create: (payload: Record<string, unknown>): Promise<Material> =>
    apiFetch<Material>('/materials', { method: 'POST', body: payload }),

  update: (id: string, payload: Record<string, unknown>): Promise<Material> =>
    apiFetch<Material>(`/materials/${id}`, { method: 'PUT', body: payload }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/materials/${id}`, { method: 'DELETE' }),
};
