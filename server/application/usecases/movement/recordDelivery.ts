import { createDelivery as buildDelivery } from '../../../domain/entities/Movement.js';
import type { IMaterialRepository, IMovementRepository, MovementResult } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

interface DeliveryPayload extends Record<string, unknown> {
  materialId: string;
  quantity: number;
  date: string;
  supplier?: string;
  receiptNo?: string;
  _note?: string;
}

export async function recordDelivery(
  payload: Record<string, unknown>,
  { materialRepo, movementRepo }: { materialRepo: IMaterialRepository; movementRepo: IMovementRepository }
): Promise<MovementResult> {
  const p = payload as DeliveryPayload;

  const material = await materialRepo.findById(p.materialId);
  if (!material) {
    const err: AppError = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  const movement = buildDelivery(p);
  if (p._note) movement.note = p._note;
  await movementRepo.create(movement);

  const updatedMaterial = await materialRepo.updateStock(
    material.id,
    material.stock + movement.quantity
  );

  return { movement, updatedMaterial };
}
