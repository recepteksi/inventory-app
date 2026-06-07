import type { Db, Filter } from 'mongodb';
import type { CatalogEntry, ICatalogRepository } from '../../types/index.js';

export function createMongoCatalogRepository(db: Db): ICatalogRepository {
  const col = db.collection<CatalogEntry>('catalog');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<CatalogEntry[]> {
      const entries = (await col.find({}, proj).toArray()) as CatalogEntry[];
      // Sort by explicit order within a (section, field) group; entries without an
      // order (pre-migration) fall back to their value so output stays stable.
      return entries.sort((a, b) => {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        return a.value.localeCompare(b.value, 'tr');
      });
    },

    async findById(id: string): Promise<CatalogEntry | null> {
      return col.findOne({ id }, proj) as Promise<CatalogEntry | null>;
    },

    async create(data: CatalogEntry): Promise<CatalogEntry> {
      // New values go to the end of their (section, field) group.
      if (data.order === undefined) {
        const last = await col
          .find({ section: data.section, field: data.field })
          .sort({ order: -1 })
          .limit(1)
          .next();
        data = { ...data, order: ((last?.order ?? -1) as number) + 1 };
      }
      await col.insertOne({ ...data });
      return data;
    },

    async update(id: string, data: Partial<CatalogEntry>): Promise<CatalogEntry | null> {
      const { id: _omit, ...patch } = data;
      void _omit;
      await col.updateOne({ id }, { $set: patch });
      return col.findOne({ id }, proj) as Promise<CatalogEntry | null>;
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
