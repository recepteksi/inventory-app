import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRepos } from '../_repos.js';
import { requireAuth, requireRole } from '../_auth.js';
import { approveOrder } from '../../server/application/usecases/order/approveOrder.js';
import { updateOrder } from '../../server/application/usecases/order/updateOrder.js';

interface AppError extends Error { status?: number; }

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const id = req.query['id'] as string;
  try {
    const user = requireAuth(req);
    const { materialRepo, movementRepo, orderRepo } = await getRepos();

    if (req.method === 'PUT') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const action = body['action'];

      if (action === 'approve') {
        // Only admins may approve an order (records a delivery per item) and set
        // the delivery deadline (termin).
        requireRole(req, 'admin');
        const deliveryDate = String(body['deliveryDate'] ?? '');
        const order = await approveOrder(id, user.name, deliveryDate, { materialRepo, movementRepo, orderRepo });
        res.json(order);
        return;
      }

      if (action === 'update') {
        // Editing a pending order: admin, or the user who created it.
        const existing = await orderRepo.findById(id);
        if (!existing) {
          res.status(404).json({ error: 'Order not found' });
          return;
        }
        const isOwner = existing.createdById !== undefined && existing.createdById === user.id;
        if (user.role !== 'admin' && !isOwner) {
          res.status(403).json({ error: 'You may only edit your own pending orders' });
          return;
        }
        const order = await updateOrder(id, body, { materialRepo, orderRepo });
        res.json(order);
        return;
      }

      res.status(400).json({ error: 'Unsupported action' });
      return;
    }

    if (req.method === 'DELETE') {
      const order = await orderRepo.findById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      if (order.status === 'approved') {
        // Approved orders affected stock — only an admin may delete them.
        requireRole(req, 'admin');
      } else {
        // Pending orders: admin, or the user who created the order.
        const isOwner = order.createdById !== undefined && order.createdById === user.id;
        if (user.role !== 'admin' && !isOwner) {
          res.status(403).json({ error: 'You may only delete your own pending orders' });
          return;
        }
      }
      await orderRepo.delete(id);
      res.status(204).end();
      return;
    }

    res.status(405).end();
  } catch (err) {
    const appErr = err as AppError;
    res.status(appErr.status ?? 500).json({ error: appErr.message });
  }
}
