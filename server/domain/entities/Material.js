import { randomUUID } from 'crypto';

export function createBoruFitting({ cap, tur, cins, stok = 0, minimum = 0, id }) {
  if (!cap || !tur || !cins) throw new Error('cap, tur ve cins zorunludur');
  const birim = tur === 'Boru' ? 'm' : 'adet';
  return {
    id: id ?? `bf-${randomUUID().slice(0, 8)}`,
    grup: 'boru',
    tur,
    cap,
    cins,
    stok: Number(stok),
    birim,
    minimum: Number(minimum),
  };
}

export function createDigerMalzeme({ ad, kategori, birim, stok = 0, minimum = 0, id }) {
  if (!ad || !kategori || !birim) throw new Error('ad, kategori ve birim zorunludur');
  return {
    id: id ?? `dm-${randomUUID().slice(0, 8)}`,
    grup: 'diger',
    kategori,
    ad: ad.trim(),
    stok: Number(stok),
    birim,
    minimum: Number(minimum),
  };
}
