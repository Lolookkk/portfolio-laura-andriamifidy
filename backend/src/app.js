import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();
app.use(helmet());

const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl ? clientUrl.split(',') : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
