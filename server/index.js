import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { createJsonMaterialRepository } from './infrastructure/repositories/JsonMaterialRepository.js';
import { createJsonWorkerRepository } from './infrastructure/repositories/JsonWorkerRepository.js';
import { createJsonMovementRepository } from './infrastructure/repositories/JsonMovementRepository.js';
import { createMaterialRouter } from './presentation/routes/materials.js';
import { createWorkerRouter } from './presentation/routes/workers.js';
import { createMovementRouter } from './presentation/routes/movements.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DIST_DIR = join(__dirname, '..', 'dist');

// Ensure data directory exists before any repo tries to write
await mkdir(DATA_DIR, { recursive: true });

const materialRepo = createJsonMaterialRepository(join(DATA_DIR, 'materials.json'));
const workerRepo = createJsonWorkerRepository(join(DATA_DIR, 'workers.json'));
const movementRepo = createJsonMovementRepository(join(DATA_DIR, 'movements.json'));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/materials', createMaterialRouter({ materialRepo, movementRepo }));
app.use('/api/workers', createWorkerRouter({ workerRepo, movementRepo }));
app.use('/api/movements', createMovementRouter({ materialRepo, movementRepo }));

// Serve the built React app in production (after running `npm run build`)
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // SPA fallback — all non-API routes return index.html (Express 5 uses app.use for wildcard)
  app.use((_req, res) => res.sendFile(join(DIST_DIR, 'index.html')));
}

const PORT = process.env.PORT || 3001;
const hasFrontend = existsSync(DIST_DIR);
app.listen(PORT, () => {
  console.log(`Atolye API sunucusu http://localhost:${PORT} adresinde çalışıyor`);
  if (hasFrontend) {
    console.log(`Arayüz:          http://localhost:${PORT}`);
  } else {
    console.log(`Arayüz yok — önce 'npm run build' çalıştırın`);
  }
});
