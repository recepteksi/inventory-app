import { apiFetch } from './client.js';

export const workersApi = {
  getAll: () => apiFetch('/workers'),
  create: (payload) => apiFetch('/workers', { method: 'POST', body: payload }),
  update: (id, payload) => apiFetch(`/workers/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiFetch(`/workers/${id}`, { method: 'DELETE' }),
};
