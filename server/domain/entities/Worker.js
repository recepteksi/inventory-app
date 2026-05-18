import { randomUUID } from 'crypto';

export function createWorker({ ad, uzmanlik, baslangic, id }) {
  if (!ad || !uzmanlik || !baslangic) throw new Error('ad, uzmanlik ve baslangic zorunludur');
  return {
    id: id ?? `u-${randomUUID().slice(0, 8)}`,
    ad: ad.trim(),
    uzmanlik: uzmanlik.trim(),
    baslangic,
  };
}
