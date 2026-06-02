import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { requireAuth } from '../_auth.js';
import { recordDelivery } from '../../server/application/usecases/movement/recordDelivery.js';
import { recordUsage } from '../../server/application/usecases/movement/recordUsage.js';
import { recordUsageBatch } from '../../server/application/usecases/movement/recordUsageBatch.js';

interface AppError extends Error { status?: number; }

/**
 * Movement write endpoints bundled into one function:
 *   POST /api/movements/delivery · /usage · /usage-batch
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const action = req.query['action'] as string;
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    requireAuth(req);
    const { materialRepo, movementRepo } = await getRepos();
    const body = req.body as Record<string, unknown>;

    if (action === 'delivery') {
      res.status(201).json(await recordDelivery(body, { materialRepo, movementRepo }));
      return;
    }
    if (action === 'usage') {
      res.status(201).json(await recordUsage(body, { materialRepo, movementRepo }));
      return;
    }
    if (action === 'usage-batch') {
      res.status(201).json(await recordUsageBatch(body, { materialRepo, movementRepo }));
      return;
    }

    res.status(404).json({ error: 'Unknown movement action' });
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 400).json({ error: appErr.message });
  }
}
