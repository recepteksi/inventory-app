import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthUser } from '../_auth.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.status(200).json(user);
}
