import * as pages from '../models/pages.js';
import { httpError } from '../utils/httpError.js';
import { slugify } from '../utils/slugify.js';

/**
 * POST /api/admin/pages
 */
export async function createPage(req, res, next) {
  try {
    const data = { ...(req.body || {}) };

    if (!data.title) {
      throw httpError(400, 'Le titre est requis.');
    }

    if (!data.slug) {
      data.slug = slugify(data.title);
    }

    if (!data.slug) {
      throw httpError(400, 'Impossible de générer un slug à partir du titre.');
    }

    const page = await pages.create(data);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/pages/:id
 */
export async function updatePage(req, res, next) {
  try {
    const page = await pages.update(req.params.id, req.body || {});
    if (!page) {
      throw httpError(404, 'Page introuvable.');
    }
    res.json(page);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/pages/:id
 */
export async function deletePage(req, res, next) {
  try {
    const deleted = await pages.remove(req.params.id);
    if (!deleted) {
      throw httpError(404, 'Page introuvable.');
    }
    res.json({ message: 'Page supprimée.', id: deleted.id });
  } catch (err) {
    next(err);
  }
}
