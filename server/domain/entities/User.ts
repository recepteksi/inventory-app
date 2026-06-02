import { randomUUID } from 'crypto';
import type { User, PublicUser, Role } from '../../types/index.js';

export function buildUser({
  username,
  name,
  passwordHash,
  role = 'normal',
  id,
  createdAt,
}: {
  username: string;
  name: string;
  passwordHash: string;
  role?: Role;
  id?: string;
  createdAt?: string;
}): User {
  if (!username || !name || !passwordHash) throw new Error('username, name, and password are required');
  return {
    id: id ?? `usr-${randomUUID().slice(0, 8)}`,
    username: username.trim().toLowerCase(),
    name: name.trim(),
    role: role === 'admin' ? 'admin' : 'normal',
    passwordHash,
    createdAt: createdAt ?? new Date().toISOString(),
  };
}

/** Strips password material so a user is safe to send to the client. */
export function toPublicUser(user: User): PublicUser {
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}
