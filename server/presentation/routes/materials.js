import { Router } from 'express';
import { createMaterial } from '../../application/usecases/material/createMaterial.js';
import { updateMaterial } from '../../application/usecases/material/updateMaterial.js';
import { deleteMaterial } from '../../application/usecases/material/deleteMaterial.js';

export function createMaterialRouter({ materialRepo, movementRepo }) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const data = await materialRepo.findAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const material = await materialRepo.findById(req.params.id);
      if (!material) return res.status(404).json({ error: 'Malzeme bulunamadı' });
      res.json(material);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const material = await createMaterial(req.body, { materialRepo, movementRepo });
      res.status(201).json(material);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const material = await updateMaterial(req.params.id, req.body, { materialRepo });
      res.json(material);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await deleteMaterial(req.params.id, { materialRepo, movementRepo });
      res.status(204).end();
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  return router;
}
