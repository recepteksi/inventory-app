import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { createWorker } from '../server/application/usecases/worker/createWorker.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { workerRepo } = await getRepos();

    if (req.method === 'GET') {
      res.json(await workerRepo.findAll());
      return;
    }

    if (req.method === 'POST') {
      const worker = await createWorker(
        req.body as Record<string, unknown>,
        { workerRepo }
      );
      res.status(201).json(worker);
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
