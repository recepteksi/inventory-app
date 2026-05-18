import { readFile, writeFile, access } from 'fs/promises';
import { withLock } from './writeLock.js';

const EMPTY = { boruFittings: [], digerMalzeme: [] };

async function read(filePath) {
  try {
    await access(filePath);
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { ...EMPTY };
  }
}

async function write(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function createJsonMaterialRepository(filePath) {
  return {
    async findAll() {
      return read(filePath);
    },

    async findById(id) {
      const data = await read(filePath);
      return (
        data.boruFittings.find((m) => m.id === id) ||
        data.digerMalzeme.find((m) => m.id === id) ||
        null
      );
    },

    async save(material) {
      return withLock(async () => {
        const data = await read(filePath);
        if (material.grup === 'boru') {
          data.boruFittings.push(material);
        } else {
          data.digerMalzeme.push(material);
        }
        await write(filePath, data);
        return material;
      });
    },

    async update(material) {
      return withLock(async () => {
        const data = await read(filePath);
        const updateInList = (list) =>
          list.map((m) => (m.id === material.id ? { ...m, ...material } : m));
        data.boruFittings = updateInList(data.boruFittings);
        data.digerMalzeme = updateInList(data.digerMalzeme);
        await write(filePath, data);
        return material;
      });
    },

    async updateStock(id, newStok) {
      return withLock(async () => {
        const data = await read(filePath);
        let updated = null;
        data.boruFittings = data.boruFittings.map((m) => {
          if (m.id !== id) return m;
          updated = { ...m, stok: newStok };
          return updated;
        });
        if (!updated) {
          data.digerMalzeme = data.digerMalzeme.map((m) => {
            if (m.id !== id) return m;
            updated = { ...m, stok: newStok };
            return updated;
          });
        }
        await write(filePath, data);
        return updated;
      });
    },

    async delete(id) {
      return withLock(async () => {
        const data = await read(filePath);
        data.boruFittings = data.boruFittings.filter((m) => m.id !== id);
        data.digerMalzeme = data.digerMalzeme.filter((m) => m.id !== id);
        await write(filePath, data);
      });
    },

    async checkDuplicate(material) {
      const data = await read(filePath);
      if (material.grup === 'boru') {
        return data.boruFittings.some(
          (m) =>
            m.cap === material.cap &&
            m.tur === material.tur &&
            m.cins === material.cins &&
            m.id !== material.id
        );
      }
      return data.digerMalzeme.some(
        (m) =>
          m.ad.toLowerCase() === material.ad.toLowerCase() && m.id !== material.id
      );
    },
  };
}
