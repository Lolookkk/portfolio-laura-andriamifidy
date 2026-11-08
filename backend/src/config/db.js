import pg from 'pg';

const { Pool } = pg;

// SSL activé pour les bases distantes (Supabase), désactivé en local.
const useSSL =
  !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

/**
 * Exécute une requête SQL paramétrée et loggue proprement les erreurs.
 * @param {string} text
 * @param {any[]} [params]
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[db] Erreur de requête :', err.message);
    throw err;
  }
}
