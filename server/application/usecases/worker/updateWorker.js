export async function updateWorker(id, payload, { workerRepo }) {
  const existing = await workerRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Usta bulunamadı'), { status: 404 });

  const updated = {
    ...existing,
    ad: payload.ad?.trim() || existing.ad,
    uzmanlik: payload.uzmanlik?.trim() || existing.uzmanlik,
    baslangic: payload.baslangic || existing.baslangic,
  };

  return workerRepo.update(updated);
}
