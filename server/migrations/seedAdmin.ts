// Create the first admin user. Run once: node server/migrations/seedAdmin.ts
// Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_NAME env vars,
// falling back to admin / admin123 / "Yönetici".
import { MongoClient } from 'mongodb';
import { buildUser } from '../domain/entities/User.js';
import { hashPassword } from '../infrastructure/security/password.js';
import type { User } from '../types/index.js';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const username = process.env['ADMIN_USERNAME'] ?? 'admin';
const password = process.env['ADMIN_PASSWORD'] ?? 'admin123';
const name = process.env['ADMIN_NAME'] ?? 'Yönetici';

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  const db = client.db();
  const users = db.collection<User>('users');

  const existing = await users.findOne({ username: username.toLowerCase() });
  if (existing) {
    console.log(`User "${username}" already exists — nothing to do.`);
    return;
  }

  const admin = buildUser({ username, name, role: 'admin', passwordHash: hashPassword(password) });
  await users.insertOne(admin);
  console.log(`Created admin user "${username}". Change the password after first login.`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
