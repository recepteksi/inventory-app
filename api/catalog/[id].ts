import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { requireRole } from '../_auth.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const id = req.query['id'] as string;
  try {
    requireRole(req, 'admin');
    const { catalogRepo } = await getRepos();

    if (req.method === 'DELETE') {
      await catalogRepo.delete(id);
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
