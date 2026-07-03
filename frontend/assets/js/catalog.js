import { api } from './api.js';
import * as cart from './cart.js';
import * as gsapAnimations from './gsap-animations.js';

const CATEGORY_IMAGE = {
  rabbits: '/assets/images/plush-rabbit.jpg',
  bears: '/assets/images/plush-bear.jpg',
  cats: '/assets/images/plush-cat.jpg',
};

// Дополнительные мета-данные для карточек (бейджи, старые цены, рейтинги).
// В реальном проекте это пришло бы с бэка — здесь зашиваем по id.
const PRODUCT_META = {
  'bunny-mia':  { badge: 'hit',  rating: 4.9, oldPrice: 2190 },
  'bunny-leo':  { badge: 'new',  rating: 4.8 },
  'bunny-nora': { badge: null,   rating: 4.9 },
  'bear-tom':   { badge: 'hit',  rating: 5.0, oldPrice: 2590 },
  'bear-bella': { badge: null,   rating: 4.8 },
  'bear-oskar': { badge: 'soft', rating: 4.9 },
  'cat-luna':   { badge: 'hit',  rating: 5.0 },
  'cat-pixie':  { badge: 'new',  rating: 4.8 },
  'cat-mochi':  { badge: 'soft', rating: 4.9, oldPrice: 2490 },
};

const BADGE_LABELS = {
  hit: 'хит',
  new: 'новинка',
  soft: 'эко',
};

const FAVORITES_KEY = 'plushi.favorites.v1';

let products = [];
let activeFilter = 'all';
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

function format(n) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

function productImage(product) {
  return product.image || CATEGORY_IMAGE[product.category] || '/assets/images/plush-rabbit.jpg';
}

function badgeHtml(type) {
  if (!type) return '';
  return `<span class="product__badge product__badge--${type}">${BADGE_LABELS[type]}</span>`;
}

function ratingHtml(rating) {
  if (!rating) return '';
  return `
    <span class="product__rating" aria-label="Рейтинг ${rating}">
      <svg aria-hidden="true"><use href="#i-star"/></svg>
      ${rating.toFixed(1)}
    </span>
  `;
}

function favHtml(id) {
  const isFav = favorites.has(id);
  return `
    <button
      class="product__fav ${isFav ? 'is-active' : ''}"
      type="button"
      data-fav="${id}"
      aria-label="Добавить в избранное"
      aria-pressed="${isFav}"
    >
      <svg aria-hidden="true"><use href="#i-heart"/></svg>
    </button>
  `;
}

function priceHtml(price, oldPrice) {
  const old = oldPrice
    ? `<span class="product__price-old">${format(oldPrice)}</span>`
    : '';
  return `
    <div class="product__price">
      ${old}
      <span class="product__price-current">${format(price)}</span>
    </div>
  `;
}

function cardHtml(product) {
  const meta = PRODUCT_META[product.id] ?? {};
  const image = productImage(product);
  const alt = `${product.name} — мягкая игрушка ручной работы`;

  return `
    <article class="product product--${product.category}">
      ${badgeHtml(meta.badge)}
      ${favHtml(product.id)}

      <div class="product__media">
        <img
          class="product__photo"
          src="${image}"
          alt="${alt}"
          loading="lazy"
          width="400"
          height="400"
        />
      </div>

      <div class="product__body">
        <div class="product__top">
          <h3 class="product__name">${product.name}</h3>
          ${ratingHtml(meta.rating)}
        </div>
        <p class="product__desc">${product.description}</p>
      </div>

      <div class="product__foot">
        ${priceHtml(product.price, meta.oldPrice)}
        <button class="btn btn--primary btn--sm" data-add="${product.id}">
          В корзину
        </button>
      </div>
    </article>
  `;
}

function renderCounters() {
  const totals = { all: products.length, rabbits: 0, bears: 0, cats: 0 };
  for (const p of products) totals[p.category] = (totals[p.category] || 0) + 1;

  for (const [key, value] of Object.entries(totals)) {
    const el = document.querySelector(`[data-count-${key}]`);
    if (el) el.textContent = value;
  }
}

function render() {
  const grid = document.querySelector('[data-products]');
  if (!grid) return;

  const list =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);

  if (list.length === 0) {
    grid.innerHTML =
      '<div class="catalog__placeholder">В этой категории пока пусто</div>';
    return;
  }

  grid.classList.remove('is-visible');
  grid.classList.add('reveal-stagger');
  grid.innerHTML = list.map(cardHtml).join('');

  // принудительно перезапускаем stagger для новой выборки
  void grid.offsetWidth;
  requestAnimationFrame(() => grid.classList.add('is-visible'));

  // Clear any stale animation inline styles after replacing product nodes.
  gsapAnimations.resetProductStyles();
}

function bindFilters() {
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });
}

function bindGrid() {
  const grid = document.querySelector('[data-products]');
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      cart.add(addBtn.dataset.add);
      flashButton(addBtn);
      return;
    }

    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      toggleFavorite(favBtn.dataset.fav, favBtn);
      return;
    }
  });
}

function toggleFavorite(id, btn) {
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  } else {
    favorites.add(id);
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
  }
  saveFavorites();
}

function flashButton(btn) {
  const original = btn.textContent;
  btn.textContent = 'Добавлено';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 900);
}

export async function init() {
  try {
    const { items } = await api.getProducts();
    products = items;
    cart.setCatalog(products);
    renderCounters();
    render();
    bindFilters();
    bindGrid();
  } catch (err) {
    const grid = document.querySelector('[data-products]');
    if (grid) {
      grid.innerHTML = `<div class="catalog__placeholder">Не удалось загрузить каталог. Попробуйте обновить страницу.</div>`;
    }
    console.error(err);
  }
}
