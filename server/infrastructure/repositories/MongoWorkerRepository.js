export function createMongoWorkerRepository(db) {
  const col = db.collection('workers');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll() {
      return col.find({}, proj).toArray();
    },

    async findById(id) {
      return col.findOne({ id }, proj);
    },

    async save(worker) {
      await col.insertOne({ ...worker });
      return worker;
    },

    async update(worker) {
      await col.updateOne({ id: worker.id }, { $set: worker });
      return worker;
    },

    async delete(id) {
      await col.deleteOne({ id });
    },
  };
}
