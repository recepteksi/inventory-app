import { createBoruFitting, createDigerMalzeme } from '../../../domain/entities/Material.js';
import { createGelis } from '../movement/recordGelis.js';

export async function createMaterial(payload, { materialRepo, movementRepo }) {
  const material =
    payload.grup === 'boru'
      ? createBoruFitting(payload)
      : createDigerMalzeme(payload);

  const isDuplicate = await materialRepo.checkDuplicate(material);
  if (isDuplicate) {
    throw Object.assign(new Error('Bu malzeme zaten kayıtlı'), { status: 409 });
  }

  await materialRepo.save(material);

  const baslangic = Number(payload.baslangic) || 0;
  if (baslangic > 0) {
    await createGelis(
      {
        malzemeId: material.id,
        miktar: baslangic,
        tarih: new Date().toISOString().slice(0, 10),
        tedarikci: '',
        fis: '',
        _note: 'Açılış stoku',
      },
      { materialRepo, movementRepo }
    );
  }

  return materialRepo.findById(material.id);
}
