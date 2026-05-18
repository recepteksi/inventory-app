export async function deleteWorker(id, { workerRepo, movementRepo }) {
  const existing = await workerRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Usta bulunamadı'), { status: 404 });

  const count = await movementRepo.countByUstaId(id);
  if (count > 0) {
    throw Object.assign(
      new Error(`Bu ustanın ${count} hareket kaydı var, silinemez.`),
      { status: 409 }
    );
  }

  await workerRepo.delete(id);
}
