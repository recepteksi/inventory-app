import { randomUUID } from 'crypto';
import type { Order, OrderItem } from '../../types/index.js';

interface AppError extends Error { status?: number; }

function bad(message: string): AppError {
  const err: AppError = new Error(message);
  err.status = 400;
  return err;
}

/** Today's date as an ISO date string (YYYY-MM-DD) in the server timezone. */
export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildOrder({
  siteId,
  items,
  orderDate,
  supplier,
  note,
  createdBy,
  createdById,
  id,
}: {
  siteId: string;
  items: OrderItem[];
  orderDate: string;
  supplier?: string;
  note?: string;
  createdBy: string;
  createdById?: string;
  id?: string;
}): Order {
  if (!items.length) throw bad('An order must contain at least one item');
  if (!siteId) throw bad('siteId is required');
  if (!orderDate) throw bad('orderDate is required');
  // orderDate is the creation date (set server-side to today); the delivery
  // deadline (termin) is chosen later by the admin on approval.
  if (items.some((i) => !i.materialId || i.quantity <= 0)) throw bad('Each item needs a material and a positive quantity');

  const order: Order = {
    id: id ?? `ord-${randomUUID().slice(0, 8)}`,
    siteId,
    items,
    status: 'pending',
    orderDate,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  if (createdById) order.createdById = createdById;
  if (supplier) order.supplier = supplier;
  if (note) order.note = note;
  return order;
}
