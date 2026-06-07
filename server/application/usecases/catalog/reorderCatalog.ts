import type { CatalogEntry, ICatalogRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

function bad(message: string, status = 400): AppError {
  const err: AppError = new Error(message);
  err.status = status;
  return err;
}

/**
 * Moves a catalog value up or down within its (section, field) group by
 * swapping its order with the adjacent entry. Returns the full, re-sorted
 * catalog so the client can refresh its option lists in one shot.
 */
export async function reorderCatalog(
  id: string,
  direction: 'up' | 'down',
  { catalogRepo }: { catalogRepo: ICatalogRepository }
): Promise<CatalogEntry[]> {
  if (direction !== 'up' && direction !== 'down') throw bad('direction must be "up" or "down"');

  const target = await catalogRepo.findById(id);
  if (!target) throw bad('Catalog entry not found', 404);

  // The group's entries in their current display order.
  const all = await catalogRepo.findAll();
  const group = all.filter((c) => c.section === target.section && c.field === target.field);
  const index = group.findIndex((c) => c.id === id);
  const neighborIndex = direction === 'up' ? index - 1 : index + 1;

  // Already at an edge — nothing to do.
  if (neighborIndex < 0 || neighborIndex >= group.length) return all;

  const neighbor = group[neighborIndex];
  // findAll guarantees a numeric order via its fallback sort, but persisted
  // values may still be undefined; use the array index as a safe default.
  const targetOrder = target.order ?? index;
  const neighborOrder = neighbor.order ?? neighborIndex;

  await catalogRepo.update(target.id, { order: neighborOrder });
  await catalogRepo.update(neighbor.id, { order: targetOrder });

  return catalogRepo.findAll();
}
