import { getRepos } from '../_repos.js';
import { updateMaterial } from '../../server/application/usecases/material/updateMaterial.js';
import { deleteMaterial } from '../../server/application/usecases/material/deleteMaterial.js';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const { materialRepo, movementRepo } = await getRepos();

    if (req.method === 'GET') {
      const material = await materialRepo.findById(id);
      if (!material) return res.status(404).json({ error: 'Malzeme bulunamadı' });
      return res.json(material);
    }

    if (req.method === 'PUT') {
      const material = await updateMaterial(id, req.body, { materialRepo });
      return res.json(material);
    }

    if (req.method === 'DELETE') {
      await deleteMaterial(id, { materialRepo, movementRepo });
      return res.status(204).end();
    }

    res.status(405).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
