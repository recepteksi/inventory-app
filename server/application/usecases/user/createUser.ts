import { buildUser, toPublicUser } from '../../../domain/entities/User.js';
import { hashPassword } from '../../../infrastructure/security/password.js';
import type { PublicUser, Role, IUserRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function createUser(
  payload: Record<string, unknown>,
  { userRepo }: { userRepo: IUserRepository }
): Promise<PublicUser> {
  const username = String(payload['username'] ?? '').trim();
  const name = String(payload['name'] ?? '').trim();
  const password = String(payload['password'] ?? '');
  const role = payload['role'] === 'admin' ? 'admin' : ('normal' as Role);

  if (!username || !name) {
    const err: AppError = new Error('username and name are required');
    err.status = 400;
    throw err;
  }
  if (password.length < 4) {
    const err: AppError = new Error('Password must be at least 4 characters');
    err.status = 400;
    throw err;
  }

  const existing = await userRepo.findByUsername(username);
  if (existing) {
    const err: AppError = new Error('This username is already taken');
    err.status = 409;
    throw err;
  }

  const user = buildUser({ username, name, role, passwordHash: hashPassword(password) });
  await userRepo.create(user);
  return toPublicUser(user);
}
