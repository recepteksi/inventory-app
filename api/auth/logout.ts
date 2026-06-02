import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setSessionCookie } from '../_auth.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  setSessionCookie(res, null);
  res.status(204).end();
}
