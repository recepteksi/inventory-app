import { randomUUID } from 'crypto';
import type { Worker } from '../../types/index.js';

export function createWorker({
  name,
  specialty,
  startDate,
  id,
}: {
  name: string;
  specialty: string;
  startDate: string;
  id?: string;
}): Worker {
  if (!name || !specialty || !startDate) throw new Error('name, specialty, and startDate are required');
  return {
    id: id ?? `u-${randomUUID().slice(0, 8)}`,
    name: name.trim(),
    specialty: specialty.trim(),
    startDate,
  };
}
