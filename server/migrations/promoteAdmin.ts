// Promote an existing user to the admin (yönetici) role. Run once:
//   node server/migrations/promoteAdmin.ts
// The target username defaults to "admin" and can be overridden with
// ADMIN_USERNAME. Use this when the live "admin" account was created with the
// "normal" role and needs full manager permissions.
import { MongoClient } from 'mongodb';
import type { User } from '../types/index.js';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const username = (process.env['ADMIN_USERNAME'] ?? 'admin').toLowerCase();

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  const db = client.db();
  const users = db.collection<User>('users');

  const existing = await users.findOne({ username });
  if (!existing) {
    console.error(`User "${username}" not found — nothing to promote.`);
    process.exitCode = 1;
    return;
  }
  if (existing.role === 'admin') {
    console.log(`User "${username}" is already an admin — nothing to do.`);
    return;
  }

  await users.updateOne({ username }, { $set: { role: 'admin' } });
  console.log(`Promoted user "${username}" to admin.`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
