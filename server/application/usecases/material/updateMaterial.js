export async function updateMaterial(id, payload, { materialRepo }) {
  const existing = await materialRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Malzeme bulunamadı'), { status: 404 });

  // Only editable fields — stock and ID are never editable directly
  const allowed =
    existing.grup === 'boru'
      ? { minimum: Number(payload.minimum) }
      : {
          ad: payload.ad?.trim(),
          kategori: payload.kategori,
          birim: payload.birim,
          minimum: Number(payload.minimum),
        };

  const updated = { ...existing, ...allowed };

  // Check duplicate on editable identity fields (digerMalzeme only)
  if (existing.grup === 'diger' && payload.ad) {
    const isDuplicate = await materialRepo.checkDuplicate(updated);
    if (isDuplicate) {
      throw Object.assign(new Error('Bu malzeme adı zaten kayıtlı'), { status: 409 });
    }
  }

  return materialRepo.update(updated);
}
