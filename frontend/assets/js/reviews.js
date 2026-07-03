const REVIEWS = [
  {
    name: 'Анна К.',
    initials: 'АК',
    stars: 5,
    text: 'Заказывала кролика Мию для дочки на день рождения. Перед отправкой прислали фото, я сразу увидела швы и упаковку. Игрушка приехала мягкая, аккуратная, дочка спит с ней каждый день.',
    product: 'Кролик Мия',
    detail: 'проверила фото до доставки',
  },
  {
    name: 'Мария Л.',
    initials: 'МЛ',
    stars: 5,
    text: 'Покупала мишку Тома себе, потому что захотелось кусочка детства. Ткань плотная и очень приятная, швы ровные, ничего не торчит. Видно, что это не фабричная игрушка из потока.',
    product: 'Мишка Том',
    detail: 'видно ручную работу',
  },
  {
    name: 'Елена П.',
    initials: 'ЕП',
    stars: 5,
    text: 'Подарила котёнка Луну подруге на новоселье. Коробку даже не пришлось переупаковывать: лента, открытка, всё выглядело как готовый подарок. Подруга расплакалась от умиления.',
    product: 'Котёнок Луна',
    detail: 'упаковка уже подарочная',
  },
  {
    name: 'Дарья С.',
    initials: 'ДС',
    stars: 5,
    text: 'Долго выбирала между мастерскими и не прогадала. Быстро ответили по заказу, уточнили пожелания и отправили вовремя. Плюшка пахнет лавандой и уютом, теперь хочу собрать коллекцию.',
    product: 'Крольчиха Нора',
    detail: 'быстро согласовали заказ',
  },
];

const AUTOPLAY_MS = 5500;

let index = 0;
let timer = null;

function starSvg(filled) {
  return `<svg width="16" height="16" aria-hidden="true" ${filled ? '' : 'class="review__star--empty"'}><use href="#i-star"/></svg>`;
}

function reviewHtml(r) {
  const stars = Array.from({ length: 5 }, (_, i) => starSvg(i < r.stars)).join('');
  return `
    <li class="review">
      <span class="review__quote" aria-hidden="true">"</span>
      <div class="review__avatar">${r.initials}</div>
      <div>
        <div class="review__name">${r.name}</div>
        <div class="review__stars" aria-label="${r.stars} из 5">${stars}</div>
        <p class="review__text">${r.text}</p>
        <div class="review__meta">
          ${r.product ? `<span class="review__product"><svg width="14" height="14" aria-hidden="true"><use href="#i-basket"/></svg> ${r.product}</span>` : ''}
          ${r.detail ? `<span class="review__detail"><svg width="14" height="14" aria-hidden="true"><use href="#i-star"/></svg> ${r.detail}</span>` : ''}
        </div>
      </div>
    </li>
  `;
}

function render() {
  const track = document.querySelector('[data-reviews-track]');
  const dotsBox = document.querySelector('[data-reviews-dots]');
  if (!track || !dotsBox) return;

  track.innerHTML = REVIEWS.map(reviewHtml).join('');
  dotsBox.innerHTML = REVIEWS.map(
    (_, i) =>
      `<button class="reviews__dot" data-go="${i}" aria-label="Отзыв ${i + 1}"></button>`,
  ).join('');

  update();
}

function update() {
  const track = document.querySelector('[data-reviews-track]');
  const dots = document.querySelectorAll('[data-go]');
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
}

function go(i) {
  index = (i + REVIEWS.length) % REVIEWS.length;
  update();
  restartAutoplay();
}

const next = () => go(index + 1);
const prev = () => go(index - 1);

function startAutoplay() {
  stopAutoplay();
  timer = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (timer) clearInterval(timer);
  timer = null;
}

function restartAutoplay() {
  if (timer) startAutoplay();
}

function bind() {
  document.querySelector('[data-reviews-prev]')?.addEventListener('click', prev);
  document.querySelector('[data-reviews-next]')?.addEventListener('click', next);

  document.querySelector('[data-reviews-dots]')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-go]');
    if (btn) go(Number(btn.dataset.go));
  });

  const slider = document.querySelector('[data-reviews]');
  slider?.addEventListener('mouseenter', stopAutoplay);
  slider?.addEventListener('mouseleave', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });
}

export function init() {
  if (!document.querySelector('[data-reviews]')) return;
  render();
  bind();
  startAutoplay();
}
