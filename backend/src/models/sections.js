import { query } from '../config/db.js';

const COLUMNS =
  'id, page_id, parent_id, title, subtitle, content, position, created_at, updated_at';

const UPDATABLE = [
  'page_id',
  'parent_id',
  'title',
  'subtitle',
  'content',
  'position',
];

/**
 * Liste toutes les sections, triées par page puis par position.
 */
export async function findAll() {
  const { rows } = await query(
    `select ${COLUMNS} from sections order by page_id, position, id`
  );
  return rows;
}

/**
 * Liste les sections d'une page.
 * @param {number} pageId
 */
export async function findByPage(pageId) {
  const { rows } = await query(
    `select ${COLUMNS} from sections where page_id = $1 order by position, id`,
    [pageId]
  );
  return rows;
}

/** @param {number} id */
export async function findById(id) {
  const { rows } = await query(`select ${COLUMNS} from sections where id = $1`, [id]);
  return rows[0] || null;
}

/**
 * Crée une section.
 * @param {object} data
 */
export async function create(data) {
  const {
    page_id,
    parent_id = null,
    title = null,
    subtitle = null,
    content = null,
    position = 0,
  } = data;

  const { rows } = await query(
    `insert into sections (page_id, parent_id, title, subtitle, content, position)
     values ($1, $2, $3, $4, $5, $6)
     returning ${COLUMNS}`,
    [page_id, parent_id, title, subtitle, content, position]
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
    `update sections set ${sets.join(', ')} where id = $${params.length} returning ${COLUMNS}`,
    params
  );
  return rows[0] || null;
}

/** @param {number} id */
export async function remove(id) {
  const { rows } = await query('delete from sections where id = $1 returning id', [id]);
  return rows[0] || null;
}
