import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Nettoyage et parsing des origines autorisées (supprime les espaces et les slashs finaux)
const rawClientUrls = process.env.CLIENT_URL || '';
const allowedOrigins = rawClientUrls
  .split(',')
  .map((url) => url.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requêtes internes / outils (curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/+$/, '');

      // Autorisé si : aucune restriction spécifiée, ou présent dans CLIENT_URL,
      // ou se termine par .vercel.app (production & aperçus Vercel), ou en local
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost')
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
