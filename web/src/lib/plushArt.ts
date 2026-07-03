import type { Category } from "./types";

/**
 * Offline, on-brand product imagery: cute pastel plush illustrations rendered
 * as inline SVG data-URIs. One species per category, one colour theme per
 * product, so the catalog / cart / gallery all share a consistent look without
 * any external photo assets.
 */

type Species = "rabbit" | "bear" | "cat";

interface Theme {
  body: string;
  deep: string;
  soft: string;
  muzzle: string;
  cheek: string;
  bow: string;
  bg1: string;
  bg2: string;
}

const THEMES: Record<string, Theme> = {
  pink: { body: "#ffd9e4", deep: "#f7b8cc", soft: "#ffe8ee", muzzle: "#fff5f8", cheek: "#ffb8cc", bow: "#c5b3f0", bg1: "#fff1f6", bg2: "#ffe1ec" },
  lavender: { body: "#e3d6ff", deep: "#c5b3f0", soft: "#f0e9ff", muzzle: "#f4eeff", cheek: "#d4c2ff", bow: "#ffd1e0", bg1: "#f3eeff", bg2: "#e7ddff" },
  mint: { body: "#cdf2e2", deep: "#a5e1c5", soft: "#e3f7ed", muzzle: "#edfbf4", cheek: "#a5e1c5", bow: "#f7b8cc", bg1: "#eafaf2", bg2: "#d8f2e6" },
  peach: { body: "#ffe1cc", deep: "#ffc9a8", soft: "#fff0e6", muzzle: "#fff7f0", cheek: "#ffc1a0", bow: "#e3d6ff", bg1: "#fff3ea", bg2: "#ffe3d2" },
};

const INK = "#4a3f55";
const NOSE = "#e08aa8";

// product id -> species + theme
const PRODUCT_ART: Record<string, { species: Species; theme: keyof typeof THEMES }> = {
  "bunny-mia": { species: "rabbit", theme: "pink" },
  "bunny-leo": { species: "rabbit", theme: "lavender" },
  "bunny-nora": { species: "rabbit", theme: "mint" },
  "bear-tom": { species: "bear", theme: "pink" },
  "bear-bella": { species: "bear", theme: "lavender" },
  "bear-oskar": { species: "bear", theme: "mint" },
  "cat-luna": { species: "cat", theme: "peach" },
  "cat-pixie": { species: "cat", theme: "lavender" },
  "cat-mochi": { species: "cat", theme: "mint" },
};

const FALLBACK_SPECIES: Record<Category, Species> = {
  rabbits: "rabbit",
  bears: "bear",
  cats: "cat",
};

function face(t: Theme, sleepy = false): string {
  const eyes = sleepy
    ? `<path d="M150 196 q12 -12 24 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <path d="M226 196 q12 -12 24 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="162" cy="202" rx="12" ry="15" fill="${INK}"/>
       <ellipse cx="238" cy="202" rx="12" ry="15" fill="${INK}"/>
       <circle cx="166" cy="197" r="4" fill="#fff"/><circle cx="242" cy="197" r="4" fill="#fff"/>`;
  return `
    <ellipse cx="200" cy="248" rx="70" ry="56" fill="${t.muzzle}"/>
    <circle cx="138" cy="244" r="17" fill="${t.cheek}" opacity="0.5"/>
    <circle cx="262" cy="244" r="17" fill="${t.cheek}" opacity="0.5"/>
    ${eyes}
    <path d="M188 244 Q200 256 212 244 Q206 264 200 264 Q194 264 188 244 Z" fill="${NOSE}"/>
    <path d="M200 264 Q190 278 182 274" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M200 264 Q210 278 218 274" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>`;
}

function bow(cx: number, cy: number, t: Theme): string {
  return `<g transform="translate(${cx} ${cy})">
    <path d="M0 0 L-22 -14 L-18 12 Z" fill="${t.bow}"/>
    <path d="M0 0 L22 -14 L18 12 Z" fill="${t.bow}"/>
    <circle cx="0" cy="0" r="8" fill="${t.deep}"/>
  </g>`;
}

