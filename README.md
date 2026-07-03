# Плюши 🌸

[![CI](https://github.com/biliahfater-sys/plushi/actions/workflows/ci.yml/badge.svg)](https://github.com/biliahfater-sys/plushi/actions/workflows/ci.yml)

Одностраничный лендинг с каталогом и корзиной для авторской мастерской плюшевых игрушек. Пастельный дизайн, мягкие анимации, серверная часть на Node.js / Express.

> Демонстрационный проект. Форма заказа и подписки могут работать в demo-режиме (без реального SMTP) — см. `.env.example`.

## Стек

- **Backend** — Node.js 18+, Express, nodemailer
- **Frontend (vanilla)** — HTML5, CSS (custom properties), vanilla JS (ES Modules)
- **Frontend (React/Vite)** — React 19, Vite, TypeScript, Tailwind CSS в папке `web/`
- **Хранилище** — JSON-файлы (каталог, подписчики)

## Структура проекта

```
plushi/
├── backend/          # Express API + раздача статики
├── frontend/         # HTML/CSS/JS лендинг
├── web/              # Альтернативная React + Vite версия
├── start.cmd         # Windows-скрипт запуска backend
└── README.md
```

## Быстрый старт

### Backend + vanilla frontend

```bash
cd backend
cp .env.example .env          # необязательно — без SMTP работает demo-режим
npm install
npm run dev                   # http://localhost:4000
```

Фронтенд раздаётся тем же сервером, отдельно ничего поднимать не нужно.

### React/Vite версия

```bash
cd web
npm install
npm run dev                   # http://localhost:5173
```

## Переменные окружения

См. `backend/.env.example`. Все переменные опциональны: без SMTP почтовый сервис пишет письма в консоль.

## CI

GitHub Actions запускает проверку `backend` (npm install + npm start smoke test) и `web` (npm ci + npm run build).

## Деплой

- **Backend** — любая Node.js-платформа (Render, Railway, VPS).
- **Vanilla frontend** — раздаётся через Express, либо можно выложить `frontend/` на статический хостинг.
- **React-версия** — `cd web && npm run build` создаёт статику в `web/dist/` для GitHub Pages / Netlify / Vercel / Cloudflare Pages.

## Лицензия

MIT
