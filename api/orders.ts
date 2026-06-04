import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireAuth } from './_auth.js';
import { createOrder } from '../server/application/usecases/order/createOrder.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const user = requireAuth(req);
    const { materialRepo, orderRepo } = await getRepos();

    if (req.method === 'GET') {
      res.json(await orderRepo.findAll());
      return;
    }

    if (req.method === 'POST') {
      const order = await createOrder(req.body as Record<string, unknown>, user.name, user.id, { materialRepo, orderRepo });
      res.status(201).json(order);
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
