export function createMongoMaterialRepository(db) {
  const col = db.collection('materials');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll() {
      const all = await col.find({}, proj).toArray();
      return {
        boruFittings: all.filter((m) => m.grup === 'boru'),
        digerMalzeme: all.filter((m) => m.grup === 'diger'),
      };
    },

    async findById(id) {
      return col.findOne({ id }, proj);
    },

    async save(material) {
      await col.insertOne({ ...material });
      return material;
    },

    async update(material) {
      await col.updateOne({ id: material.id }, { $set: material });
      return material;
    },

    async updateStock(id, newStok) {
      return col.findOneAndUpdate(
        { id },
        { $set: { stok: newStok } },
        { returnDocument: 'after', projection: { _id: 0 } }
      );
    },

    async delete(id) {
      await col.deleteOne({ id });
    },

    async checkDuplicate(material) {
      if (material.grup === 'boru') {
        const count = await col.countDocuments({
          grup: 'boru',
          cap: material.cap,
          tur: material.tur,
          cins: material.cins,
          id: { $ne: material.id },
        });
        return count > 0;
      }
      const count = await col.countDocuments({
        grup: 'diger',
        ad: { $regex: new RegExp(`^${material.ad}$`, 'i') },
        id: { $ne: material.id },
      });
      return count > 0;
    },
  };
}
