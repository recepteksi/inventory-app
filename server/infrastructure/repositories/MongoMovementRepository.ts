import type { Db } from 'mongodb';
import type { Movement, IMovementRepository } from '../../types/index.js';

export function createMongoMovementRepository(db: Db): IMovementRepository {
  const col = db.collection<Movement>('movements');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<Movement[]> {
      return col.find({}, proj).toArray() as Promise<Movement[]>;
    },

    async findByMaterialId(materialId: string): Promise<Movement[]> {
      return col.find({ materialId }, proj).toArray() as Promise<Movement[]>;
    },

    async findByWorkerId(workerId: string): Promise<Movement[]> {
      return col.find({ workerId }, proj).toArray() as Promise<Movement[]>;
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
