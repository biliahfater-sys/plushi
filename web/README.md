# Плюши — React frontend

A full React + TypeScript + Tailwind v4 rebuild of the «Плюши» plush-toy store,
with the four reference components from `добавить.txt` integrated on-brand.

## Stack
- Vite + React 18 + TypeScript
- Tailwind v4 (design tokens in `src/index.css` `@theme`)
- shadcn-style structure (`components/ui`, `lib/utils` `cn`)
- framer-motion (reveals, parallax, drawer), lenis (smooth scroll)
- three (pastel shader, lazy-loaded), lucide-react (icons)

## Integrated components (`src/components/ui/`)
| Component | Where it lives | On-brand adaptation |
|-----------|----------------|---------------------|
| `ink-reveal` | Hero photo | cream ink mask wiped on hover to reveal the plush |
| `zoom-parallax` | Gallery section | scroll-zoom gallery of plush frames |
| `shader-animation` | Subscribe band | GLSL recolored to cream/pink/lavender/mint, soft backdrop |
| `liquid-glass` | About badge | glass effect reused for a "100% ручная работа" badge (dock demo dropped) |

## Run (dev)
The Express backend must be running first (serves `/api` on **:4005**):

```bash
# terminal 1 — backend
cd ../backend
npm install
npm start            # http://localhost:4005

# terminal 2 — this app
npm install
npm run dev          # http://localhost:5173  (proxies /api -> :4005)
```

## Build
```bash
npm run build        # tsc -b && vite build  → dist/
npm run lint         # eslint, clean
```

Three.js ships as a separate lazy chunk (`shader-animation-*.js`), so the
initial bundle stays light and the shader loads only when the Subscribe band
scrolls into view.
