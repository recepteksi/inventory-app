import { getRepos } from './_repos.js';
import { createWorker } from '../server/application/usecases/worker/createWorker.js';

export default async function handler(req, res) {
  try {
    const { workerRepo } = await getRepos();

    if (req.method === 'GET') {
      return res.json(await workerRepo.findAll());
    }

    if (req.method === 'POST') {
      const worker = await createWorker(req.body, { workerRepo });
      return res.status(201).json(worker);
    }

    res.status(405).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
