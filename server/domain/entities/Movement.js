import { randomUUID } from 'crypto';

export function createGelis({ malzemeId, miktar, tarih, tedarikci, fis }) {
  if (!malzemeId || !miktar || !tarih) throw new Error('malzemeId, miktar ve tarih zorunludur');
  const h = {
    id: `h-${randomUUID().slice(0, 8)}`,
    malzemeId,
    tip: 'gelis',
    miktar: Number(miktar),
    tarih,
  };
  if (tedarikci) h.not = `Tedarikçi: ${tedarikci}`;
  if (fis) h.fis = fis;
  return h;
}

export function createKullanim({ malzemeId, miktar, tarih, ustaId, is }) {
  if (!malzemeId || !miktar || !tarih || !ustaId || !is) {
    throw new Error('malzemeId, miktar, tarih, ustaId ve is zorunludur');
  }
  return {
    id: `h-${randomUUID().slice(0, 8)}`,
    malzemeId,
    tip: 'kullanim',
    miktar: Number(miktar),
    tarih,
    ustaId,
    is: is.trim(),
  };
}
