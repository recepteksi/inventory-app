/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 * @returns {string} Today's ISO date
 */
export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
