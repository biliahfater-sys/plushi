const BASE = '/api';

const request = async (path, { method = 'GET', body, signal } = {}) => {
  const options = {
    method,
    headers: { Accept: 'application/json' },
    signal,
  };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(BASE + path, options);
  } catch {
    throw new ApiError('Не удалось связаться с сервером', 0);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Ошибка запроса', res.status, data.details);
  }

  return data;
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const api = {
  getProducts: () => request('/products'),
  previewCart: (items) => request('/cart/preview', { method: 'POST', body: { items } }),
  checkout: (payload) => request('/cart/checkout', { method: 'POST', body: payload }),
  subscribe: (email, consent) => request('/subscribe', { method: 'POST', body: { email, consent } }),
};
