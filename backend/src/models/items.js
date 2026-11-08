import { query } from '../config/db.js';

const COLUMNS =
  'id, kind, page_id, section_id, title, subtitle, description, categories, tech, ' +
  'image_url, repo_url, demo_url, modal_title, modal_subtitle, modal_content, gallery, ' +
  'position, published, created_at, updated_at';

const UPDATABLE = [
  'kind',
  'page_id',
  'section_id',
  'title',
  'subtitle',
  'description',
  'categories',
  'tech',
  'image_url',
  'repo_url',
  'demo_url',
  'modal_title',
  'modal_subtitle',
  'modal_content',
  'gallery',
  'position',
  'published',
];

const ARRAY_FIELDS = new Set(['categories', 'tech']);

/**
 * Sérialise une valeur pour une colonne jsonb.
 * @param {any} value
 */
function toJsonb(value) {
  if (value === null || value === undefined) return null;
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/**
 * Liste les éléments triés par position.
 * @param {{ onlyPublished?: boolean }} [options]
 */
export async function findAll({ onlyPublished = false } = {}) {
  const sql = `select ${COLUMNS} from items ${
    onlyPublished ? 'where published = true' : ''
  } order by position, id`;
  const { rows } = await query(sql);
  return rows;
}

/** @param {number} id */
export async function findById(id) {
  const { rows } = await query(`select ${COLUMNS} from items where id = $1`, [id]);
  return rows[0] || null;
}

/**
 * Crée un élément.
 * @param {object} data
 */
export async function create(data) {
  const {
    kind = 'project',
    page_id = null,
    section_id = null,
    title,
    subtitle = null,
    description = null,
    categories = [],
    tech = [],
    image_url = null,
    repo_url = null,
    demo_url = null,
    modal_title = null,
    modal_subtitle = null,
    modal_content = null,
    gallery = [],
    position = 0,
    published = true,
  } = data;

  const { rows } = await query(
    `insert into items
      (kind, page_id, section_id, title, subtitle, description, categories, tech,
       image_url, repo_url, demo_url, modal_title, modal_subtitle, modal_content,
       gallery, position, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     returning ${COLUMNS}`,
    [
      kind,
      page_id,
      section_id,
      title,
      subtitle,
      description,
      Array.isArray(categories) ? categories : [],
      Array.isArray(tech) ? tech : [],
      image_url,
      repo_url,
      demo_url,
      modal_title,
      modal_subtitle,
      modal_content,
      toJsonb(gallery),
      position,
      published,
    ]
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
      let value = data[field];
      if (ARRAY_FIELDS.has(field)) {
        value = Array.isArray(value) ? value : [];
      } else if (field === 'gallery') {
        value = toJsonb(value);
      }
      params.push(value);
      sets.push(`${field} = $${params.length}`);
    }
  }

  sets.push('updated_at = now()');
  params.push(id);

  const { rows } = await query(
    `update items set ${sets.join(', ')} where id = $${params.length} returning ${COLUMNS}`,
    params
  );
  return rows[0] || null;
}

/** @param {number} id */
export async function remove(id) {
  const { rows } = await query('delete from items where id = $1 returning id', [id]);
  return rows[0] || null;
}
