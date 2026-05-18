import { createGelis as buildGelis } from '../../../domain/entities/Movement.js';

export async function createGelis(payload, { materialRepo, movementRepo }) {
  const material = await materialRepo.findById(payload.malzemeId);
  if (!material) throw Object.assign(new Error('Malzeme bulunamadı'), { status: 404 });

  const movement = buildGelis(payload);
  // Allow internal callers to attach a custom note (e.g. 'Açılış stoku')
  if (payload._note) movement.not = payload._note;
  await movementRepo.save(movement);

  const updatedMaterial = await materialRepo.updateStock(
    material.id,
    material.stok + movement.miktar
  );

  return { movement, updatedMaterial };
}
