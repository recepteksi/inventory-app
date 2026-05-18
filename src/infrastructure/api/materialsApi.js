import { apiFetch } from './client.js';

/** Material CRUD endpoints. */
export const materialsApi = {
  /** @returns {Promise<{ boruFittings: object[], digerMalzeme: object[] }>} */
  getAll: () => apiFetch('/materials'),

  /** @param {string} id @returns {Promise<object>} */
  getById: (id) => apiFetch(`/materials/${id}`),

  /** @param {object} payload - New material fields @returns {Promise<object>} Created material */
  create: (payload) => apiFetch('/materials', { method: 'POST', body: payload }),

  /** @param {string} id @param {object} payload @returns {Promise<object>} Updated material */
  update: (id, payload) => apiFetch(`/materials/${id}`, { method: 'PUT', body: payload }),

  /** @param {string} id @returns {Promise<null>} Throws 409 if movements exist */
  remove: (id) => apiFetch(`/materials/${id}`, { method: 'DELETE' }),
};
