import { getRepos } from './_repos.js';

export default async function handler(req, res) {
  try {
    const { movementRepo } = await getRepos();

    if (req.method === 'GET') {
      const { malzemeId, ustaId } = req.query;
      let hareketler;
      if (malzemeId) {
        hareketler = await movementRepo.findByMalzemeId(malzemeId);
      } else if (ustaId) {
        hareketler = await movementRepo.findByUstaId(ustaId);
      } else {
        hareketler = await movementRepo.findAll();
      }
      return res.json(hareketler);
    }

    res.status(405).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
