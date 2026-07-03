import { AppError } from '../utils/AppError.js';

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details ?? undefined,
    });
  }

  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};
