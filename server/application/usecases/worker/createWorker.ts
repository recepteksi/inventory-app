import { createWorker as buildWorker } from '../../../domain/entities/Worker.js';
import type { Worker, IWorkerRepository } from '../../../types/index.js';

export async function createWorker(
  payload: Record<string, unknown>,
  { workerRepo }: { workerRepo: IWorkerRepository }
): Promise<Worker> {
  const worker = buildWorker(payload as Parameters<typeof buildWorker>[0]);
  return workerRepo.create(worker);
}
