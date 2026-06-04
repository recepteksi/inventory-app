import type { Db, Filter } from 'mongodb';
import type { Site, ISiteRepository } from '../../types/index.js';

export function createMongoSiteRepository(db: Db): ISiteRepository {
  const col = db.collection<Site>('sites');
  const proj = { projection: { _id: 0 } };
  const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return {
    async findAll(): Promise<Site[]> {
      return col.find({}, proj).toArray() as Promise<Site[]>;
    },

    async findById(id: string): Promise<Site | null> {
      return col.findOne({ id }, proj) as Promise<Site | null>;
    },

    async findByName(name: string): Promise<Site | null> {
      const filter = { name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } };
      return col.findOne(filter as Filter<Site>, proj) as Promise<Site | null>;
    },

    async create(data: Site): Promise<Site> {
      await col.insertOne({ ...data });
      return data;
    },

    async update(id: string, data: Partial<Site>): Promise<Site | null> {
      await col.updateOne({ id }, { $set: data });
      return col.findOne({ id }, proj) as Promise<Site | null>;
    },

    async delete(id: string): Promise<boolean> {
      const result = await col.deleteOne({ id });
      return result.deletedCount > 0;
    },
  };
}
