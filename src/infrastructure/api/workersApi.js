import { apiFetch } from './client.js';

/** Worker CRUD endpoints. */
export const workersApi = {
  /** @returns {Promise<object[]>} All workers */
  getAll: () => apiFetch('/workers'),

  /** @param {object} payload - { ad, uzmanlik, baslangic } @returns {Promise<object>} Created worker */
  create: (payload) => apiFetch('/workers', { method: 'POST', body: payload }),

  /** @param {string} id @param {object} payload @returns {Promise<object>} Updated worker */
  update: (id, payload) => apiFetch(`/workers/${id}`, { method: 'PUT', body: payload }),

  /** @param {string} id @returns {Promise<null>} Throws 409 if movements exist */
  remove: (id) => apiFetch(`/workers/${id}`, { method: 'DELETE' }),
};
