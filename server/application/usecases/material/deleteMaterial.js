export async function deleteMaterial(id, { materialRepo, movementRepo }) {
  const existing = await materialRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Malzeme bulunamadı'), { status: 404 });

  const count = await movementRepo.countByMalzemeId(id);
  if (count > 0) {
    throw Object.assign(
      new Error(`Bu malzeme için ${count} hareket kaydı var, silinemez.`),
      { status: 409 }
    );
  }

  await materialRepo.delete(id);
}
