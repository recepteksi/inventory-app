import { readFile, writeFile, access } from 'fs/promises';
import { withLock } from './writeLock.js';

async function read(filePath) {
  try {
    await access(filePath);
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { ustalar: [] };
  }
}

async function write(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function createJsonWorkerRepository(filePath) {
  return {
    async findAll() {
      const data = await read(filePath);
      return data.ustalar;
    },

    async findById(id) {
      const data = await read(filePath);
      return data.ustalar.find((u) => u.id === id) || null;
    },

    async save(worker) {
      return withLock(async () => {
        const data = await read(filePath);
        data.ustalar.push(worker);
        await write(filePath, data);
        return worker;
      });
    },

    async update(worker) {
      return withLock(async () => {
        const data = await read(filePath);
        data.ustalar = data.ustalar.map((u) =>
          u.id === worker.id ? { ...u, ...worker } : u
        );
        await write(filePath, data);
        return worker;
      });
    },

    async delete(id) {
      return withLock(async () => {
        const data = await read(filePath);
        data.ustalar = data.ustalar.filter((u) => u.id !== id);
        await write(filePath, data);
      });
    },
  };
}
