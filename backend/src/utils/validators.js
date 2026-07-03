const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (value) =>
  typeof value === 'string' && EMAIL_RE.test(value.trim());

export const isPositiveInt = (value) =>
  Number.isInteger(value) && value > 0;

export const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;
