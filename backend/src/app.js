import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = resolve(__dirname, '../../frontend');

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '64kb' }));

  app.use('/api', apiRouter);

  // Раздаём статику фронтенда — удобно запускать одной командой
  app.use(express.static(FRONTEND_DIR));

  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
};
