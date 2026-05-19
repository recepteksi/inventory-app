import type { IWorkerRepository, IMovementRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function deleteWorker(
  id: string,
  { workerRepo, movementRepo }: { workerRepo: IWorkerRepository; movementRepo: IMovementRepository }
): Promise<void> {
  const existing = await workerRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Worker not found');
    err.status = 404;
    throw err;
  }

  const count = await movementRepo.countByWorkerId(id);
  if (count > 0) {
    const err: AppError = new Error(
      `This worker has ${count} movement records and cannot be deleted.`
    );
    err.status = 409;
    throw err;
  }

  await workerRepo.delete(id);
}
