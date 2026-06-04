// Seed the catalog collection with the default selectable option values.
// Idempotent: skips any value that already exists (case-insensitive) for a
// given section + field. Run once: node server/migrations/seedCatalog.ts
import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';
import type { CatalogEntry, CatalogField, MaterialGroup } from '../types/index.js';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

// Default option values, mirrored from src/presentation/store/defaultOptions.ts.
// Keep these in sync if the frontend defaults change.
const DEFAULTS: Record<MaterialGroup, Partial<Record<CatalogField, string[]>>> = {
  pipe: {
    diameter: ['1"', '2"', '3"', '4"', '6"'],
    kind: ['Boru', 'Dirsek', 'Tee', 'Manşon'],
    grade: ['Siyah', 'Galvaniz', 'Paslanmaz'],
  },
  other: {
    category: ['Elektrod', 'Boya', 'Bağlantı', 'Sarf', 'Diğer'],
    unit: ['adet', 'paket', 'litre', 'kg', 'm'],
  },
  ventilation: {
    kind: ['Kanal', 'Dirsek', 'Flanş', 'Damper', 'Menfez'],
    grade: ['Galvaniz', 'Paslanmaz', 'Alüminyum'],
    diameter: ['100', '125', '160', '200', '250', '315'],
  },
  isolation: {
    kind: ['Taşyünü', 'Camyünü', 'Kauçuk', 'Şilte'],
    grade: ['Düz', 'Folyolu', 'Takviyeli'],
    thickness: ['19', '25', '32', '50'],
    diameter: ['22', '28', '35', '42', '54', '76'],
  },
};

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  const db = client.db();
  const catalog = db.collection<CatalogEntry>('catalog');

  let inserted = 0;
  let skipped = 0;

  for (const section of Object.keys(DEFAULTS) as MaterialGroup[]) {
    const fields = DEFAULTS[section];
    for (const field of Object.keys(fields) as CatalogField[]) {
      const values = fields[field] ?? [];
      for (const value of values) {
        // Case-insensitive duplicate check, matching createCatalogEntry semantics.
        const existing = await catalog.findOne({
          section,
          field,
          value: { $regex: new RegExp(`^${value}$`, 'i') },
        });
        if (existing) {
          skipped += 1;
          continue;
        }
        const entry: CatalogEntry = {
          id: `cat-${randomUUID().slice(0, 8)}`,
          section,
          field,
          value,
        };
        await catalog.insertOne({ ...entry });
        inserted += 1;
      }
    }
  }

  console.log(`Catalog seed complete — inserted ${inserted}, skipped ${skipped} existing.`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
