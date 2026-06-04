import { getDb } from './_db.js';
import { createMongoMaterialRepository } from '../server/infrastructure/repositories/MongoMaterialRepository.js';
import { createMongoWorkerRepository } from '../server/infrastructure/repositories/MongoWorkerRepository.js';
import { createMongoMovementRepository } from '../server/infrastructure/repositories/MongoMovementRepository.js';
import { createMongoUserRepository } from '../server/infrastructure/repositories/MongoUserRepository.js';
import { createMongoOrderRepository } from '../server/infrastructure/repositories/MongoOrderRepository.js';
import { createMongoCatalogRepository } from '../server/infrastructure/repositories/MongoCatalogRepository.js';
import { createMongoSiteRepository } from '../server/infrastructure/repositories/MongoSiteRepository.js';
import type { Repos } from '../server/types/index.js';

export async function getRepos(): Promise<Repos> {
  const db = await getDb();
  return {
    materialRepo: createMongoMaterialRepository(db),
    workerRepo: createMongoWorkerRepository(db),
    movementRepo: createMongoMovementRepository(db),
    userRepo: createMongoUserRepository(db),
    orderRepo: createMongoOrderRepository(db),
    catalogRepo: createMongoCatalogRepository(db),
    siteRepo: createMongoSiteRepository(db),
  };
}
