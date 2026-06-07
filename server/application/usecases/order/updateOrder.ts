import type { Order, OrderItem, IMaterialRepository, IOrderRepository } from '../../../types/index.js';
import { getMaterialDisplayName } from '../../../domain/materialName.js';

interface AppError extends Error { status?: number; }

interface RawItem { materialId: string; quantity: number; }

function bad(message: string, status = 400): AppError {
  const err: AppError = new Error(message);
  err.status = status;
  return err;
}

/**
 * Edits a pending order's items, supplier and note. Only pending orders may be
 * edited (an approved order has already affected stock). The caller is
 * responsible for the permission check (creator or admin).
 */
export async function updateOrder(
  id: string,
  payload: Record<string, unknown>,
  { materialRepo, orderRepo }: { materialRepo: IMaterialRepository; orderRepo: IOrderRepository }
): Promise<Order> {
  const existing = await orderRepo.findById(id);
  if (!existing) throw bad('Order not found', 404);
  if (existing.status !== 'pending') throw bad('Only pending orders can be edited', 409);

  const rawItems = Array.isArray(payload['items']) ? (payload['items'] as RawItem[]) : [];
  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    const quantity = Number(raw.quantity);
    if (!raw.materialId || quantity <= 0) continue;
    const material = await materialRepo.findById(String(raw.materialId));
    if (!material) throw bad(`Material not found: ${raw.materialId}`, 404);
    items.push({
      materialId: material.id,
      materialName: getMaterialDisplayName(material),
      quantity,
      unit: material.unit,
    });
  }
  if (!items.length) throw bad('An order must contain at least one item');

  // Keep supplier/note as strings (never undefined) so the $set patch can also
  // clear a previously set value rather than persisting null.
  const patch: Partial<Order> = {
    items,
    supplier: typeof payload['supplier'] === 'string' ? payload['supplier'].trim() : (existing.supplier ?? ''),
    note: typeof payload['note'] === 'string' ? payload['note'].trim() : (existing.note ?? ''),
  };

  const updated = await orderRepo.update(id, patch);
  if (!updated) throw bad('Order not found after update', 404);
  return updated;
}
