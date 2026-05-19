import type { Db } from 'mongodb';
import type { Material, MaterialsResponse, IMaterialRepository } from '../../types/index.js';

export function createMongoMaterialRepository(db: Db): IMaterialRepository {
  const col = db.collection<Material>('materials');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<MaterialsResponse> {
      const all = await col.find({}, proj).toArray() as Material[];
      return {
        pipeFittings: all.filter((m) => m.group === 'pipe'),
        otherMaterials: all.filter((m) => m.group === 'other'),
      };
    },

    async findById(id: string): Promise<Material | null> {
      return col.findOne({ id }, proj) as Promise<Material | null>;
    },

    async create(data: Partial<Material>): Promise<Material> {
      const material = data as Material;
      await col.insertOne({ ...material });
      return material;
    },

    async update(id: string, data: Partial<Material>): Promise<Material | null> {
      await col.updateOne({ id }, { $set: data });
      return col.findOne({ id }, proj) as Promise<Material | null>;
    },

    async updateStock(id: string, newStock: number): Promise<Material> {
      const result = await col.findOneAndUpdate(
        { id },
        { $set: { stock: newStock } },
        { returnDocument: 'after', projection: { _id: 0 } }
      );
      return result as unknown as Material;
    },

    async delete(id: string): Promise<void> {
      await col.deleteOne({ id });
    },

    async checkDuplicate(material: Partial<Material>): Promise<Material | null> {
      if (material.group === 'pipe') {
        const found = await col.findOne(
          {
            group: 'pipe',
            diameter: material.diameter,
            kind: material.kind,
            grade: material.grade,
            id: { $ne: material.id },
          },
          proj
        );
        return found as Material | null;
      }
      const found = await col.findOne(
        {
          group: 'other',
          name: { $regex: new RegExp(`^${material.name ?? ''}$`, 'i') },
          id: { $ne: material.id },
        },
        proj
      );
      return found as Material | null;
    },
  };
}
