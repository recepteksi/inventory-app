import { createUsage as buildUsage } from '../../../domain/entities/Movement.js';
import type { IMaterialRepository, IMovementRepository, MovementResult } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

interface UsagePayload extends Record<string, unknown> {
  materialId: string;
  quantity: number;
  date: string;
  workerId: string;
  jobDescription: string;
}

export async function recordUsage(
  payload: Record<string, unknown>,
  { materialRepo, movementRepo }: { materialRepo: IMaterialRepository; movementRepo: IMovementRepository }
): Promise<MovementResult> {
  const p = payload as UsagePayload;

  const material = await materialRepo.findById(p.materialId);
  if (!material) {
    const err: AppError = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  if (Number(p.quantity) > material.stock) {
    const err: AppError = new Error(
      `Insufficient stock. Available: ${material.stock} ${material.unit}`
    );
    err.status = 400;
    throw err;
  }

  const movement = buildUsage(p);
  await movementRepo.create(movement);

  const updatedMaterial = await materialRepo.updateStock(
    material.id,
    material.stock - movement.quantity
  );

  return { movement, updatedMaterial };
}
