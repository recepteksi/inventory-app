export function getMalzemeAd(m) {
  if (!m) return '—';
  if (m.tur) return `${m.cap} ${m.cins} ${m.tur}`;
  return m.ad;
}

export function stokDurum(item) {
  if (item.stok < item.minimum)
    return { etiket: 'AZALDI', renk: 'oklch(0.60 0.18 30)', soft: 'oklch(0.94 0.05 30)' };
  if (item.stok < item.minimum * 1.5)
    return { etiket: 'TAKİP', renk: 'oklch(0.62 0.18 45)', soft: 'oklch(0.95 0.04 60)' };
  return { etiket: 'STOKTA', renk: 'oklch(0.55 0.12 145)', soft: 'oklch(0.94 0.05 145)' };
}
