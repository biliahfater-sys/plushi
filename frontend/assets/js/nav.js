function initScrollState() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastY = -1;
  const onScroll = () => {
    const y = window.scrollY;
    if (y === lastY) return;
    lastY = y;
    header.classList.toggle('is-scrolled', y > 8);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileMenu() {
  const nav = document.querySelector('.nav');
  const toggle = nav?.querySelector('.nav__toggle');
  if (!nav || !toggle) return;

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  };

  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initActiveLinkHighlight() {
  const links = Array.from(document.querySelectorAll('.nav__link'));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        links.forEach((l) =>
          l.classList.toggle('is-active', l.getAttribute('href') === id),
        );
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );

  sections.forEach((s) => observer.observe(s));
}

export function init() {
  initScrollState();
  initMobileMenu();
  initActiveLinkHighlight();
}
