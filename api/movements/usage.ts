import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { recordUsage } from '../../server/application/usecases/movement/recordUsage.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { materialRepo, movementRepo } = await getRepos();
    const result = await recordUsage(
      req.body as Record<string, unknown>,
      { materialRepo, movementRepo }
    );
    res.status(201).json(result);
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 400).json({ error: appErr.message });
  }
}
