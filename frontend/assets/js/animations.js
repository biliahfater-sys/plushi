const observerOptions = {
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.12,
};

function createObserver() {
  return new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
}

export function init() {
  if (!('IntersectionObserver' in window)) {
    document
      .querySelectorAll('.reveal, .reveal-stagger')
      .forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = createObserver();
  document
    .querySelectorAll('.reveal, .reveal-stagger')
    .forEach((el) => observer.observe(el));

  // Динамически добавляемые элементы (карточки каталога после загрузки)
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('.reveal, .reveal-stagger')) observer.observe(node);
        node.querySelectorAll?.('.reveal, .reveal-stagger').forEach((el) =>
          observer.observe(el),
        );
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}
