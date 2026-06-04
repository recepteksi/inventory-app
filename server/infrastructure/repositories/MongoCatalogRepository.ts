import type { Db, Filter } from 'mongodb';
import type { CatalogEntry, ICatalogRepository } from '../../types/index.js';

export function createMongoCatalogRepository(db: Db): ICatalogRepository {
  const col = db.collection<CatalogEntry>('catalog');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<CatalogEntry[]> {
      return col.find({}, proj).toArray() as Promise<CatalogEntry[]>;
    },

    async findById(id: string): Promise<CatalogEntry | null> {
      return col.findOne({ id }, proj) as Promise<CatalogEntry | null>;
    },

    async create(data: CatalogEntry): Promise<CatalogEntry> {
      await col.insertOne({ ...data });
      return data;
    },

    async delete(id: string): Promise<boolean> {
      const result = await col.deleteOne({ id });
      return result.deletedCount > 0;
    },

    async exists(section: string, field: string, value: string): Promise<boolean> {
      const filter: Record<string, unknown> = {
        section,
        field,
        value: { $regex: new RegExp(`^${value}$`, 'i') },
      };
      const found = await col.findOne(filter as Filter<CatalogEntry>);
      return found !== null;
    },
  };
}
