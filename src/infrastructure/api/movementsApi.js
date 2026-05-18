import { apiFetch } from './client.js';

export const movementsApi = {
  getAll: () => apiFetch('/movements'),
  getByMalzeme: (malzemeId) => apiFetch(`/movements?malzemeId=${malzemeId}`),
  getByUsta: (ustaId) => apiFetch(`/movements?ustaId=${ustaId}`),
  postGelis: (payload) => apiFetch('/movements/gelis', { method: 'POST', body: payload }),
  postKullanim: (payload) => apiFetch('/movements/kullanim', { method: 'POST', body: payload }),
};
