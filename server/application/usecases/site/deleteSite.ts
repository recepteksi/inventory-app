import type {
  ISiteRepository,
  IMaterialRepository,
  IMovementRepository,
  IOrderRepository,
} from '../../../types/index.js';

interface AppError extends Error { status?: number; }

/**
 * Deletes a site (şantiye). Refuses (409) when any material, movement, or order
 * still references it — the data must be removed or reassigned first.
 */
export async function deleteSite(
  id: string,
  {
    siteRepo,
    materialRepo,
    movementRepo,
    orderRepo,
  }: {
    siteRepo: ISiteRepository;
    materialRepo: IMaterialRepository;
    movementRepo: IMovementRepository;
    orderRepo: IOrderRepository;
  }
): Promise<void> {
  const existing = await siteRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('Site not found');
    err.status = 404;
    throw err;
  }

  if (await materialRepo.existsBySite(id)) {
    const err: AppError = new Error('This site has materials and cannot be deleted.');
    err.status = 409;
    throw err;
  }
  if (await movementRepo.existsBySite(id)) {
    const err: AppError = new Error('This site has movements and cannot be deleted.');
    err.status = 409;
    throw err;
  }
  if (await orderRepo.existsBySite(id)) {
    const err: AppError = new Error('This site has orders and cannot be deleted.');
    err.status = 409;
    throw err;
  }

  await siteRepo.delete(id);
}
