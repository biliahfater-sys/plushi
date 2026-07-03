import { api, ApiError } from './api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setMessage(msgEl, text, type) {
  msgEl.className = 'subscribe__msg' + (type ? ' is-' + type : '');
  msgEl.textContent = text;
}

function validateConsent(form) {
  const consent = form.querySelector('input[name="consent"]');
  if (!consent) return true;
  if (!consent.checked) {
    consent.focus();
    return false;
  }
  return true;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const input = form.querySelector('input[type="email"]');
  const submit = form.querySelector('button[type="submit"]');
  const msg = document.querySelector('[data-subscribe-msg]');
  const email = input.value.trim();

  if (!EMAIL_RE.test(email)) {
    setMessage(msg, 'Похоже, в email опечатка', 'error');
    input.focus();
    return;
  }

  if (!validateConsent(form)) {
    setMessage(msg, 'Для подписки нужно согласие на обработку email', 'error');
    return;
  }

  submit.disabled = true;
  setMessage(msg, 'Отправляем…');

  try {
    const res = await api.subscribe(email, true);
    setMessage(msg, res.message, 'success');
    form.reset();
  } catch (err) {
    const text =
      err instanceof ApiError && err.details?.email
        ? err.details.email
        : err?.message || 'Что-то пошло не так';
    setMessage(msg, text, 'error');
  } finally {
    submit.disabled = false;
  }
}

export function init() {
  const form = document.querySelector('[data-subscribe]');
  form?.addEventListener('submit', handleSubmit);
}
