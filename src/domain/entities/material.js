/**
 * Returns the display name for a material.
 * Pipe/fitting items use "diameter type kind" format; other materials use the `ad` field.
 * @param {object|null|undefined} m - Material object
 * @returns {string} Display name, or '—' when null/undefined
 */
export function getMalzemeAd(m) {
  if (!m) return '—';
  if (m.tur) return `${m.cap} ${m.cins} ${m.tur}`;
  return m.ad;
}

/**
 * Returns stock status label and color pair for a material.
 * - AZALDI (LOW): stok < minimum (red)
 * - TAKİP (WATCH): stok < minimum × 1.5 (amber)
 * - STOKTA (IN STOCK): sufficient stock (green)
 * @param {{ stok: number, minimum: number }} item - Object with stok and minimum fields
 * @returns {{ etiket: string, renk: string, soft: string }} Status label and CSS color values
 */
export function stokDurum(item) {
  if (item.stok < item.minimum)
    return { etiket: 'AZALDI', renk: 'oklch(0.60 0.18 30)', soft: 'oklch(0.94 0.05 30)' };
  if (item.stok < item.minimum * 1.5)
    return { etiket: 'TAKİP', renk: 'oklch(0.62 0.18 45)', soft: 'oklch(0.95 0.04 60)' };
  return { etiket: 'STOKTA', renk: 'oklch(0.55 0.12 145)', soft: 'oklch(0.94 0.05 145)' };
}
