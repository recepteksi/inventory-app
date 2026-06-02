import type { Order } from '../types/index.js';

/**
 * Notifies the site chief that a new order was created.
 *
 * For now this only logs — email delivery (e.g. Resend / SMTP) was deferred.
 * To enable email later, send to `process.env.SITE_CHIEF_EMAIL` here; everything
 * upstream already calls this on order creation.
 */
export async function notifyOrderCreated(order: Order): Promise<void> {
  const to = process.env['SITE_CHIEF_EMAIL'] ?? '(unset SITE_CHIEF_EMAIL)';
  const summary = order.items.map((i) => `${i.quantity} ${i.unit} ${i.materialName}`).join(', ');
  console.log(`[order] New order ${order.id} by ${order.createdBy} for ${order.orderDate} → notify ${to}: ${summary}`);
}
