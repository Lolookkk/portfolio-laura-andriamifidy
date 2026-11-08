import { query } from '../config/db.js';

const COLUMNS =
  'id, slug, title, nav_label, template, position, nav_visible, created_at, updated_at';

const UPDATABLE = ['slug', 'title', 'nav_label', 'template', 'position', 'nav_visible'];

/**
 * Liste les pages triées par position.
 * @param {{ onlyVisible?: boolean }} [options]
 */
export async function findAll({ onlyVisible = false } = {}) {
  const sql = `select ${COLUMNS} from pages ${
    onlyVisible ? 'where nav_visible = true' : ''
  } order by position, id`;
  const { rows } = await query(sql);
  return rows;
}

/** @param {number} id */
export async function findById(id) {
  const { rows } = await query(`select ${COLUMNS} from pages where id = $1`, [id]);
  return rows[0] || null;
}

/**
 * Crée une page.
 * @param {object} data
 */
export async function create(data) {
  const {
    slug,
    title,
    nav_label = null,
    template = 'text',
    position = 0,
    nav_visible = true,
  } = data;

  const { rows } = await query(
    `insert into pages (slug, title, nav_label, template, position, nav_visible)
     values ($1, $2, $3, $4, $5, $6)
     returning ${COLUMNS}`,
    [slug, title, nav_label, template, position, nav_visible]
  );
  return rows[0];
}

/**
 * Met à jour uniquement les champs fournis.
 * @param {number} id
 * @param {object} data
 */
export async function update(id, data) {
  const sets = [];
  const params = [];

  for (const field of UPDATABLE) {
    if (data[field] !== undefined) {
      params.push(data[field]);
      sets.push(`${field} = $${params.length}`);
    }
  }

  sets.push('updated_at = now()');
  params.push(id);

  const { rows } = await query(
    `update pages set ${sets.join(', ')} where id = $${params.length} returning ${COLUMNS}`,
    params
  );
  return rows[0] || null;
}

/** @param {number} id */
export async function remove(id) {
  const { rows } = await query('delete from pages where id = $1 returning id', [id]);
  return rows[0] || null;
}
