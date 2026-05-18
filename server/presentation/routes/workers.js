import { Router } from 'express';
import { createWorker } from '../../application/usecases/worker/createWorker.js';
import { updateWorker } from '../../application/usecases/worker/updateWorker.js';
import { deleteWorker } from '../../application/usecases/worker/deleteWorker.js';

export function createWorkerRouter({ workerRepo, movementRepo }) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const ustalar = await workerRepo.findAll();
      res.json(ustalar);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const worker = await createWorker(req.body, { workerRepo });
      res.status(201).json(worker);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const worker = await updateWorker(req.params.id, req.body, { workerRepo });
      res.json(worker);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await deleteWorker(req.params.id, { workerRepo, movementRepo });
      res.status(204).end();
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  return router;
}
