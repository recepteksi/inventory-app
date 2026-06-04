import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireAuth, requireRole } from './_auth.js';
import { createCatalogEntry } from '../server/application/usecases/catalog/createCatalogEntry.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { catalogRepo } = await getRepos();

    if (req.method === 'GET') {
      requireAuth(req);
      res.json(await catalogRepo.findAll());
      return;
    }

    if (req.method === 'POST') {
      requireRole(req, 'admin');
      const entry = await createCatalogEntry(req.body as Record<string, unknown>, { catalogRepo });
      res.status(201).json(entry);
      return;
    }

    if (req.method === 'DELETE') {
      requireRole(req, 'admin');
      const id = req.query['id'] as string | undefined;
      if (!id) { res.status(400).json({ error: 'id query parameter required' }); return; }
      const deleted = await catalogRepo.delete(id);
      if (!deleted) { res.status(404).json({ error: 'Catalog entry not found' }); return; }
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
