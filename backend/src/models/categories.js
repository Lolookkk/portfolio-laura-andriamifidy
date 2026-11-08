import { query } from '../config/db.js';

const COLUMNS = 'id, code, label, position';
const UPDATABLE = ['code', 'label', 'position'];

/**
 * Liste les catégories triées par position.
 */
export async function findAll() {
  const { rows } = await query(
    `select ${COLUMNS} from categories order by position, id`
  );
  return rows;
}

/** @param {number} id */
export async function findById(id) {
  const { rows } = await query(`select ${COLUMNS} from categories where id = $1`, [id]);
  return rows[0] || null;
}

/**
 * Crée une catégorie.
 * @param {object} data
 */
export async function create(data) {
  const { code, label, position = 0 } = data;
  const { rows } = await query(
    `insert into categories (code, label, position)
     values ($1, $2, $3)
     returning ${COLUMNS}`,
    [code, label, position]
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

  if (sets.length === 0) {
    return findById(id);
  }

  params.push(id);
  const { rows } = await query(
    `update categories set ${sets.join(', ')} where id = $${params.length} returning ${COLUMNS}`,
    params
  );
  return rows[0] || null;
}

/** @param {number} id */
export async function remove(id) {
  const { rows } = await query('delete from categories where id = $1 returning id', [id]);
  return rows[0] || null;
}
