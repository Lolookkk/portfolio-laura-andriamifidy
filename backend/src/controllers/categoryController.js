import * as categories from '../models/categories.js';
import { httpError } from '../utils/httpError.js';

/**
 * POST /api/admin/categories
 */
export async function createCategory(req, res, next) {
  try {
    const data = { ...(req.body || {}) };

    if (!data.code) {
      throw httpError(400, 'Le code est requis.');
    }
    if (!data.label) {
      throw httpError(400, 'Le libellé est requis.');
    }

    const category = await categories.create(data);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/categories/:id
 */
export async function updateCategory(req, res, next) {
  try {
    const category = await categories.update(req.params.id, req.body || {});
    if (!category) {
      throw httpError(404, 'Catégorie introuvable.');
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id
 */
export async function deleteCategory(req, res, next) {
  try {
    const deleted = await categories.remove(req.params.id);
    if (!deleted) {
      throw httpError(404, 'Catégorie introuvable.');
    }
    res.json({ message: 'Catégorie supprimée.', id: deleted.id });
  } catch (err) {
    next(err);
  }
}
