import { query } from '../config/db.js';

/**
 * Renvoie tous les paramètres sous forme d'objet clé/valeur.
 * @returns {Promise<Record<string, string|null>>}
 */
export async function getAll() {
  const { rows } = await query('select key, value from site_settings order by key');
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

/**
 * UPSERT de chaque clé fournie, puis renvoie l'objet complet à jour.
 * @param {Record<string, any>} settings
 * @returns {Promise<Record<string, string|null>>}
 */
export async function upsertMany(settings) {
  const entries = Object.entries(settings || {});
  for (const [key, value] of entries) {
    await query(
      `insert into site_settings (key, value)
       values ($1, $2)
       on conflict (key) do update set value = excluded.value`,
      [key, value === undefined || value === null ? null : String(value)]
    );
  }
  return getAll();
}
