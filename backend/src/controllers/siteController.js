import { getSite } from '../models/site.js';

/**
 * GET /api/site — contenu publié uniquement.
 */
export async function getPublicSite(req, res, next) {
  try {
    const site = await getSite({ includeDrafts: false });
    res.json(site);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/site — contenu complet (brouillons inclus).
 */
export async function getAdminSite(req, res, next) {
  try {
    const site = await getSite({ includeDrafts: true });
    res.json(site);
  } catch (err) {
    next(err);
  }
}
