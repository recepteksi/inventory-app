import { createKullanim as buildKullanim } from '../../../domain/entities/Movement.js';

export async function createKullanim(payload, { materialRepo, movementRepo }) {
  const material = await materialRepo.findById(payload.malzemeId);
  if (!material) throw Object.assign(new Error('Malzeme bulunamadı'), { status: 404 });

  if (Number(payload.miktar) > material.stok) {
    throw Object.assign(
      new Error(`Stok yetersiz. Mevcut: ${material.stok} ${material.birim}`),
      { status: 400 }
    );
  }

  const movement = buildKullanim(payload);
  await movementRepo.save(movement);

  const updatedMaterial = await materialRepo.updateStock(
    material.id,
    material.stok - movement.miktar
  );

  return { movement, updatedMaterial };
}
