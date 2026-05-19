import { MongoClient, type Db } from 'mongodb';

let cached: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!cached) {
    const uri = process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGODB_URI environment variable is not defined');
    const client = new MongoClient(uri);
    await client.connect();
    cached = client.db();
  }
  return cached;
}
