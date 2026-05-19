import { createPipeFitting, createOtherMaterial } from '../../../domain/entities/Material.js';
import { recordDelivery } from '../movement/recordDelivery.js';
import type { Material, IMaterialRepository, IMovementRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function createMaterial(
  payload: Record<string, unknown>,
  { materialRepo, movementRepo }: { materialRepo: IMaterialRepository; movementRepo: IMovementRepository }
): Promise<Material> {
  const material =
    payload['group'] === 'pipe'
      ? createPipeFitting(payload as Parameters<typeof createPipeFitting>[0])
      : createOtherMaterial(payload as Parameters<typeof createOtherMaterial>[0]);

  const isDuplicate = await materialRepo.checkDuplicate(material);
  if (isDuplicate) {
    const err: AppError = new Error('This material is already registered');
    err.status = 409;
    throw err;
  }

  await materialRepo.create(material);

  const openingStock = Number(payload['openingStock']) || 0;
  if (openingStock > 0) {
    await recordDelivery(
      {
        materialId: material.id,
        quantity: openingStock,
        date: new Date().toISOString().slice(0, 10),
        supplier: '',
        receiptNo: '',
        _note: 'Opening stock',
      },
      { materialRepo, movementRepo }
    );
  }

  const found = await materialRepo.findById(material.id);
  if (!found) throw new Error('Material not found after creation');
  return found;
}
