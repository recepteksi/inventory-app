import { getRepos } from './_repos.js';
import { createMaterial } from '../server/application/usecases/material/createMaterial.js';

export default async function handler(req, res) {
  try {
    const { materialRepo, movementRepo } = await getRepos();

    if (req.method === 'GET') {
      return res.json(await materialRepo.findAll());
    }

    if (req.method === 'POST') {
      const material = await createMaterial(req.body, { materialRepo, movementRepo });
      return res.status(201).json(material);
    }

    res.status(405).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
