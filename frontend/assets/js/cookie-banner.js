const COOKIE_CONSENT_KEY = 'plushi.cookie-consent.v1';

function hasConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

function acceptConsent() {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
  } catch {
    // игнорируем ошибки приватного режима
  }
}

function hideBanner(banner) {
  banner.hidden = true;
}

function showBanner(banner) {
  banner.hidden = false;
}

export function init() {
  const banner = document.querySelector('[data-cookie-banner]');
  if (!banner) return;

  if (hasConsent()) {
    hideBanner(banner);
    return;
  }

  // показываем с небольшой задержкой, чтобы не мешать первому знакомству
  const delay = window.matchMedia('(max-width: 720px)').matches ? 3200 : 1200;
  setTimeout(() => showBanner(banner), delay);

  const acceptBtn = banner.querySelector('[data-cookie-accept]');
  acceptBtn?.addEventListener('click', () => {
    acceptConsent();
    hideBanner(banner);
  });
}
