import { randomUUID } from 'crypto';
import type { Movement } from '../../types/index.js';

export function createDelivery({
  materialId,
  quantity,
  date,
  supplier,
  receiptNo,
}: {
  materialId: string;
  quantity: number;
  date: string;
  supplier?: string;
  receiptNo?: string;
}): Movement {
  if (!materialId || !quantity || !date) throw new Error('materialId, quantity, and date are required');
  const mv: Movement = {
    id: `mv-${randomUUID().slice(0, 8)}`,
    materialId,
    type: 'delivery',
    quantity: Number(quantity),
    date,
  };
  if (supplier) mv.note = `Supplier: ${supplier}`;
  if (receiptNo) mv.receiptNo = receiptNo;
  return mv;
}

export function createUsage({
  materialId,
  quantity,
  date,
  workerId,
  jobDescription,
}: {
  materialId: string;
  quantity: number;
  date: string;
  workerId: string;
  jobDescription: string;
}): Movement {
  if (!materialId || !quantity || !date || !workerId || !jobDescription) {
    throw new Error('materialId, quantity, date, workerId, and jobDescription are required');
  }
  return {
    id: `mv-${randomUUID().slice(0, 8)}`,
    materialId,
    type: 'usage',
    quantity: Number(quantity),
    date,
    workerId,
    jobDescription: jobDescription.trim(),
  };
}
