import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { updateMaterial } from '../../server/application/usecases/material/updateMaterial.js';
import { deleteMaterial } from '../../server/application/usecases/material/deleteMaterial.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const id = req.query['id'] as string;
  try {
    const { materialRepo, movementRepo } = await getRepos();

    if (req.method === 'GET') {
      const material = await materialRepo.findById(id);
      if (!material) {
        res.status(404).json({ error: 'Material not found' });
        return;
      }
      res.json(material);
      return;
    }

    if (req.method === 'PUT') {
      const material = await updateMaterial(
        id,
        req.body as Record<string, unknown>,
        { materialRepo }
      );
      res.json(material);
      return;
    }

    if (req.method === 'DELETE') {
      await deleteMaterial(id, { materialRepo, movementRepo });
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
