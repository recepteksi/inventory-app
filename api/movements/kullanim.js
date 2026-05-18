import { getRepos } from '../_repos.js';
import { createKullanim } from '../../server/application/usecases/movement/recordKullanim.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { materialRepo, movementRepo } = await getRepos();
    const result = await createKullanim(req.body, { materialRepo, movementRepo });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
}
