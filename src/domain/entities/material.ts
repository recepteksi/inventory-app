import { tr } from '../../i18n/tr.ts';
import type { Material } from '../../types/index.ts';

/** Human-readable size for an isolation material ("Ø100" or "200×100"). */
export function isolationSize(m: Pick<Material, 'shape' | 'diameter' | 'width' | 'height'>): string {
  if (m.shape === 'rect') return `${m.width ?? '?'}×${m.height ?? '?'}`;
  return `Ø${m.diameter ?? '?'}`;
}

/**
 * Returns the display name for a material.
 * - pipe / ventilation: "diameter grade kind"
 * - isolation: "kind size · thickness mm"
 * - other: the free-form `name`
 */
export function getMaterialName(m: Material | null | undefined): string {
  if (!m) return '—';
  if (m.group === 'isolation') {
    return `${m.kind} ${isolationSize(m)} · ${m.thickness}mm`;
  }
  if (m.kind) {
    return [m.diameter, m.grade, m.kind].filter(Boolean).join(' ');
  }
  return m.name ?? '—';
}

/**
 * Returns stock status label and color pair for a material.
 * - When `minimum` is not set the material is not tracked → always IN_STOCK.
 * - LOW: stock < minimum (red)
 * - WATCH: stock < minimum × 1.5 (amber)
 * - IN_STOCK: sufficient stock (green)
 */
export function stockStatus(item: Pick<Material, 'stock' | 'minimum'>): { label: string; color: string; softColor: string } {
  const min = item.minimum;
  if (min != null) {
    if (item.stock < min)
      return { label: tr.status.low, color: 'oklch(0.60 0.18 30)', softColor: 'oklch(0.94 0.05 30)' };
    if (item.stock < min * 1.5)
      return { label: tr.status.watch, color: 'oklch(0.62 0.18 45)', softColor: 'oklch(0.95 0.04 60)' };
  }
  return { label: tr.status.inStock, color: 'oklch(0.55 0.12 145)', softColor: 'oklch(0.94 0.05 145)' };
}
