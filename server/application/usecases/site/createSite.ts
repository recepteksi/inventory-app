import { buildSite } from '../../../domain/entities/Site.js';
import type { Site, ISiteRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function createSite(
  payload: Record<string, unknown>,
  { siteRepo }: { siteRepo: ISiteRepository }
): Promise<Site> {
  const site = buildSite({ name: String(payload['name'] ?? '') });

  if (await siteRepo.findByName(site.name)) {
    const err: AppError = new Error('A site with this name already exists');
    err.status = 409;
    throw err;
  }

  await siteRepo.create(site);
  return site;
}
