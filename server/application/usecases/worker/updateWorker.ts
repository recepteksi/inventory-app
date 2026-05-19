import type { Worker, IWorkerRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function updateWorker(
  id: string,
  payload: Record<string, unknown>,
  { workerRepo }: { workerRepo: IWorkerRepository }
): Promise<Worker> {
  const existing = await workerRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Worker not found');
    err.status = 404;
    throw err;
  }

  const updated: Worker = {
    ...existing,
    name: (typeof payload['name'] === 'string' ? payload['name'].trim() : undefined) || existing.name,
    specialty: (typeof payload['specialty'] === 'string' ? payload['specialty'].trim() : undefined) || existing.specialty,
    startDate: (typeof payload['startDate'] === 'string' ? payload['startDate'] : undefined) || existing.startDate,
  };

  const result = await workerRepo.update(id, updated);
  if (!result) throw new Error('Worker not found after update');
  return result;
}
