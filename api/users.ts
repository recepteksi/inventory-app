import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireRole } from './_auth.js';
import { createUser } from '../server/application/usecases/user/createUser.js';
import { updateUser } from '../server/application/usecases/user/updateUser.js';
import { deleteUser } from '../server/application/usecases/user/deleteUser.js';
import { toPublicUser } from '../server/domain/entities/User.js';

interface AppError extends Error { status?: number; }

/**
 * User management (admin only). Item operations use the `?id=` query parameter
 * so list/create/update/delete share a single serverless function.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    requireRole(req, 'admin');
    const { userRepo } = await getRepos();
    const id = req.query['id'] as string | undefined;

    if (req.method === 'GET') {
      const users = await userRepo.findAll();
      res.json(users.map(toPublicUser));
      return;
    }

    if (req.method === 'POST') {
      const user = await createUser(req.body as Record<string, unknown>, { userRepo });
      res.status(201).json(user);
      return;
    }

    if (req.method === 'PUT') {
      if (!id) { res.status(400).json({ error: 'id query parameter required' }); return; }
      const user = await updateUser(id, req.body as Record<string, unknown>, { userRepo });
      res.json(user);
      return;
    }

    if (req.method === 'DELETE') {
      if (!id) { res.status(400).json({ error: 'id query parameter required' }); return; }
      await deleteUser(id, { userRepo });
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
