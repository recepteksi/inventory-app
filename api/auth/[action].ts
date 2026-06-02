import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { getAuthUser, setSessionCookie } from '../_auth.js';
import { authenticate } from '../../server/application/usecases/user/authenticate.js';

interface AppError extends Error { status?: number; }

/**
 * Auth endpoints bundled into one function (Hobby plan limits functions/deploy):
 *   POST /api/auth/login   · POST /api/auth/logout · GET /api/auth/me
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const action = req.query['action'] as string;
  try {
    if (action === 'login') {
      if (req.method !== 'POST') { res.status(405).end(); return; }
      const { userRepo } = await getRepos();
      const user = await authenticate(req.body as Record<string, unknown>, { userRepo });
      setSessionCookie(res, user);
      res.status(200).json(user);
      return;
    }

    if (action === 'logout') {
      if (req.method !== 'POST') { res.status(405).end(); return; }
      setSessionCookie(res, null);
      res.status(204).end();
      return;
    }

    if (action === 'me') {
      if (req.method !== 'GET') { res.status(405).end(); return; }
      const user = getAuthUser(req);
      if (!user) { res.status(401).json({ error: 'Not authenticated' }); return; }
      res.status(200).json(user);
      return;
    }

    res.status(404).json({ error: 'Unknown auth action' });
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
