import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { createMaterial } from '../server/application/usecases/material/createMaterial.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { materialRepo, movementRepo } = await getRepos();

    if (req.method === 'GET') {
      res.json(await materialRepo.findAll());
      return;
    }

    if (req.method === 'POST') {
      const material = await createMaterial(
        req.body as Record<string, unknown>,
        { materialRepo, movementRepo }
      );
      res.status(201).json(material);
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
