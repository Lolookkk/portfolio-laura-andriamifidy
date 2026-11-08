import * as sections from '../models/sections.js';
import { httpError } from '../utils/httpError.js';

/**
 * POST /api/admin/sections
 */
export async function createSection(req, res, next) {
  try {
    const data = { ...(req.body || {}) };

    if (!data.title) {
      throw httpError(400, 'Le titre est requis.');
    }
    if (!data.page_id) {
      throw httpError(400, 'La page (page_id) est requise.');
    }

    const section = await sections.create(data);
    res.status(201).json(section);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/sections/:id
 */
export async function updateSection(req, res, next) {
  try {
    const section = await sections.update(req.params.id, req.body || {});
    if (!section) {
      throw httpError(404, 'Section introuvable.');
    }
    res.json(section);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/sections/:id
 */
export async function deleteSection(req, res, next) {
  try {
    const deleted = await sections.remove(req.params.id);
    if (!deleted) {
      throw httpError(404, 'Section introuvable.');
    }
    res.json({ message: 'Section supprimée.', id: deleted.id });
  } catch (err) {
    next(err);
  }
}
