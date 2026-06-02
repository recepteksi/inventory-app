import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { requireAuth } from '../_auth.js';
import { approveOrder } from '../../server/application/usecases/order/approveOrder.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const id = req.query['id'] as string;
  try {
    const user = requireAuth(req);
    const { materialRepo, movementRepo, orderRepo } = await getRepos();

    if (req.method === 'PUT') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (body['action'] !== 'approve') {
        res.status(400).json({ error: 'Unsupported action' });
        return;
      }
      const order = await approveOrder(id, user.name, { materialRepo, movementRepo, orderRepo });
      res.json(order);
      return;
    }

    if (req.method === 'DELETE') {
      await orderRepo.delete(id);
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
