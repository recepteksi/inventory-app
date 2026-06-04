import { randomUUID } from 'crypto';
import type { Site } from '../../types/index.js';

interface AppError extends Error { status?: number; }

/**
 * Builds a şantiye (site). Name is required and trimmed.
 * Id format matches the other collections (e.g. cat-/ord-): site-{first8uuid}.
 */
export function buildSite({ name, id }: { name: string; id?: string }): Site {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) {
    const err: AppError = new Error('Site name is required');
    err.status = 400;
    throw err;
  }
  return {
    id: id ?? `site-${randomUUID().slice(0, 8)}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
}
