// Run once before deploying the renamed codebase: node server/migrations/renameFields.ts
import { MongoClient } from 'mongodb';

const uri = process.env['MONGODB_URI'];
if (!uri) {
  console.error('MONGODB_URI environment variable is not defined');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run(): Promise<void> {
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db();

  // --- materials collection ---
  const materials = db.collection('materials');

  console.log('Renaming fields in materials...');
  await materials.updateMany({}, {
    $rename: {
      grup: 'group',
      ad: 'name',
      kategori: 'category',
      cap: 'diameter',
      tur: 'kind',
      cins: 'grade',
      stok: 'stock',
      birim: 'unit',
    },
  });

  console.log("Updating group enum values: 'boru' -> 'pipe'");
  await materials.updateMany({ group: 'boru' }, { $set: { group: 'pipe' } });

  console.log("Updating group enum values: 'diger' -> 'other'");
  await materials.updateMany({ group: 'diger' }, { $set: { group: 'other' } });

  // --- workers collection ---
  const workers = db.collection('workers');

  console.log('Renaming fields in workers...');
  await workers.updateMany({}, {
    $rename: {
      ad: 'name',
      uzmanlik: 'specialty',
      baslangic: 'startDate',
    },
  });

  // --- movements collection ---
  const movements = db.collection('movements');

  console.log('Renaming fields in movements...');
  await movements.updateMany({}, {
    $rename: {
      malzemeId: 'materialId',
      ustaId: 'workerId',
      tip: 'type',
      miktar: 'quantity',
      tarih: 'date',
      tedarikci: 'supplier',
      fis: 'receiptNo',
      is: 'jobDescription',
      not: 'note',
    },
  });

  console.log("Updating type enum values: 'gelis' -> 'delivery'");
  await movements.updateMany({ type: 'gelis' }, { $set: { type: 'delivery' } });

  console.log("Updating type enum values: 'kullanim' -> 'usage'");
  await movements.updateMany({ type: 'kullanim' }, { $set: { type: 'usage' } });

  console.log('Migration complete.');
}

run()
  .catch((err: unknown) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => client.close());
