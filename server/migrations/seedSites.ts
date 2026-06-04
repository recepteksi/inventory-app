// Seed the sites collection and backfill siteId on existing data.
// Idempotent: if `sites` is empty a default "Merkez Şantiye" is created; then
// every material / movement / order document that lacks a siteId is stamped
// with the default site id. Safe to run multiple times.
// Run once: node server/migrations/seedSites.ts
import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';
import type { Site, Material, Movement, Order } from '../types/index.js';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const DEFAULT_SITE_NAME = 'Merkez Şantiye';

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  const db = client.db();
  const sites = db.collection<Site>('sites');
  const materials = db.collection<Material>('materials');
  const movements = db.collection<Movement>('movements');
  const orders = db.collection<Order>('orders');

  // 1. Ensure a default site exists.
  const existingSite = await sites.findOne({});
  let siteId: string;
  if (!existingSite) {
    const site: Site = {
      id: `site-${randomUUID().slice(0, 8)}`,
      name: DEFAULT_SITE_NAME,
      createdAt: new Date().toISOString(),
    };
    await sites.insertOne(site);
    siteId = site.id;
    console.log(`Created default site "${site.name}" (${site.id}).`);
  } else {
    siteId = existingSite.id;
    console.log(`Sites collection not empty — using "${existingSite.name}" (${existingSite.id}) for backfill.`);
  }

  const missing = { siteId: { $exists: false } };

  // 2. Backfill siteId on documents that lack it.
  const matRes = await materials.updateMany(missing, { $set: { siteId } });
  const mvRes = await movements.updateMany(missing, { $set: { siteId } });
  const ordRes = await orders.updateMany(missing, { $set: { siteId } });

  console.log(
    `Backfill complete — materials ${matRes.modifiedCount}, movements ${mvRes.modifiedCount}, orders ${ordRes.modifiedCount} updated.`
  );
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
