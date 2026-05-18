export function createMongoMovementRepository(db) {
  const col = db.collection('movements');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll() {
      return col.find({}, proj).toArray();
    },

    async findByMalzemeId(malzemeId) {
      return col.find({ malzemeId }, proj).toArray();
    },

    async findByUstaId(ustaId) {
      return col.find({ ustaId }, proj).toArray();
    },

    async countByMalzemeId(malzemeId) {
      return col.countDocuments({ malzemeId });
    },

    async countByUstaId(ustaId) {
      return col.countDocuments({ ustaId });
    },

    async save(movement) {
      await col.insertOne({ ...movement });
      return movement;
    },
  };
}
