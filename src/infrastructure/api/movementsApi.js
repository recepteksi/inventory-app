import { apiFetch } from './client.js';

/** Movement (delivery/usage) read and write endpoints. */
export const movementsApi = {
  /** @returns {Promise<object[]>} All movements (date descending) */
  getAll: () => apiFetch('/movements'),

  /** @param {string} malzemeId @returns {Promise<object[]>} Movements for a material */
  getByMalzeme: (malzemeId) => apiFetch(`/movements?malzemeId=${malzemeId}`),

  /** @param {string} ustaId @returns {Promise<object[]>} Movements for a worker */
  getByUsta: (ustaId) => apiFetch(`/movements?ustaId=${ustaId}`),

  /**
   * Records an incoming delivery from a supplier.
   * @param {{ malzemeId: string, miktar: number, tarih: string, tedarikci?: string, fis?: string }} payload
   * @returns {Promise<{ movement: object, updatedMaterial: object }>}
   */
  postGelis: (payload) => apiFetch('/movements/gelis', { method: 'POST', body: payload }),

  /**
   * Records material usage in production. Throws 400 if stock is insufficient.
   * @param {{ malzemeId: string, miktar: number, ustaId: string, is: string, tarih: string }} payload
   * @returns {Promise<{ movement: object, updatedMaterial: object }>}
   */
  postKullanim: (payload) => apiFetch('/movements/kullanim', { method: 'POST', body: payload }),
};
