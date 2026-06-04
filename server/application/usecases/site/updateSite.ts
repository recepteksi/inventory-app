import type { Site, ISiteRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function updateSite(
  id: string,
  payload: Record<string, unknown>,
  { siteRepo }: { siteRepo: ISiteRepository }
): Promise<Site> {
  const existing = await siteRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Site not found');
    err.status = 404;
    throw err;
  }

  const name = String(payload['name'] ?? '').trim();
  if (!name) {
    const err: AppError = new Error('Site name is required');
    err.status = 400;
    throw err;
  }

  const duplicate = await siteRepo.findByName(name);
  if (duplicate && duplicate.id !== id) {
    const err: AppError = new Error('A site with this name already exists');
    err.status = 409;
    throw err;
  }

  const updated = await siteRepo.update(id, { name });
  if (!updated) {
    const err: AppError = new Error('Site not found');
    err.status = 404;
    throw err;
  }
  return updated;
}
