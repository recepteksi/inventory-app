import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireAuth } from './_auth.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    requireAuth(req);
    const { movementRepo } = await getRepos();

    if (req.method === 'GET') {
      const materialId = req.query['materialId'] as string | undefined;
      const workerId = req.query['workerId'] as string | undefined;
      const siteId = req.query['siteId'] as string | undefined;

      let movements;
      if (materialId) {
        movements = await movementRepo.findByMaterialId(materialId);
      } else if (workerId) {
        movements = await movementRepo.findByWorkerId(workerId, siteId);
      } else {
        movements = await movementRepo.findAll(siteId);
      }
      res.json(movements);
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
