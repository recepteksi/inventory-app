import { apiFetch } from './client.js';

export const materialsApi = {
  getAll: () => apiFetch('/materials'),
  getById: (id) => apiFetch(`/materials/${id}`),
  create: (payload) => apiFetch('/materials', { method: 'POST', body: payload }),
  update: (id, payload) => apiFetch(`/materials/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiFetch(`/materials/${id}`, { method: 'DELETE' }),
};
