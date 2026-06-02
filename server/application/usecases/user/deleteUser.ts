import type { IUserRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function deleteUser(
  id: string,
  { userRepo }: { userRepo: IUserRepository }
): Promise<void> {
  const existing = await userRepo.findById(id);
  if (!existing) {
    const err: AppError = new Error('User not found');
    err.status = 404;
    throw err;
  }

  // Guard: never delete the last remaining admin.
  if (existing.role === 'admin') {
    const admins = (await userRepo.findAll()).filter((u) => u.role === 'admin');
    if (admins.length <= 1) {
      const err: AppError = new Error('At least one admin must remain');
      err.status = 409;
      throw err;
    }
  }

  await userRepo.delete(id);
}
