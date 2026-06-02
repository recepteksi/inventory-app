import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { setSessionCookie } from '../_auth.js';
import { authenticate } from '../../server/application/usecases/user/authenticate.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { userRepo } = await getRepos();
    const user = await authenticate(req.body as Record<string, unknown>, { userRepo });
    setSessionCookie(res, user);
    res.status(200).json(user);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
