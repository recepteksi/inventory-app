import type { Db } from 'mongodb';
import type { Worker, IWorkerRepository } from '../../types/index.js';

export function createMongoWorkerRepository(db: Db): IWorkerRepository {
  const col = db.collection<Worker>('workers');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<Worker[]> {
      return col.find({}, proj).toArray() as Promise<Worker[]>;
    },

    async findById(id: string): Promise<Worker | null> {
      return col.findOne({ id }, proj) as Promise<Worker | null>;
    },

    async create(data: Partial<Worker>): Promise<Worker> {
      const worker = data as Worker;
      await col.insertOne({ ...worker });
      return worker;
    },

    async update(id: string, data: Partial<Worker>): Promise<Worker | null> {
      await col.updateOne({ id }, { $set: data });
      return col.findOne({ id }, proj) as Promise<Worker | null>;
    },

    async delete(id: string): Promise<void> {
      await col.deleteOne({ id });
    },
  };
}
