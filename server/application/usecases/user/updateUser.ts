import { toPublicUser } from '../../../domain/entities/User.js';
import { hashPassword } from '../../../infrastructure/security/password.js';
import type { PublicUser, Role, User, IUserRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function updateUser(
  id: string,
  payload: Record<string, unknown>,
  { userRepo }: { userRepo: IUserRepository }
): Promise<PublicUser> {
  const existing = await userRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const patch: Partial<User> = {};
  if (typeof payload['name'] === 'string' && payload['name'].trim()) patch.name = payload['name'].trim();
  if (payload['role'] === 'admin' || payload['role'] === 'normal') patch.role = payload['role'] as Role;

  const password = typeof payload['password'] === 'string' ? payload['password'] : '';
  if (password) {
    if (password.length < 4) {
      const err: AppError = new Error('Password must be at least 4 characters');
      err.status = 400;
      throw err;
    }
    patch.passwordHash = hashPassword(password);
  }

  // Guard: never demote the last remaining admin.
  if (existing.role === 'admin' && patch.role === 'normal') {
    const admins = (await userRepo.findAll()).filter((u) => u.role === 'admin');
    if (admins.length <= 1) {
      const err: AppError = new Error('At least one admin must remain');
      err.status = 409;
      throw err;
    }
  }

  const updated = await userRepo.update(id, patch);
  if (!updated) throw new Error('User not found after update');
  return toPublicUser(updated);
}
