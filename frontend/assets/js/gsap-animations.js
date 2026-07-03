/**
 * GSAP + ScrollTrigger анимации для лендинга «Плюши».
 * Подключается только если библиотека загружена с CDN.
 * При включённом prefers-reduced-motion анимации пропускаются.
 */

const PRODUCT_CLEAR_PROPS = 'opacity,visibility,transform,translate,rotate,scale';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isAvailable() {
  return typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
}

function initScrollAnimations(gsap, ScrollTrigger) {
  // Параллакс главной иллюстрации при скролле
  gsap.to('.hero__art', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Параллакс фото в разделе «О нас»
  gsap.to('.about__photo img', {
    y: -50,
    scale: 1.05,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Появление цифр в херо-статистике
  ScrollTrigger.batch('.hero__stats-bar-item', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    },
  });

  // Появление фактов в разделе «О нас»
  ScrollTrigger.batch('.about__fact', {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        autoAlpha: 0,
        y: 25,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    },
  });

}

export function resetProductStyles() {
  if (!isAvailable()) return;

  const cards = document.querySelectorAll('.product');
  if (cards.length === 0) return;

  window.gsap.set(cards, { clearProps: PRODUCT_CLEAR_PROPS });
}

export function init() {
  if (!isAvailable()) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  document.body.classList.add('has-gsap');

  if (prefersReducedMotion()) {
    // Всё остаётся видимым, сложные движения не запускаем
    gsap.set(
      '.hero__title-line, .hero__subtitle, .hero__actions, .hero__trust, .hero__art, .hero__float-card',
      { autoAlpha: 1, y: 0, x: 0, scale: 1 },
    );
    gsap.set('.product', { clearProps: PRODUCT_CLEAR_PROPS });
    return;
  }

  initScrollAnimations(gsap, ScrollTrigger);
  resetProductStyles();

  // Пересчитываем триггеры после полной загрузки шрифтов/изображений
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
