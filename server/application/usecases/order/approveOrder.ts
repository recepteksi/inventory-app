import { recordDelivery } from '../movement/recordDelivery.js';
import { todayIsoDate } from '../../../domain/entities/Order.js';
import type { Order, IMaterialRepository, IMovementRepository, IOrderRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

/**
 * Approves a pending order: each ordered item is delivered into stock (a
 * delivery movement is recorded) and the order is marked approved. Idempotent —
 * an already-approved order is rejected so stock is never added twice.
 */
export async function approveOrder(
  id: string,
  approvedBy: string,
  deliveryDate: string,
  { materialRepo, movementRepo, orderRepo }: {
    materialRepo: IMaterialRepository;
    movementRepo: IMovementRepository;
    orderRepo: IOrderRepository;
  }
): Promise<Order> {
  const order = await orderRepo.findById(id);
  if (!order) {
    const err: AppError = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (order.status === 'approved') {
    const err: AppError = new Error('Order is already approved');
    err.status = 409;
    throw err;
  }

  // The delivery deadline (termin) is required and must be in the future.
  if (!deliveryDate) {
    const err: AppError = new Error('Teslim (termin) tarihi gereklidir');
    err.status = 400;
    throw err;
  }
  if (deliveryDate <= todayIsoDate()) {
    const err: AppError = new Error('Termin tarihi ileri bir tarih olmalıdır');
    err.status = 400;
    throw err;
  }

  const date = todayIsoDate();
  for (const item of order.items) {
    await recordDelivery(
      {
        materialId: item.materialId,
        quantity: item.quantity,
        date,
        supplier: order.supplier ?? '',
        _note: `Order ${order.id} approved`,
      },
      { materialRepo, movementRepo }
    );
  }

  const updated = await orderRepo.update(id, { status: 'approved', approvedAt: new Date().toISOString(), approvedBy, deliveryDate });
  if (!updated) throw new Error('Order not found after approval');
  return updated;
}
