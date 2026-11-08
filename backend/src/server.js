import 'dotenv/config';
import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[server] API portfolio démarrée sur http://localhost:${PORT}`);
});

// Test de connexion à la base (sans planter si elle est injoignable).
pool
  .query('select 1')
  .then(() => {
    console.log('[server] Connexion à la base de données réussie.');
  })
  .catch((err) => {
    console.error(
      '[server] Connexion à la base de données impossible :',
      err.message
    );
  });
