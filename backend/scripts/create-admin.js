import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';
import * as users from '../src/models/users.js';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage : npm run create-admin -- <email> <motdepasse>');
    process.exitCode = 1;
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await users.upsert(email, passwordHash, 'admin');

  console.log(
    `Compte administrateur prêt : ${user.email} (id ${user.id}, rôle ${user.role}).`
  );
}

main()
  .catch((err) => {
    console.error('Échec de la création du compte admin :', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
