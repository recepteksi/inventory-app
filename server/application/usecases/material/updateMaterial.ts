import { parseMinimum } from '../../../domain/entities/Material.js';
import type { Material, IMaterialRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

function str(v: unknown, fallback: string | undefined): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : fallback;
}

/**
 * Updates a material. Everyone may change `minimum` (and the descriptive fields of
 * "other" materials). Identifying properties — kind/diameter/grade for pipe &
 * ventilation, and the geometry/kind/grade of isolation — may only be changed by
 * an admin, matching the "yönetici cins + tür özelliklerine müdahale" requirement.
 */
export async function updateMaterial(
  id: string,
  payload: Record<string, unknown>,
  { materialRepo, isAdmin = false }: { materialRepo: IMaterialRepository; isAdmin?: boolean }
): Promise<Material> {
  const existing = await materialRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  const updated: Material = { ...existing, minimum: parseMinimum(payload['minimum']) };

  if (existing.group === 'other') {
    updated.name = str(payload['name'], existing.name);
    updated.category = str(payload['category'], existing.category);
    updated.unit = str(payload['unit'], existing.unit) ?? existing.unit;
  } else if (isAdmin) {
    if (existing.group === 'pipe' || existing.group === 'ventilation') {
      updated.diameter = str(payload['diameter'], existing.diameter);
      updated.size = str(payload['size'], existing.size);
      updated.kind = str(payload['kind'], existing.kind) ?? existing.kind;
      updated.grade = str(payload['grade'], existing.grade) ?? existing.grade;
      if (existing.group === 'pipe') updated.unit = updated.kind === 'Boru' ? 'm' : 'adet';
      // Either a standard çap or a free-text özel ölçü must identify the malzeme;
      // clearing both would persist an unidentifiable material (matches createPipeFitting).
      if (!updated.diameter && !updated.size) {
        const err: AppError = new Error('diameter (or size), kind, and grade are required');
        err.status = 400;
        throw err;
      }
    } else if (existing.group === 'isolation') {
      updated.kind = str(payload['kind'], existing.kind) ?? existing.kind;
      updated.grade = str(payload['grade'], existing.grade);
      updated.thickness = str(payload['thickness'], existing.thickness) ?? existing.thickness;
      const shape = payload['shape'] === 'rect' || payload['shape'] === 'round'
        ? payload['shape'] as 'round' | 'rect'
        : existing.shape;
      updated.shape = shape;
      if (shape === 'round') {
        updated.diameter = str(payload['diameter'], existing.diameter);
        delete updated.width;
        delete updated.height;
      } else {
        updated.width = str(payload['width'], existing.width);
        updated.height = str(payload['height'], existing.height);
        delete updated.diameter;
      }
    }
  }

  const identityChanged =
    updated.name !== existing.name ||
    updated.kind !== existing.kind ||
    updated.diameter !== existing.diameter ||
    updated.size !== existing.size ||
    updated.grade !== existing.grade ||
    updated.shape !== existing.shape ||
    updated.width !== existing.width ||
    updated.height !== existing.height ||
    updated.thickness !== existing.thickness;

  if (identityChanged) {
    const isDuplicate = await materialRepo.checkDuplicate(updated);
    if (isDuplicate) {
      const err: AppError = new Error('This material is already registered');
      err.status = 409;
      throw err;
    }
  }

  const result = await materialRepo.update(id, updated);
  if (!result) throw new Error('Material not found after update');
  return result;
}
