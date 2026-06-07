// Backfill the `order` field on existing catalog entries so they can be
// reordered in the UI. Entries are numbered 0..n within each (section, field)
// group, preserving their current value-sorted order. Idempotent: entries that
// already have an order are left untouched. Run once:
//   node server/migrations/seedCatalogOrder.ts
import { MongoClient } from 'mongodb';
import type { CatalogEntry } from '../types/index.js';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  const db = client.db();
  const catalog = db.collection<CatalogEntry>('catalog');

  const all = (await catalog.find({}).toArray()) as CatalogEntry[];

  // Bucket by section + field.
  const groups = new Map<string, CatalogEntry[]>();
  for (const c of all) {
    const key = `${c.section}::${c.field}`;
    const list = groups.get(key) ?? [];
    list.push(c);
    groups.set(key, list);
  }

  let updated = 0;
  for (const list of groups.values()) {
    // Keep existing explicit order first, then fall back to value ordering.
    list.sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.value.localeCompare(b.value, 'tr');
    });
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].order === i) continue;
      await catalog.updateOne({ id: list[i].id }, { $set: { order: i } });
      updated += 1;
    }
  }

  console.log(`Catalog order backfill complete — updated ${updated} entries.`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
