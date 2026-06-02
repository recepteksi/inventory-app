import type { Db } from 'mongodb';
import type { User, IUserRepository } from '../../types/index.js';

export function createMongoUserRepository(db: Db): IUserRepository {
  const col = db.collection<User>('users');
  const proj = { projection: { _id: 0 } };

  return {
    async findAll(): Promise<User[]> {
      return col.find({}, proj).toArray() as Promise<User[]>;
    },

    async findById(id: string): Promise<User | null> {
      return col.findOne({ id }, proj) as Promise<User | null>;
    },

    async findByUsername(username: string): Promise<User | null> {
      return col.findOne(
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        proj
      ) as Promise<User | null>;
    },

    async create(data: User): Promise<User> {
      await col.insertOne({ ...data });
      return data;
    },

    async update(id: string, data: Partial<User>): Promise<User | null> {
      await col.updateOne({ id }, { $set: data });
      return col.findOne({ id }, proj) as Promise<User | null>;
    },

    async delete(id: string): Promise<void> {
      await col.deleteOne({ id });
    },

    async count(): Promise<number> {
      return col.countDocuments({});
    },
  };
}
