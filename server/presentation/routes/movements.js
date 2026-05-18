import { Router } from 'express';
import { createGelis } from '../../application/usecases/movement/recordGelis.js';
import { createKullanim } from '../../application/usecases/movement/recordKullanim.js';

export function createMovementRouter({ materialRepo, movementRepo }) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { malzemeId, ustaId } = req.query;
      let hareketler;
      if (malzemeId) {
        hareketler = await movementRepo.findByMalzemeId(malzemeId);
      } else if (ustaId) {
        hareketler = await movementRepo.findByUstaId(ustaId);
      } else {
        hareketler = await movementRepo.findAll();
      }
      res.json(hareketler);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/gelis', async (req, res) => {
    try {
      const result = await createGelis(req.body, { materialRepo, movementRepo });
      res.status(201).json(result);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  router.post('/kullanim', async (req, res) => {
    try {
      const result = await createKullanim(req.body, { materialRepo, movementRepo });
      res.status(201).json(result);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  return router;
}
