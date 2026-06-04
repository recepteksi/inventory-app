import { buildOrder } from '../../../domain/entities/Order.js';
import { notifyOrderCreated } from '../../../infrastructure/notify.js';
import type { Order, OrderItem, IMaterialRepository, IOrderRepository } from '../../../types/index.js';
import { getMaterialDisplayName } from '../../../domain/materialName.js';

interface AppError extends Error { status?: number; }

interface RawItem { materialId: string; quantity: number; }

export async function createOrder(
  payload: Record<string, unknown>,
  createdBy: string,
  createdById: string,
  { materialRepo, orderRepo }: { materialRepo: IMaterialRepository; orderRepo: IOrderRepository }
): Promise<Order> {
  const rawItems = Array.isArray(payload['items']) ? (payload['items'] as RawItem[]) : [];
  const siteId = String(payload['siteId'] ?? '');
  const orderDate = String(payload['orderDate'] ?? '');
  const supplier = typeof payload['supplier'] === 'string' ? payload['supplier'].trim() : undefined;
  const note = typeof payload['note'] === 'string' ? payload['note'].trim() : undefined;

  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    const quantity = Number(raw.quantity);
    if (!raw.materialId || quantity <= 0) continue;
    const material = await materialRepo.findById(String(raw.materialId));
    if (!material) {
      const err: AppError = new Error(`Material not found: ${raw.materialId}`);
      err.status = 404;
      throw err;
    }
    items.push({
      materialId: material.id,
      materialName: getMaterialDisplayName(material),
      quantity,
      unit: material.unit,
    });
  }

  const order = buildOrder({ siteId, items, orderDate, supplier, note, createdBy, createdById });
  await orderRepo.create(order);
  await notifyOrderCreated(order);
  return order;
}
