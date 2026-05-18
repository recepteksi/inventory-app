import { getRepos } from '../_repos.js';
import { updateWorker } from '../../server/application/usecases/worker/updateWorker.js';
import { deleteWorker } from '../../server/application/usecases/worker/deleteWorker.js';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const { workerRepo, movementRepo } = await getRepos();

    if (req.method === 'PUT') {
      const worker = await updateWorker(id, req.body, { workerRepo });
      return res.json(worker);
    }

    if (req.method === 'DELETE') {
      await deleteWorker(id, { workerRepo, movementRepo });
      return res.status(204).end();
    }

    res.status(405).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
