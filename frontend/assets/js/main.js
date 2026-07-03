import * as nav from './nav.js';
import * as animations from './animations.js';
import * as catalog from './catalog.js';
import * as cart from './cart.js';
import * as reviews from './reviews.js';
import * as subscription from './subscription.js';
import * as effects from './effects.js';
import * as cookieBanner from './cookie-banner.js';
import * as i18n from './i18n.js';
import * as dataNotice from './data-notice.js';
import * as gsapAnimations from './gsap-animations.js';

const boot = async () => {
  i18n.init();
  nav.init();
  animations.init();
  cart.init();
  reviews.init();
  subscription.init();
  cookieBanner.init();
  dataNotice.init();
  await catalog.init(); // ждём, чтобы карточки уже были в DOM для tilt-эффектов
  effects.init();
  gsapAnimations.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
