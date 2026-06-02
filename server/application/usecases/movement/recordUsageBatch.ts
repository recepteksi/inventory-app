import { randomUUID } from 'crypto';
import type {
  Movement, Material, BatchUsageResult, IMaterialRepository, IMovementRepository,
} from '../../../types/index.js';

interface AppError extends Error { status?: number; }

interface BatchItem { materialId: string; quantity: number; }

/**
 * Records usage of several materials in a single job. All items are validated
 * against current stock first — if any one is insufficient the whole batch is
 * rejected and nothing is written.
 */
export async function recordUsageBatch(
  payload: Record<string, unknown>,
  { materialRepo, movementRepo }: { materialRepo: IMaterialRepository; movementRepo: IMovementRepository }
): Promise<BatchUsageResult> {
  const workerId = String(payload['workerId'] ?? '');
  const date = String(payload['date'] ?? '');
  const jobDescription = String(payload['jobDescription'] ?? '').trim();
  const rawItems = Array.isArray(payload['items']) ? (payload['items'] as BatchItem[]) : [];

  const items = rawItems
    .map((i) => ({ materialId: String(i.materialId), quantity: Number(i.quantity) }))
    .filter((i) => i.materialId && i.quantity > 0);

  const bad = (msg: string): AppError => { const e: AppError = new Error(msg); e.status = 400; return e; };

  if (!workerId || !date || jobDescription.length < 3) throw bad('workerId, date, and jobDescription are required');
  if (items.length === 0) throw bad('At least one material is required');

  // Sum requested quantity per material (the same material may be listed twice).
  const wanted = new Map<string, number>();
  for (const i of items) wanted.set(i.materialId, (wanted.get(i.materialId) ?? 0) + i.quantity);

  // Validate every material exists and has enough stock before writing anything.
  const materials = new Map<string, Material>();
  for (const [materialId, qty] of wanted) {
    const material = await materialRepo.findById(materialId);
    if (!material) { const e: AppError = new Error(`Material not found: ${materialId}`); e.status = 404; throw e; }
    if (qty > material.stock) throw bad(`Insufficient stock for ${material.id}. Available: ${material.stock} ${material.unit}`);
    materials.set(materialId, material);
  }

  const batchId = `bt-${randomUUID().slice(0, 8)}`;
  const movements: Movement[] = [];
  for (const i of items) {
    const movement: Movement = {
      id: `mv-${randomUUID().slice(0, 8)}`,
      materialId: i.materialId,
      type: 'usage',
      quantity: i.quantity,
      date,
      workerId,
      jobDescription,
      batchId,
    };
    await movementRepo.create(movement);
    movements.push(movement);
  }

  // Apply stock decrements (summed per material).
  const updatedMaterials: Material[] = [];
  for (const [materialId, qty] of wanted) {
    const material = materials.get(materialId)!;
    updatedMaterials.push(await materialRepo.updateStock(materialId, material.stock - qty));
  }

  return { movements, updatedMaterials };
}
