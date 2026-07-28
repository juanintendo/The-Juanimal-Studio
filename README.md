# The Juanimal Studio

Portfolio site for **The Juanimal Studio** — UX/UI, web & app development, AI, and business tools — with a **1940s aged halftone print** look.

Stack: **Next.js 15** · **React 19** · **TypeScript** · **Tailwind CSS** (tokens + utilities; pixel-perfect styling lives in design CSS).

## Local development

```bash
npm install
npm run dev
```

- Home: [http://localhost:3000](http://localhost:3000)
- Merch: [http://localhost:3000/merch](http://localhost:3000/merch)

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push the repo to GitHub
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
3. Framework: Next.js (auto-detected) → **Deploy**

Every push to `main` redeploys automatically. See [GITHUB_VERCEL_QUICKSTART.md](./GITHUB_VERCEL_QUICKSTART.md) for a short checklist.

## Project structure

```
app/                 App Router routes: / and /merch
components/          Nav, Hero, Services, MerchShop, etc.
hooks/               Scroll, reveal, reduced-motion helpers
public/images/       Logos, stars, service icons, merch art
_legacy/             Original HTML (visual reference only)
```

## Design notes

- Brand CSS is kept close to the legacy look in `app/globals.css`.
- Tailwind maps the same color/font tokens in `tailwind.config.ts`.
- **Preflight is disabled** on purpose so Tailwind does not fight the custom print CSS.
- Site language is **English** (`lang="en"`).

## Agent / contributor rules

Cursor and other AI agents should follow **[AGENTS.md](./AGENTS.md)**. Project rules also live under `.cursor/rules/`.
