import type { Db } from 'mongodb';
import type { Movement, IMovementRepository } from '../../types/index.js';

export function createMongoMovementRepository(db: Db): IMovementRepository {
  const col = db.collection<Movement>('movements');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(siteId?: string): Promise<Movement[]> {
      const filter = siteId ? { siteId } : {};
      return col.find(filter, proj).toArray() as Promise<Movement[]>;
    },

    async findByMaterialId(materialId: string): Promise<Movement[]> {
      return col.find({ materialId }, proj).toArray() as Promise<Movement[]>;
    },

    async findByWorkerId(workerId: string, siteId?: string): Promise<Movement[]> {
      const filter = siteId ? { workerId, siteId } : { workerId };
      return col.find(filter, proj).toArray() as Promise<Movement[]>;
    },

    async existsBySite(siteId: string): Promise<boolean> {
      return (await col.countDocuments({ siteId }, { limit: 1 })) > 0;
    },

    async countByMaterialId(materialId: string): Promise<number> {
      return col.countDocuments({ materialId });
    },

    async countByWorkerId(workerId: string): Promise<number> {
      return col.countDocuments({ workerId });
    },

    async create(data: Movement): Promise<Movement> {
      await col.insertOne({ ...data });
      return data;
    },
  };
}
