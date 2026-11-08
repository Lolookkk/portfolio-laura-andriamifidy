import { query } from '../config/db.js';

/**
 * Récupère un utilisateur par email (inclut le hash pour la vérification).
 * @param {string} email
 */
export async function findByEmail(email) {
  const { rows } = await query(
    'select id, email, password_hash, role, created_at from users where email = $1',
    [email]
  );
  return rows[0] || null;
}

/**
 * Récupère un utilisateur par identifiant (sans le hash).
 * @param {number} id
 */
export async function findById(id) {
  const { rows } = await query(
    'select id, email, role, created_at from users where id = $1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Insère un utilisateur ou met à jour son mot de passe s'il existe déjà.
 * @param {string} email
 * @param {string} passwordHash
 * @param {string} [role]
 */
export async function upsert(email, passwordHash, role = 'admin') {
  const { rows } = await query(
    `insert into users (email, password_hash, role)
     values ($1, $2, $3)
     on conflict (email) do update set password_hash = excluded.password_hash
     returning id, email, role, created_at`,
    [email, passwordHash, role]
  );
  return rows[0];
}
