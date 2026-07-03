import { TRANSLATIONS } from './translations.js';

const STORAGE_KEY = 'plushi.lang.v1';
const DEFAULT_LANG = 'ru';
const SUPPORTED = ['ru', 'en'];

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {}

  const browser = navigator.language?.slice(0, 2).toLowerCase();
  if (browser && SUPPORTED.includes(browser)) return browser;

  return DEFAULT_LANG;
}

let currentLang = detectInitialLang();

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
  applyLang();
}

export function t(key, fallback = '') {
  const parts = key.split('.');
  let value = TRANSLATIONS[currentLang];
  for (const part of parts) {
    if (value == null) return fallback || key;
    value = value[part];
  }
  return value ?? fallback ?? key;
}

function interpolate(template, vars = {}) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? '');
}

function updateDom() {
  document.documentElement.lang = currentLang;

  // meta
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = t('meta.title');

  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', t('meta.description'));

  // elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (typeof value !== 'string') return;

    if (el.hasAttribute('placeholder')) {
      el.placeholder = value;
    } else if (el.tagName === 'INPUT' && el.type === 'submit') {
      el.value = value;
    } else if (el.tagName === 'A' && el.dataset.i18nHref) {
      el.textContent = value;
    } else if (el.tagName === 'BUTTON') {
      const svg = el.querySelector('svg');
      if (svg) {
        el.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = ` ${value} `;
        });
        if (!el.textContent.trim()) el.append(` ${value} `);
      } else {
        el.textContent = value;
      }
    } else {
      el.textContent = value;
    }
  });

  // elements with data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    const value = t(key);
    if (typeof value === 'string') el.innerHTML = value;
  });

  // aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    el.setAttribute('aria-label', t(key));
  });

  // counter suffixes
  document.querySelectorAll('[data-i18n-suffix]').forEach((el) => {
    const key = el.dataset.i18nSuffix;
    el.dataset.suffix = t(key);
  });

  // lang switcher active state
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  // dispatch event so dynamic modules can re-render
  window.dispatchEvent(new CustomEvent('plushi:langchange', { detail: { lang: currentLang } }));
}

export function applyLang() {
  updateDom();
}

export function init() {
  applyLang();

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

export function formatPrice(n, currency = '₽') {
  const locale = currentLang === 'en' ? 'en-US' : 'ru-RU';
  return new Intl.NumberFormat(locale).format(n) + ' ' + currency;
}
