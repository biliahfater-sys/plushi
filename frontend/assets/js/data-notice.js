import { t } from './i18n.js';

const COOKIE_CONSENT_KEY = 'plushi.cookie-consent.v1';

function renderContent() {
  return `
    <div class="data-notice__body">
      <p class="data-notice__intro">${t('dataNotice.intro')}</p>

      <h3 class="data-notice__subtitle">${t('dataNotice.categories')}</h3>
      <ul class="data-notice__list">
        <li>
          <strong>${t('dataNotice.cookies')}</strong>
          <span>${t('dataNotice.cookiesDesc')}</span>
        </li>
        <li>
          <strong>${t('dataNotice.forms')}</strong>
          <span>${t('dataNotice.formsDesc')}</span>
        </li>
        <li>
          <strong>${t('dataNotice.analytics')}</strong>
          <span>${t('dataNotice.analyticsDesc')}</span>
        </li>
      </ul>

      <h3 class="data-notice__subtitle">${t('dataNotice.rights')}</h3>
      <p>${t('dataNotice.rightsDesc')}</p>

      <button type="button" class="btn btn--ghost btn--sm" data-notice-withdraw>
        ${t('dataNotice.withdraw')}
      </button>
    </div>
  `;
}

function createModal() {
  const existing = document.querySelector('[data-data-notice]');
  if (existing) return existing;

  const dialog = document.createElement('dialog');
  dialog.className = 'data-notice';
  dialog.setAttribute('data-data-notice', '');
  dialog.setAttribute('aria-modal', 'true');
  dialog.innerHTML = `
    <div class="data-notice__panel">
      <header class="data-notice__head">
        <h2 class="data-notice__title">${t('dataNotice.title')}</h2>
        <button type="button" class="data-notice__close" data-notice-close aria-label="${t('cart.close')}">
          <svg width="20" height="20" aria-hidden="true"><use href="#i-close"/></svg>
        </button>
      </header>
      ${renderContent()}
    </div>
  `;

  document.body.appendChild(dialog);
  bindDialog(dialog);
  return dialog;
}

function bindDialog(dialog) {
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  dialog.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-notice-close]');
    if (closeBtn) close();

    const withdrawBtn = e.target.closest('[data-notice-withdraw]');
    if (withdrawBtn) withdrawConsent();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });
}

export function open() {
  const dialog = document.querySelector('[data-data-notice]') || createModal();
  dialog.querySelector('.data-notice__body')?.replaceWith(
    document.createRange().createContextualFragment(`<div class="data-notice__body">${renderContent()}</div>`).firstElementChild,
  );
  document.body.style.overflow = 'hidden';
  dialog.showModal();
}

export function close() {
  const dialog = document.querySelector('[data-data-notice]');
  if (dialog) {
    dialog.close();
    document.body.style.overflow = '';
  }
}

export function withdrawConsent() {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem('plushi.cart.v1');
    localStorage.removeItem('plushi.favorites.v1');
    localStorage.removeItem('plushi.lang.v1');
  } catch {}
  window.location.reload();
}

export function init() {
  document.querySelectorAll('[data-open-data-notice]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  window.addEventListener('plushi:langchange', () => {
    const dialog = document.querySelector('[data-data-notice]');
    if (dialog && dialog.open) {
      dialog.querySelector('.data-notice__title').textContent = t('dataNotice.title');
      dialog.querySelector('.data-notice__body')?.replaceWith(
        document.createRange().createContextualFragment(`<div class="data-notice__body">${renderContent()}</div>`).firstElementChild,
      );
    }
  });
}
