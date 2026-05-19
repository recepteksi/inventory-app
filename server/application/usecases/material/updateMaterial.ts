import type { Material, IMaterialRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function updateMaterial(
  id: string,
  payload: Record<string, unknown>,
  { materialRepo }: { materialRepo: IMaterialRepository }
): Promise<Material> {
  const existing = await materialRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  const allowed: Partial<Material> =
    existing.group === 'pipe'
      ? { minimum: Number(payload['minimum']) }
      : {
          name: typeof payload['name'] === 'string' ? payload['name'].trim() : existing.name,
          category: typeof payload['category'] === 'string' ? payload['category'] : existing.category,
          unit: typeof payload['unit'] === 'string' ? payload['unit'] : existing.unit,
          minimum: Number(payload['minimum']),
        };

  const updated: Material = { ...existing, ...allowed };

  if (existing.group === 'other' && payload['name']) {
    const isDuplicate = await materialRepo.checkDuplicate(updated);
    if (isDuplicate) {
      const err: AppError = new Error('This material name is already registered');
      err.status = 409;
      throw err;
    }
  }

  const result = await materialRepo.update(id, updated);
  if (!result) throw new Error('Material not found after update');
  return result;
}
