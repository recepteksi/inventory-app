import type { Material } from '../types/index.js';

/** Human-readable size for an isolation material ("Ø100" or "200×100"). */
function isolationSize(m: Material): string {
  if (m.shape === 'rect') return `${m.width ?? '?'}×${m.height ?? '?'}`;
  return `Ø${m.diameter ?? '?'}`;
}

/**
 * Server-side display name for a material, kept in sync with the frontend
 * `getMaterialName`. Used to snapshot a readable name onto order items.
 */
export function getMaterialDisplayName(m: Material): string {
  if (m.group === 'isolation') return `${isolationSize(m)} ${m.kind} · ${m.thickness}mm`;
  if (m.kind) return [m.diameter, m.grade, m.kind].filter(Boolean).join(' ');
  return m.name ?? m.id;
}
