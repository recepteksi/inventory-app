import type { Db, Filter } from 'mongodb';
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
        ventilation: all.filter((m) => m.group === 'ventilation'),
        isolation: all.filter((m) => m.group === 'isolation'),
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
      const notSelf = { id: { $ne: material.id } };
      let filter: Record<string, unknown>;
      if (material.group === 'pipe' || material.group === 'ventilation') {
        filter = { group: material.group, diameter: material.diameter ?? null, kind: material.kind, grade: material.grade, ...notSelf };
      } else if (material.group === 'isolation') {
        filter = {
          group: 'isolation',
          kind: material.kind,
          shape: material.shape,
          diameter: material.diameter ?? null,
          width: material.width ?? null,
          height: material.height ?? null,
          thickness: material.thickness,
          ...notSelf,
        };
      } else {
        filter = { group: 'other', name: { $regex: new RegExp(`^${material.name ?? ''}$`, 'i') }, ...notSelf };
      }
      return col.findOne(filter as Filter<Material>, proj) as Promise<Material | null>;
    },
  };
}
