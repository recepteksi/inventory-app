/**
 * Generates up to two initials from a worker's full name.
 * Takes the first letter of each word and uppercases it.
 * @param {string} ad - Worker's full name (e.g. "Hasan Yıldız")
 * @returns {string} Two-character initials (e.g. "HY")
 */
export function ustaInitials(ad) {
  return ad
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Derives a deterministic HSL hue from a worker's ID.
 * The same ID always produces the same colour so avatars remain visually distinct.
 * @param {string} id - Worker's unique ID
 * @returns {number} Hue value in the range 0–359
 */
export function ustaAvatarHue(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}
