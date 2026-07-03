/**
 * Анимированные счётчики — запускаются при появлении в видимой области
 */
function animateCounter(el) {
  const target = Number(el.dataset.target) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = new Intl.NumberFormat('ru-RU').format(value) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((c) => observer.observe(c));
}

/**
 * Лёгкий parallax для декоративных blobs в hero — без библиотек.
 * Используется rAF, чтобы не дёргать DOM на каждый scroll-event.
 */
function initParallax() {
  const blobs = document.querySelectorAll('.hero__blob, .hero__plate');
  if (blobs.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 0.04;
      blob.style.transform = `translateY(${y * speed}px)`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
}

/**
 * Магнитный эффект на главных кнопках — лёгкое смещение к курсору.
 * Только для устройств с тонким наведением.
 */
function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const targets = document.querySelectorAll('.btn--primary');

  targets.forEach((btn) => {
    btn.classList.add('magnet');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/**
 * 3D tilt на карточках товаров. Делегируем — карточки могут перерисовываться.
 */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const grid = document.querySelector('[data-products]');
  if (!grid) return;

  const MAX = 6; // максимальный наклон в градусах

  grid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.product');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg)`;
    updateSpotlight(card, e.clientX, e.clientY, rect);
  });

  grid.addEventListener('mouseleave', (e) => {
    if (e.target.classList?.contains('product')) {
      e.target.style.transform = '';
      e.target.style.setProperty('--spotlight-x', '50%');
      e.target.style.setProperty('--spotlight-y', '50%');
    }
  });

  grid.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.product');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
      card.style.setProperty('--spotlight-x', '50%');
      card.style.setProperty('--spotlight-y', '50%');
    }
  });
}

function updateSpotlight(card, clientX, clientY, rect) {
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  card.style.setProperty('--spotlight-x', `${x}%`);
  card.style.setProperty('--spotlight-y', `${y}%`);
}

/**
 * Плавная прокрутка по якорным ссылкам.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/**
 * Подсветка активного пункта навигации при скролле.
 */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav__link[href^="#"]');
  if (sections.length === 0 || links.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
  );

  sections.forEach((s) => observer.observe(s));
}

/**
 * Индикатор прогресса прокрутки страницы.
 */
function initScrollProgress() {
  const bar = document.querySelector('[data-scroll-progress]');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

/**
 * Кнопка «наверх».
 */
function initBackToTop() {
  const btn = document.querySelector('[data-back-to-top]');
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 500;
    btn.hidden = !show;
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function init() {
  initScrollProgress();
  initBackToTop();
  initSmoothScroll();
  initActiveNav();
  initCounters();
  initParallax();
  initMagneticButtons();
  initCardTilt();
}
