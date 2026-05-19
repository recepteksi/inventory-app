import { tr } from '../i18n/tr.ts';

/**
 * Formats an ISO date string as a short Turkish date.
 * @param iso - ISO 8601 date string (YYYY-MM-DD)
 * @returns Formatted date (e.g. "15 Oca 2026"), or '—' for empty values
 */
export function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${tr.months[d.getMonth()]} ${d.getFullYear()}`;
}
