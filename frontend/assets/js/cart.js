import { api, ApiError } from './api.js';
import { events } from './events.js';

const STORAGE_KEY = 'plushi.cart.v1';
const CATEGORY_ICON = {
  rabbits: 'plush-rabbit',
  bears: 'plush-bear',
  cats: 'plush-cat',
};

const state = {
  items: load(),
  catalog: new Map(),
};

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function totalQty() {
  return state.items.reduce((sum, i) => sum + i.qty, 0);
}

function totalPrice() {
  return state.items.reduce((sum, i) => {
    const p = state.catalog.get(i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function format(n) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

export function setCatalog(products) {
  state.catalog = new Map(products.map((p) => [p.id, p]));
  render();
}

export function add(productId) {
  const existing = state.items.find((i) => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, 20);
  } else {
    state.items.push({ id: productId, qty: 1 });
  }
  persist();
  render();
  events.emit('cart:added');

  const cartBtn = document.querySelector('.cart-button');
  if (cartBtn) {
    cartBtn.classList.remove('is-pulse');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('is-pulse');
    setTimeout(() => cartBtn.classList.remove('is-pulse'), 900);
  }
}

export function changeQty(productId, delta) {
  const item = state.items.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.items = state.items.filter((i) => i.id !== productId);
  } else {
    item.qty = Math.min(item.qty, 20);
  }
  persist();
  render();
}

export function remove(productId) {
  state.items = state.items.filter((i) => i.id !== productId);
  persist();
  render();
}

export function clear() {
  state.items = [];
  persist();
  render();
}

export function open() {
  document.querySelector('[data-cart-drawer]')?.classList.add('is-open');
  document.querySelector('[data-cart-drawer]')?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function close() {
  document.querySelector('[data-cart-drawer]')?.classList.remove('is-open');
  document.querySelector('[data-cart-drawer]')?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (!badge) return;
  const qty = totalQty();
  badge.textContent = qty;
  badge.classList.toggle('is-visible', qty > 0);
  badge.classList.remove('is-bumped');
  // перезапуск анимации
  void badge.offsetWidth; // eslint-disable-line no-unused-expressions
  if (qty > 0) badge.classList.add('is-bumped');
}

function productImage(product) {
  return product.image || `/assets/images/${CATEGORY_ICON[product.category] || 'plush-rabbit'}.jpg`;
}

function renderLines() {
  const body = document.querySelector('[data-cart-body]');
  const foot = document.querySelector('[data-cart-foot]');
  const total = document.querySelector('[data-cart-total]');
  if (!body || !foot || !total) return;

  if (state.items.length === 0) {
    body.innerHTML = `
      <div class="cart-drawer__empty">
        <svg width="64" height="64" aria-hidden="true"><use href="#i-bunny"/></svg>
        <p>Здесь пока пусто. Самое время выбрать друга</p>
      </div>
    `;
    foot.hidden = true;
    return;
  }

  foot.hidden = false;
  total.textContent = format(totalPrice());

  body.innerHTML = state.items
    .map((item) => {
      const product = state.catalog.get(item.id);
      if (!product) return '';
      const icon = CATEGORY_ICON[product.category] || 'plush-rabbit';
      const image = productImage(product);
      return `
        <article class="cart-line" data-line="${product.id}">
          <div class="cart-line__thumb">
            <img src="${image}" alt="" loading="lazy" width="56" height="56" />
          </div>
          <div>
            <div class="cart-line__name">${product.name}</div>
            <div class="cart-line__price">${format(product.price)} × ${item.qty}</div>
          </div>
          <div class="cart-line__controls">
            <button class="cart-line__qty" data-dec aria-label="Меньше"><svg width="14" height="14" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <span class="cart-line__count">${item.qty}</span>
            <button class="cart-line__qty" data-inc aria-label="Больше"><svg width="14" height="14" aria-hidden="true"><use href="#i-plus"/></svg></button>
            <button class="cart-line__remove" data-remove aria-label="Удалить"><svg width="16" height="16" aria-hidden="true"><use href="#i-close"/></svg></button>
          </div>
        </article>
      `;
    })
    .join('');
}

function render() {
  renderBadge();
  renderLines();
}

function bindUi() {
  document
    .querySelector('.cart-button')
    ?.addEventListener('click', open);

  document.querySelectorAll('[data-cart-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // делегирование действий внутри drawer
  document
    .querySelector('[data-cart-body]')
    ?.addEventListener('click', (e) => {
      const line = e.target.closest('[data-line]');
      if (!line) return;
      const id = line.dataset.line;
      if (e.target.matches('[data-inc]')) changeQty(id, 1);
      else if (e.target.matches('[data-dec]')) changeQty(id, -1);
      else if (e.target.matches('[data-remove]')) remove(id);
    });

  // оформление заказа
  document
    .querySelector('[data-cart-form]')
    ?.addEventListener('submit', handleCheckout);
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

async function handleCheckout(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const msg = document.querySelector('[data-cart-msg]');
  const data = Object.fromEntries(new FormData(form).entries());

  if (!validateConsent(form)) {
    msg.className = 'cart-drawer__msg is-error';
    msg.textContent = 'Для оформления заказа нужно согласие с Политикой конфиденциальности';
    return;
  }

  msg.className = 'cart-drawer__msg';
  msg.textContent = 'Отправляем заказ…';

  try {
    const res = await api.checkout({
      customer: {
        name: data.name?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim() || undefined,
        note: data.note?.trim() || undefined,
      },
      items: state.items,
      consent: true,
    });

    msg.classList.add('is-success');
    msg.textContent = res.message || 'Заказ отправлен!';
    form.reset();
    clear();

    setTimeout(close, 1800);
  } catch (err) {
    msg.classList.add('is-error');
    if (err instanceof ApiError && err.details) {
      msg.textContent = Object.values(err.details).join(' • ');
    } else {
      msg.textContent = err?.message || 'Не удалось отправить заказ';
    }
  }
}

export function init() {
  bindUi();
  render();
}
