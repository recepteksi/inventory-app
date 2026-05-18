import { getDb } from './_db.js';
import { createMongoMaterialRepository } from '../server/infrastructure/repositories/MongoMaterialRepository.js';
import { createMongoWorkerRepository } from '../server/infrastructure/repositories/MongoWorkerRepository.js';
import { createMongoMovementRepository } from '../server/infrastructure/repositories/MongoMovementRepository.js';

export async function getRepos() {
  const db = await getDb();
  return {
    materialRepo: createMongoMaterialRepository(db),
    workerRepo: createMongoWorkerRepository(db),
    movementRepo: createMongoMovementRepository(db),
  };
}
