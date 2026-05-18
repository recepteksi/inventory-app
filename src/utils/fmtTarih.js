const TR_AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/**
 * Formats an ISO date string as a short Turkish date.
 * @param {string} iso - ISO 8601 date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g. "15 Oca 2026"), or '—' for empty values
 */
export function fmtTarih(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${TR_AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}
