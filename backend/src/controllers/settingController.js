import * as settings from '../models/settings.js';
import { httpError } from '../utils/httpError.js';

/**
 * GET /api/admin/settings
 */
export async function getSettings(req, res, next) {
  try {
    const all = await settings.getAll();
    res.json(all);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/settings
 * Body attendu : objet clé/valeur.
 */
export async function putSettings(req, res, next) {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw httpError(400, 'Corps attendu : objet clé/valeur.');
    }

    const updated = await settings.upsertMany(body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