function rabbit(t: Theme): string {
  return `
    <ellipse cx="148" cy="92" rx="30" ry="72" fill="${t.deep}" transform="rotate(-10 148 92)"/>
    <ellipse cx="252" cy="92" rx="30" ry="72" fill="${t.deep}" transform="rotate(10 252 92)"/>
    <ellipse cx="148" cy="104" rx="15" ry="48" fill="${t.soft}" transform="rotate(-10 148 104)"/>
    <ellipse cx="252" cy="104" rx="15" ry="48" fill="${t.soft}" transform="rotate(10 252 104)"/>
    <ellipse cx="200" cy="232" rx="124" ry="116" fill="${t.body}"/>
    ${face(t)}
    ${bow(252, 44, t)}`;
}

function bear(t: Theme): string {
  return `
    <circle cx="120" cy="118" r="42" fill="${t.deep}"/>
    <circle cx="280" cy="118" r="42" fill="${t.deep}"/>
    <circle cx="120" cy="118" r="23" fill="${t.soft}"/>
    <circle cx="280" cy="118" r="23" fill="${t.soft}"/>
    <circle cx="200" cy="222" r="128" fill="${t.body}"/>
    ${face(t)}
    ${bow(126, 96, t)}`;
}

function cat(t: Theme, sleepy = false): string {
  return `
    <path d="M104 150 L150 70 L196 158 Z" fill="${t.deep}"/>
    <path d="M296 150 L250 70 L204 158 Z" fill="${t.deep}"/>
    <path d="M126 144 L154 96 L182 150 Z" fill="${t.soft}"/>
    <path d="M274 144 L246 96 L218 150 Z" fill="${t.soft}"/>
    <circle cx="200" cy="226" r="120" fill="${t.body}"/>
    ${face(t, sleepy)}
    <g stroke="${INK}" stroke-width="2" opacity="0.4" stroke-linecap="round">
      <line x1="120" y1="250" x2="158" y2="248"/><line x1="120" y1="262" x2="158" y2="258"/>
      <line x1="280" y1="250" x2="242" y2="248"/><line x1="280" y1="262" x2="242" y2="258"/>
    </g>
    ${bow(120, 150, t)}`;
}

function speciesArt(species: Species, theme: Theme, sleepy: boolean): string {
  if (species === "rabbit") return rabbit(theme);
  if (species === "bear") return bear(theme);
  return cat(theme, sleepy);
}

function buildSvg(species: Species, themeKey: keyof typeof THEMES, sleepy = false): string {
  const t = THEMES[themeKey];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.46" r="0.55">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="64" cy="70" r="6" fill="${t.deep}" opacity="0.45"/>
    <circle cx="340" cy="92" r="5" fill="${t.deep}" opacity="0.4"/>
    <circle cx="320" cy="320" r="7" fill="${t.deep}" opacity="0.35"/>
    <circle cx="70" cy="320" r="5" fill="${t.deep}" opacity="0.4"/>
    <ellipse cx="200" cy="356" rx="120" ry="16" fill="${INK}" opacity="0.06"/>
    <circle cx="200" cy="210" r="190" fill="url(#glow)"/>
    ${speciesArt(species, t, sleepy)}
  </svg>`;
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, " ")}`;
}

/** Data-URI plush image for a given product id (falls back to category). */
export function plushImageFor(id: string, category: Category): string {
  const art = PRODUCT_ART[id] ?? { species: FALLBACK_SPECIES[category], theme: "pink" as const };
  const sleepy = id === "cat-luna";
  return toDataUri(buildSvg(art.species, art.theme, sleepy));
}

/** A curated spread of plush frames for the gallery (7 frames). */
export const GALLERY_PLUSH: { src: string; alt: string }[] = [
  { src: toDataUri(buildSvg("rabbit", "pink")), alt: "Кролик Мия" },
  { src: toDataUri(buildSvg("bear", "lavender")), alt: "Мишка Белла" },
  { src: toDataUri(buildSvg("cat", "mint")), alt: "Котёнок Моти" },
  { src: toDataUri(buildSvg("rabbit", "mint")), alt: "Крольчиха Нора" },
  { src: toDataUri(buildSvg("bear", "pink")), alt: "Мишка Том" },
  { src: toDataUri(buildSvg("cat", "peach", true)), alt: "Котёнок Луна" },
  { src: toDataUri(buildSvg("rabbit", "lavender")), alt: "Кролик Лео" },
];
