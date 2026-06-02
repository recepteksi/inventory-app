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
  items,
  orderDate,
  supplier,
  note,
  createdBy,
  id,
}: {
  items: OrderItem[];
  orderDate: string;
  supplier?: string;
  note?: string;
  createdBy: string;
  id?: string;
}): Order {
  if (!items.length) throw bad('An order must contain at least one item');
  if (!orderDate) throw bad('orderDate is required');
  // ISO date strings compare lexicographically — guard against past dates.
  if (orderDate < todayIsoDate()) throw bad('Order date cannot be in the past');
  if (items.some((i) => !i.materialId || i.quantity <= 0)) throw bad('Each item needs a material and a positive quantity');

  const order: Order = {
    id: id ?? `ord-${randomUUID().slice(0, 8)}`,
    items,
    status: 'pending',
    orderDate,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  if (supplier) order.supplier = supplier;
  if (note) order.note = note;
  return order;
}
