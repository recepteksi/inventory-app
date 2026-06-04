import type { Db } from 'mongodb';
import type { Order, IOrderRepository } from '../../types/index.js';

export function createMongoOrderRepository(db: Db): IOrderRepository {
  const col = db.collection<Order>('orders');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<Order[]> {
      return col.find({}, proj).toArray() as Promise<Order[]>;
    },

    async findById(id: string): Promise<Order | null> {
      return col.findOne({ id }, proj) as Promise<Order | null>;
    },

    async countByMaterialId(materialId: string): Promise<number> {
      return col.countDocuments({ 'items.materialId': materialId });
    },

    async create(data: Order): Promise<Order> {
      await col.insertOne({ ...data });
      return data;
    },

    async update(id: string, data: Partial<Order>): Promise<Order | null> {
      await col.updateOne({ id }, { $set: data });
      return col.findOne({ id }, proj) as Promise<Order | null>;
    },

    async delete(id: string): Promise<boolean> {
      const result = await col.deleteOne({ id });
      return result.deletedCount > 0;
    },
  };
}
