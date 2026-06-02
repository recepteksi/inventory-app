import { toPublicUser } from '../../../domain/entities/User.js';
import { verifyPassword } from '../../../infrastructure/security/password.js';
import type { PublicUser, IUserRepository } from '../../../types/index.js';

interface AppError extends Error { status?: number; }

export async function authenticate(
  payload: Record<string, unknown>,
  { userRepo }: { userRepo: IUserRepository }
): Promise<PublicUser> {
  const username = String(payload['username'] ?? '').trim();
  const password = String(payload['password'] ?? '');

  const invalid: AppError = new Error('Invalid username or password');
  invalid.status = 401;

  if (!username || !password) throw invalid;

  const user = await userRepo.findByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) throw invalid;

  return toPublicUser(user);
}
