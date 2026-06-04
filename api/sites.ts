import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireAuth, requireRole } from './_auth.js';
import { createSite } from '../server/application/usecases/site/createSite.js';
import { updateSite } from '../server/application/usecases/site/updateSite.js';
import { deleteSite } from '../server/application/usecases/site/deleteSite.js';

interface AppError extends Error { status?: number; }

/**
 * Site (şantiye) management. Reads are open to any authenticated user; writes are
 * admin-only. Item operations use the `?id=` query parameter so list/create/
 * update/delete share a single serverless function.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { siteRepo, materialRepo, movementRepo, orderRepo } = await getRepos();
    const id = req.query['id'] as string | undefined;

    if (req.method === 'GET') {
      requireAuth(req);
      res.json(await siteRepo.findAll());
      return;
    }

    if (req.method === 'POST') {
      requireRole(req, 'admin');
      const site = await createSite(req.body as Record<string, unknown>, { siteRepo });
      res.status(201).json(site);
      return;
    }

    if (req.method === 'PUT') {
      requireRole(req, 'admin');
      if (!id) { res.status(400).json({ error: 'id query parameter required' }); return; }
      const site = await updateSite(id, req.body as Record<string, unknown>, { siteRepo });
      res.json(site);
      return;
    }

    if (req.method === 'DELETE') {
      requireRole(req, 'admin');
      if (!id) { res.status(400).json({ error: 'id query parameter required' }); return; }
      await deleteSite(id, { siteRepo, materialRepo, movementRepo, orderRepo });
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
