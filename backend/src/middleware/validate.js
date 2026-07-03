import { AppError } from '../utils/AppError.js';

export const validate = (rules) => (req, res, next) => {
  const errors = {};

  for (const [field, check] of Object.entries(rules)) {
    const value = req.body?.[field];
    const result = check(value, req.body);
    if (result !== true) errors[field] = result;
  }

  if (Object.keys(errors).length > 0) {
    return next(new AppError('Ошибка валидации', 422, errors));
  }

  next();
};
