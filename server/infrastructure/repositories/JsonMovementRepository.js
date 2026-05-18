import { readFile, writeFile, access } from 'fs/promises';
import { withLock } from './writeLock.js';

async function read(filePath) {
  try {
    await access(filePath);
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { hareketler: [] };
  }
}

async function write(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function createJsonMovementRepository(filePath) {
  return {
    async findAll() {
      const data = await read(filePath);
      return data.hareketler;
    },

    async findByMalzemeId(malzemeId) {
      const data = await read(filePath);
      return data.hareketler.filter((h) => h.malzemeId === malzemeId);
    },

    async findByUstaId(ustaId) {
      const data = await read(filePath);
      return data.hareketler.filter((h) => h.ustaId === ustaId);
    },

    async countByMalzemeId(malzemeId) {
      const data = await read(filePath);
      return data.hareketler.filter((h) => h.malzemeId === malzemeId).length;
    },

    async countByUstaId(ustaId) {
      const data = await read(filePath);
      return data.hareketler.filter((h) => h.ustaId === ustaId).length;
    },

    async save(movement) {
      return withLock(async () => {
        const data = await read(filePath);
        data.hareketler.push(movement);
        await write(filePath, data);
        return movement;
      });
    },
  };
}
