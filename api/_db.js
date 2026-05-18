import { MongoClient } from 'mongodb';

let cached = null;

export async function getDb() {
  if (!cached) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI ortam değişkeni tanımlı değil');
    const client = new MongoClient(uri);
    await client.connect();
    cached = client.db();
  }
  return cached;
}
