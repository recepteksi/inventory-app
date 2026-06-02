import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from './_repos.js';
import { requireRole } from './_auth.js';
import { createUser } from '../server/application/usecases/user/createUser.js';
import { toPublicUser } from '../server/domain/entities/User.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    requireRole(req, 'admin');
    const { userRepo } = await getRepos();

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

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
