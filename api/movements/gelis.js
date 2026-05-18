import { getRepos } from '../_repos.js';
import { createGelis } from '../../server/application/usecases/movement/recordGelis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { materialRepo, movementRepo } = await getRepos();
    const result = await createGelis(req.body, { materialRepo, movementRepo });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
}
