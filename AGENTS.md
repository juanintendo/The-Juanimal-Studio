# AGENTS.md — The Juanimal Studio

Rules for humans and AI agents working on this site. Prefer small, focused changes that preserve the 1940s print brand.

## Product

- **Brand:** The Juanimal Studio — Tech Wizard
- **Offer:** UX/UI, web & apps, AI implementation, business tools
- **Tone:** Bold, warm, slightly irreverent print-shop voice (not corporate SaaS)
- **Site language:** English copy and UI strings
- **Routes:** `/` (home) and `/merch` (studio merch)

## Stack

- Next.js 15 App Router, React 19, TypeScript (strict)
- Path alias: `@/*` → project root
- Tailwind 3 with **`preflight: false`** — do not re-enable without an explicit redesign
- Styling source of truth for the look: `app/globals.css`
- Tokens mirrored in `tailwind.config.ts` (`red`, `cream`, `ink`, `tan`, `rust`, font families)
- Images under `public/images/`; `next.config.ts` uses `images.unoptimized: true`
- `_legacy/` is reference only — do not ship or edit it for production features

## Design system

### Aesthetic

- **1940s aged halftone print** — Atomic Age / print-pack feel
- Paper grain overlay, ink outlines, cream-on-red (home) / ink-on-cream (merch)
- Prefer CSS/SVG/PNG assets over video or heavy external media
- Keep halftone dots readable (~9–15px grids as established); do not go ultra-fine

### Color tokens (`:root` / Tailwind)

| Token | Hex | Role |
|-------|-----|------|
| `--red` | `#E04E1F` | Home background, accents |
| `--red-deep` | `#B93A12` | Deep accent |
| `--cream` | `#F3E9CE` | Type on home, merch background |
| `--cream-dim` | `#E6D8B4` | Secondary cream |
| `--ink` | `#171009` | Text, strokes, shadows |
| `--tan` | `#C9A96B` | Supporting accent |
| `--rust` | `#6E3410` | Supporting accent |

Do not replace this palette with generic purple/indigo SaaS themes, flat gray dashboards, or unrelated “AI default” looks.

### Typography (Next.js Google fonts → CSS vars)

| Role | Family | CSS var |
|------|--------|---------|
| Display / headlines | Archivo Black | `--font-disp` |
| Logo / nav / UI caps | Montserrat 700–800 | `--font-logo` |
| Script accents | Yellowtail | `--font-script` |
| Body | Libre Franklin | `--font-body` |

Do not swap in Inter, Roboto, Arial, or system-ui as brand fonts.

### Layout & composition

- Home and merch are **brand compositions**, not admin dashboards
- **Brand first:** logo / studio name must read as a hero-level signal on the home viewport
- Home first viewport: brand, short supporting line/tagline energy, dominant hero art (logo + sunburst + stars) — avoid stuffing stats, schedules, or promo chips into the hero
- One job per section: one purpose, one headline, usually one short supporting line
- Cards: avoid decorative card chrome; use bordered/panel patterns only when they match existing print UI (services, merch products)
- Merch page: cream field, shop grid, keep chrome consistent with `MerchChrome` / `MerchShop`

### Motion

- Hero uses 3D parallax (scroll + mouse) — preserve GPU transforms (`perspective`, `preserve-3d`)
- Respect `prefers-reduced-motion` via `hooks/usePrefersReducedMotion`
- Motion should support hierarchy (logo depth, sunburst spin, reveal-on-scroll), not noise
- Existing helpers: `useReveal`, `Reveal`, `useScrolled`

## Code conventions

### Components & pages

- Put UI in `components/`; pages in `app/` stay thin composers
- Use `"use client"` only when hooks, events, or browser APIs are required
- Prefer existing patterns: `PageShell` (`page="home" | "merch"`), shared `Nav`, `Reveal` for section entrances
- WhatsApp FAB: `components/WhatsAppFab.tsx` — keep number/prefill config in that file

### CSS

- Extend `app/globals.css` for look-and-feel; match naming of existing classes (`sec-pad`, `aged`, `script`, `cta-btn`, etc.)
- Prefer CSS variables for colors/fonts over hard-coded hex in new CSS
- Safe-area and mobile: keep `env(safe-area-inset-*)` and clamp-based padding where already used
- Do not enable Tailwind Preflight unless the whole design system is rewritten

### Accessibility

- Meaningful `aria-label`s on icon-only controls
- Visible `:focus-visible` outlines (ink on cream / cream context as established)
- Decorative SVGs: `aria-hidden="true"`
- Do not break reduced-motion paths

### Content & SEO

- Update `metadata` in `app/layout.tsx` / route `page.tsx` when titles or descriptions change
- Keep copy in English unless the product owner requests otherwise
- Contact CTA currently: `mailto:hello@juanimal.studio`

## What not to do

- Do not “modernize” into a generic startup landing (purple gradients, glassmorphism-only SaaS, dense card grids)
- Do not add heavy client libraries for effects already solved in CSS
- Do not commit secrets, private keys, or `.env` with credentials
- Do not rewrite `_legacy/` HTML into production; migrate patterns into React + `globals.css` instead
- Do not expand scope (new routes, CMS, auth) unless asked

## Workflow

1. Read nearby components and `globals.css` before changing visuals
2. Match existing naming, spacing, and print language
3. Verify home + merch at desktop and mobile widths
4. Run `npm run lint` / `npm run build` when touching structure or config
5. Commit only when the user asks

## Quick map

| Area | Where |
|------|--------|
| Global CSS + tokens | `app/globals.css` |
| Fonts + metadata | `app/layout.tsx` |
| Home composition | `app/page.tsx` + `components/*` |
| Merch | `app/merch/page.tsx`, `MerchShop`, `MerchChrome` |
| Tailwind tokens | `tailwind.config.ts` |
| Design history | `CHANGELOG.md` |
