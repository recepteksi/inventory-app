import type { IMaterialRepository, IMovementRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function deleteMaterial(
  id: string,
  { materialRepo, movementRepo }: { materialRepo: IMaterialRepository; movementRepo: IMovementRepository }
): Promise<void> {
  const existing = await materialRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  const count = await movementRepo.countByMaterialId(id);
  if (count > 0) {
    const err: AppError = new Error(
      `This material has ${count} movement records and cannot be deleted.`
    );
    err.status = 409;
    throw err;
  }

  await materialRepo.delete(id);
}
