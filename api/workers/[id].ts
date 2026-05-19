import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { updateWorker } from '../../server/application/usecases/worker/updateWorker.js';
import { deleteWorker } from '../../server/application/usecases/worker/deleteWorker.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const id = req.query['id'] as string;
  try {
    const { workerRepo, movementRepo } = await getRepos();

    if (req.method === 'PUT') {
      const worker = await updateWorker(
        id,
        req.body as Record<string, unknown>,
        { workerRepo }
      );
      res.json(worker);
      return;
    }

    if (req.method === 'DELETE') {
      await deleteWorker(id, { workerRepo, movementRepo });
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
