import { randomUUID } from 'crypto';
import type { Material } from '../../types/index.js';

/**
 * Parses an optional minimum-stock value.
 * Empty / undefined means the material is not low-stock tracked → returns undefined.
 */
export function parseMinimum(minimum: unknown): number | undefined {
  if (minimum === undefined || minimum === null || minimum === '') return undefined;
  const n = Number(minimum);
  return Number.isFinite(n) ? n : undefined;
}

export function createPipeFitting({
  siteId,
  diameter,
  size,
  kind,
  grade,
  stock = 0,
  minimum,
  id,
}: {
  siteId: string;
  diameter?: string;
  size?: string;
  kind: string;
  grade: string;
  stock?: number;
  minimum?: unknown;
  id?: string;
}): Material {
  // Either a standard diameter or a free-text special size identifies the item.
  if ((!diameter && !size) || !kind || !grade) {
    throw new Error('diameter (or size), kind, and grade are required');
  }
  if (!siteId) throw new Error('siteId is required');
  const unit = kind === 'Boru' ? 'm' : 'adet';
  const material: Material = {
    id: id ?? `bf-${randomUUID().slice(0, 8)}`,
    siteId,
    group: 'pipe',
    kind,
    grade,
    stock: Number(stock),
    unit,
    minimum: parseMinimum(minimum),
  };
  if (diameter) material.diameter = diameter;
  if (size) material.size = size;
  return material;
}

export function createOtherMaterial({
  siteId,
  name,
  category,
  unit,
  stock = 0,
  minimum,
  id,
}: {
  siteId: string;
  name: string;
  category: string;
  unit: string;
  stock?: number;
  minimum?: unknown;
  id?: string;
}): Material {
  if (!name || !category || !unit) throw new Error('name, category, and unit are required');
  if (!siteId) throw new Error('siteId is required');
  return {
    id: id ?? `dm-${randomUUID().slice(0, 8)}`,
    siteId,
    group: 'other',
    category,
    name: name.trim(),
    stock: Number(stock),
    unit,
    minimum: parseMinimum(minimum),
  };
}

export function createVentilation({
  siteId,
  diameter,
  size,
  kind,
  grade,
  unit,
  stock = 0,
  minimum,
  id,
}: {
  siteId: string;
  diameter?: string;
  size?: string;
  kind: string;
  grade: string;
  unit?: string;
  stock?: number;
  minimum?: unknown;
  id?: string;
}): Material {
  if (!kind || !grade) throw new Error('kind and grade are required');
  if (!siteId) throw new Error('siteId is required');
  const material: Material = {
    id: id ?? `hv-${randomUUID().slice(0, 8)}`,
    siteId,
    group: 'ventilation',
    kind,
    grade,
    stock: Number(stock),
    unit: unit || (kind === 'Kanal' ? 'm' : 'adet'),
    minimum: parseMinimum(minimum),
  };
  if (diameter) material.diameter = diameter;
  if (size) material.size = size;
  return material;
}

export function createIsolation({
  siteId,
  kind,
  grade,
  shape,
  diameter,
  width,
  height,
  thickness,
  unit,
  stock = 0,
  minimum,
  id,
}: {
  siteId: string;
  kind: string;
  grade?: string;
  shape: 'round' | 'rect';
  diameter?: string;
  width?: string;
  height?: string;
  thickness: string;
  unit?: string;
  stock?: number;
  minimum?: unknown;
  id?: string;
}): Material {
  if (!kind || !thickness) throw new Error('kind and thickness are required');
  if (!siteId) throw new Error('siteId is required');
  if (shape !== 'round' && shape !== 'rect') throw new Error('shape must be round or rect');
  if (shape === 'round' && !diameter) throw new Error('diameter is required for round isolation');
  if (shape === 'rect' && (!width || !height)) throw new Error('width and height are required for rectangular isolation');

  const material: Material = {
    id: id ?? `iz-${randomUUID().slice(0, 8)}`,
    siteId,
    group: 'isolation',
    kind,
    shape,
    thickness,
    stock: Number(stock),
    unit: unit || 'm',
    minimum: parseMinimum(minimum),
  };
  if (grade) material.grade = grade;
  if (shape === 'round') {
    material.diameter = diameter;
  } else {
    material.width = width;
    material.height = height;
  }
  return material;
}
