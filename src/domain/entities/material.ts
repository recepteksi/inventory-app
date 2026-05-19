import { tr } from '../../i18n/tr.ts';
import type { Material } from '../../types/index.ts';

/**
 * Returns the display name for a material.
 * Pipe/fitting items use "diameter kind grade" format; other materials use the `name` field.
 */
export function getMaterialName(m: Material | null | undefined): string {
  if (!m) return '—';
  if (m.kind) return `${m.diameter} ${m.grade} ${m.kind}`;
  return m.name ?? '—';
}

/**
 * Returns stock status label and color pair for a material.
 * - LOW: stock < minimum (red)
 * - WATCH: stock < minimum × 1.5 (amber)
 * - IN_STOCK: sufficient stock (green)
 */
export function stockStatus(item: Pick<Material, 'stock' | 'minimum'>): { label: string; color: string; softColor: string } {
  if (item.stock < item.minimum)
    return { label: tr.status.low, color: 'oklch(0.60 0.18 30)', softColor: 'oklch(0.94 0.05 30)' };
  if (item.stock < item.minimum * 1.5)
    return { label: tr.status.watch, color: 'oklch(0.62 0.18 45)', softColor: 'oklch(0.95 0.04 60)' };
  return { label: tr.status.inStock, color: 'oklch(0.55 0.12 145)', softColor: 'oklch(0.94 0.05 145)' };
}
