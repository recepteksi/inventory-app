import { randomUUID } from 'crypto';
import type { CatalogEntry, CatalogField, MaterialGroup, ICatalogRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

const SECTIONS: MaterialGroup[] = ['pipe', 'other', 'ventilation', 'isolation'];
const FIELDS: CatalogField[] = ['diameter', 'kind', 'grade', 'category', 'unit', 'thickness'];

export async function createCatalogEntry(
  payload: Record<string, unknown>,
  { catalogRepo }: { catalogRepo: ICatalogRepository }
): Promise<CatalogEntry> {
  const section = payload['section'] as MaterialGroup;
  const field = payload['field'] as CatalogField;
  const value = String(payload['value'] ?? '').trim();

  if (!SECTIONS.includes(section) || !FIELDS.includes(field) || !value) {
    const err: AppError = new Error('section, field, and value are required');
    err.status = 400;
    throw err;
  }

  if (await catalogRepo.exists(section, field, value)) {
    const err: AppError = new Error('This value already exists');
    err.status = 409;
    throw err;
  }

  const entry: CatalogEntry = { id: `cat-${randomUUID().slice(0, 8)}`, section, field, value };
  await catalogRepo.create(entry);
  return entry;
}
