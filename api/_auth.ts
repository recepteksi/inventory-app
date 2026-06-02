import { timingSafeEqual, createHmac } from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PublicUser, Role } from '../server/types/index.js';

export { hashPassword, verifyPassword } from '../server/infrastructure/security/password.js';

const COOKIE_NAME = 'session';
const SESSION_DAYS = 7;

interface AppError extends Error { status?: number; }

function unauthorized(message: string): AppError {
  const err: AppError = new Error(message);
  err.status = 401;
  return err;
}

function secret(): string {
  return process.env['SESSION_SECRET'] ?? 'dev-insecure-session-secret-change-me';
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface TokenPayload extends PublicUser {
  exp: number;
}

/** Signs a session token (base64url payload + HMAC-SHA256 signature). */
export function signToken(user: PublicUser): string {
  const payload: TokenPayload = { ...user, exp: Date.now() + SESSION_DAYS * 86400_000 };
  const body = base64url(JSON.stringify(payload));
  const sig = base64url(createHmac('sha256', secret()).update(body).digest());
  return `${body}.${sig}`;
}

/** Verifies a session token and returns its user payload, or null if invalid/expired. */
export function verifyToken(token: string | undefined): PublicUser | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = base64url(createHmac('sha256', secret()).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64').toString()) as TokenPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return { id: payload.id, username: payload.username, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

/** Sets (or clears, when user is null) the session cookie on the response. */
export function setSessionCookie(res: VercelResponse, user: PublicUser | null): void {
  const secure = process.env['NODE_ENV'] === 'production' ? ' Secure;' : '';
  if (!user) {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax;${secure} Max-Age=0`);
    return;
  }
  const token = signToken(user);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax;${secure} Max-Age=${SESSION_DAYS * 86400}`
  );
}

function readCookie(req: VercelRequest): string | undefined {
  const fromParsed = (req.cookies as Record<string, string> | undefined)?.[COOKIE_NAME];
  if (fromParsed) return fromParsed;
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE_NAME) return v.join('=');
  }
  return undefined;
}

/** Returns the authenticated user from the request cookie, or null. */
export function getAuthUser(req: VercelRequest): PublicUser | null {
  return verifyToken(readCookie(req));
}

/** Returns the authenticated user or throws a 401 AppError. */
export function requireAuth(req: VercelRequest): PublicUser {
  const user = getAuthUser(req);
  if (!user) throw unauthorized('Authentication required');
  return user;
}

/** Returns the authenticated user when they are an admin, or throws 401/403. */
export function requireRole(req: VercelRequest, role: Role): PublicUser {
  const user = requireAuth(req);
  if (role === 'admin' && user.role !== 'admin') {
    const err: AppError = new Error('Admin privileges required');
    err.status = 403;
    throw err;
  }
  return user;
}
