import { randomUUID } from 'crypto';
import type { Material } from '../../types/index.js';

export function createPipeFitting({
  diameter,
  kind,
  grade,
  stock = 0,
  minimum = 0,
  id,
}: {
  diameter: string;
  kind: string;
  grade: string;
  stock?: number;
  minimum?: number;
  id?: string;
}): Material {
  if (!diameter || !kind || !grade) throw new Error('diameter, kind, and grade are required');
  const unit = kind === 'Boru' ? 'm' : 'adet';
  return {
    id: id ?? `bf-${randomUUID().slice(0, 8)}`,
    group: 'pipe',
    kind,
    diameter,
    grade,
    stock: Number(stock),
    unit,
    minimum: Number(minimum),
  };
}

export function createOtherMaterial({
  name,
  category,
  unit,
  stock = 0,
  minimum = 0,
  id,
}: {
  name: string;
  category: string;
  unit: string;
  stock?: number;
  minimum?: number;
  id?: string;
}): Material {
  if (!name || !category || !unit) throw new Error('name, category, and unit are required');
  return {
    id: id ?? `dm-${randomUUID().slice(0, 8)}`,
    group: 'other',
    category,
    name: name.trim(),
    stock: Number(stock),
    unit,
    minimum: Number(minimum),
  };
}
