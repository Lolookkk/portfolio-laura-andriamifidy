import * as items from '../models/items.js';
import { httpError } from '../utils/httpError.js';

/**
 * POST /api/admin/items
 */
export async function createItem(req, res, next) {
  try {
    const data = { ...(req.body || {}) };

    if (!data.title) {
      throw httpError(400, 'Le titre est requis.');
    }

    const item = await items.create(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/items/:id
 */
export async function updateItem(req, res, next) {
  try {
    const item = await items.update(req.params.id, req.body || {});
    if (!item) {
      throw httpError(404, 'Élément introuvable.');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/items/:id
 */
export async function deleteItem(req, res, next) {
  try {
    const deleted = await items.remove(req.params.id);
    if (!deleted) {
      throw httpError(404, 'Élément introuvable.');
    }
    res.json({ message: 'Élément supprimé.', id: deleted.id });
  } catch (err) {
    next(err);
  }
}
