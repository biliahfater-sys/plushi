import type { ProductMeta } from "@/lib/types";
import type { Lang } from "@/i18n/dict";

// Display-only meta keyed by product id (badges, ratings, strike-through prices).
export const PRODUCT_META: Record<string, ProductMeta> = {
  "bunny-mia": { badge: "hit", rating: 4.9, oldPrice: 2190 },
  "bunny-leo": { badge: "new", rating: 4.8 },
  "bunny-nora": { rating: 4.9 },
  "bear-tom": { badge: "hit", rating: 5.0, oldPrice: 2590 },
  "bear-bella": { rating: 4.8 },
  "bear-oskar": { badge: "soft", rating: 4.9 },
  "cat-luna": { badge: "hit", rating: 5.0 },
  "cat-pixie": { badge: "new", rating: 4.8 },
  "cat-mochi": { badge: "soft", rating: 4.9, oldPrice: 2490 },
};

export const BADGE_LABELS: Record<Lang, Record<string, string>> = {
  ru: { hit: "хит", new: "новинка", soft: "эко" },
  en: { hit: "top", new: "new", soft: "eco" },
};

export interface Review {
  initials: string;
  stars: number;
  name: Record<Lang, string>;
  text: Record<Lang, string>;
  product: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export const REVIEWS: Review[] = [
  {
    initials: "АК",
    stars: 5,
    name: { ru: "Анна К.", en: "Anna K." },
    text: {
      ru: "Заказывала кролика Мию для дочки на день рождения. Перед отправкой прислали фото, я сразу увидела швы и упаковку. Игрушка приехала мягкая, аккуратная, дочка спит с ней каждый день.",
      en: "I ordered the Mia rabbit for my daughter's birthday. Before shipping they sent a photo, so I saw the seams and packaging right away. The toy arrived soft and neat — my daughter sleeps with it every day.",
    },
    product: { ru: "Кролик Мия", en: "Mia the Rabbit" },
    detail: { ru: "проверила фото до доставки", en: "checked the photo before delivery" },
  },
  {
    initials: "МЛ",
    stars: 5,
    name: { ru: "Мария Л.", en: "Maria L." },
    text: {
      ru: "Покупала мишку Тома себе, потому что захотелось кусочка детства. Ткань плотная и очень приятная, швы ровные, ничего не торчит. Видно, что это не фабричная игрушка из потока.",
      en: "I bought Tom the bear for myself — I wanted a piece of childhood. The fabric is dense and lovely, the seams are even, nothing sticks out. You can tell it isn't a mass-produced factory toy.",
    },
    product: { ru: "Мишка Том", en: "Tom the Bear" },
    detail: { ru: "видно ручную работу", en: "the handwork shows" },
  },
  {
    initials: "ЕП",
    stars: 5,
    name: { ru: "Елена П.", en: "Elena P." },
    text: {
      ru: "Подарила котёнка Луну подруге на новоселье. Коробку даже не пришлось переупаковывать: лента, открытка, всё выглядело как готовый подарок. Подруга расплакалась от умиления.",
      en: "I gave Luna the kitten to a friend for a housewarming. I didn't even need to rewrap the box: ribbon, card — everything looked like a finished gift. My friend cried with tenderness.",
    },
    product: { ru: "Котёнок Луна", en: "Luna the Kitten" },
    detail: { ru: "упаковка уже подарочная", en: "packaging is already gift-ready" },
  },
  {
    initials: "ДС",
    stars: 5,
    name: { ru: "Дарья С.", en: "Daria S." },
    text: {
      ru: "Долго выбирала между мастерскими и не прогадала. Быстро ответили по заказу, уточнили пожелания и отправили вовремя. Плюшка пахнет лавандой и уютом, теперь хочу собрать коллекцию.",
      en: "I spent a long time choosing between workshops and made the right call. They replied quickly, clarified my wishes and shipped on time. The plush smells of lavender and coziness — now I want the whole collection.",
    },
    product: { ru: "Крольчиха Нора", en: "Nora the Rabbit" },
    detail: { ru: "быстро согласовали заказ", en: "order agreed quickly" },
  },
];

// Gallery (zoom-parallax) — 7 frames. Center frame is the real workshop;
// surrounding frames are the plush characters and collection shots.
export const GALLERY_IMAGES: { src: string; alt: string }[] = [
  { src: "/assets/images/plush-collection.jpg", alt: "Коллекция плюшевых игрушек" },
  { src: "/assets/images/bunny-mia.jpg", alt: "Кролик Мия" },
  { src: "/assets/images/bear-tom.jpg", alt: "Мишка Том" },
  { src: "/assets/images/cat-luna.jpg", alt: "Котёнок Луна" },
  { src: "/assets/images/bunny-nora.jpg", alt: "Крольчиха Нора" },
  { src: "/assets/images/bear-bella.jpg", alt: "Мишка Белла" },
  { src: "/assets/images/cat-pixie.jpg", alt: "Котёнок Пикси" },
];
