/**
 * Generates up to two initials from a worker's full name.
 * Takes the first letter of each word and uppercases it.
 */
export function workerInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Derives a deterministic HSL hue from a worker's ID.
 * The same ID always produces the same colour so avatars remain visually distinct.
 */
export function workerAvatarHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}
