import { createWorker as buildWorker } from '../../../domain/entities/Worker.js';

export async function createWorker(payload, { workerRepo }) {
  const worker = buildWorker(payload);
  return workerRepo.save(worker);
}
