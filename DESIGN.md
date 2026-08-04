# The Juanimal Studio — Design Language

Reference for anyone (human or agent) touching this UI. Written because
general-purpose design tooling assumes a modern SaaS baseline, and several
choices here are deliberate departures from it. **Read the "Do not 'fix'"
section before running any audit or polish pass.**

---

## Product

One-person creative studio: UX/UI, web and app development, AI implementation,
branding. Sells services and a small merch line.

**Audience.** Founders and small-business owners who have seen a hundred
identical SaaS landing pages. The site's job is to be *remembered* — being
forgettable is a worse failure here than being imperfect.

**Voice.** Dry, confident, a little mischievous. Concrete over aspirational:
"fewer slides, more shipped work", not "empowering digital transformation".
Wizard and dragon metaphors are load-bearing brand, not decoration — keep them.

---

## Lane

**1940s aged halftone print.** Think letterpress posters and vintage packaging:
physical ink on paper, misregistered plates, hard drop shadows, visible dot screens.
Not retro-as-pastiche; retro-as-craft.

**Anti-references** — if the work drifts toward these, it is off-brand:

- Generic SaaS: Inter, purple→blue gradients, glassmorphism, soft neutral greys
- Cards nested in cards; rounded-square icon tiles above every heading
- Thin hairline borders and diffuse `rgba(0,0,0,.08)` shadows
- Muted "tasteful" palettes; low-contrast grey-on-grey text
- Stock-photo hero with a centred headline and two buttons

---

## Colour

| Token | Value | Role |
|---|---|---|
| `--red` | `#E04E1F` | Primary accent — CTAs, eyebrows, numbers |
| `--red-deep` | `#B93A12` | Gradient partner to `--red` |
| `--cream` | `#F3E9CE` | Paper. Cards, panels, most surfaces |
| `--cream-dim` | `#E6D8B4` | Secondary paper, insets |
| `--ink` | `#171009` | Every border, every hard shadow, body text |
| `--tan` | `#C9A96B` | Aged-paper accents |
| `--rust` | `#6E3410` | Labels, secondary text on cream |

**One accent.** `--red` carries the page. Do not introduce a second hue for
emphasis — the tornasol sweep is the only place multiple hues appear, and it is
a motion treatment, not a palette expansion.

**Ink is never grey.** Borders and text use `--ink`, not `#333` or a neutral
grey. The near-black warmth is what reads as printed ink.

---

## Type

Four families, each with one job:

- `--disp` **Archivo Black** — headings, prices, stats. Uppercase, tight
  leading (~1.05), heavy. Never for body copy.
- `--logo` **Montserrat 700/800** — nav, eyebrows, labels, buttons. Wide
  letter-spacing (`.12–.16em`) when uppercase.
- `--script` **Yellowtail** — the hero line and section asides only. One or two
  per page, maximum. It is seasoning.
- `--body` **Libre Franklin** — paragraphs. Line-height ~1.65.

Body copy sits at 15–18px. Headings scale with `clamp()`. Do not add a fifth
family.

---

## Surfaces and depth

The signature: **cream card, 4px `--ink` border, hard offset shadow.**

```css
background: var(--cream);
border: 4px solid var(--ink);
box-shadow: 7px 7px 0 var(--ink);   /* 5px on smaller elements, 10px on modals */
```

Shadows are **solid and offset**, never blurred. On hover, cards translate
`-3px,-3px` and the shadow grows to `9px 9px` — the object lifts off the page.

**Halftone.** Dotted overlays at low opacity are the texture signature:

```css
background-image: radial-gradient(circle, rgba(23,16,9,.10) 1.4px, transparent 2px);
background-size: 13px 13px;
```

Border radius: pills (`999px`) for buttons and the contact dock; `12–18px` for
cards and modals; `0` for tape strips and eyebrows. Sharp and pill coexist by
design — that tension is the print-poster feel.

---

## Motion

- **Gradient drift.** Hero backgrounds pan a `320%` gradient over 22s.
- **Tornasol.** The rainbow sweep on nav (scroll) and capsule buttons (hover).
  Implemented via `background-image`, not a `::before` layer — these elements
  carry their own background-colour, so a pseudo-element at `z-index:-1` hides
  behind it and a positive one covers the label.
- **Parallax.** The hero dragon tilts toward the cursor and scales with scroll;
  the Carrusel (the radial burst behind it) rotates on scroll.
- **Float.** The contact dock bobs `-8px` on a 4.5s loop.

Easing is `cubic-bezier(.22,1,.36,1)` for anything that opens or expands.
Everything is disabled under `prefers-reduced-motion`.

---

## Components worth knowing

- **Contact dock** — circle at rest, widens to a pill on hover revealing
  Instagram, AI chat, LinkedIn, email, WhatsApp. Three stacked layers
  (`-bg` / `-items` / `-ring`); see the comment in `globals.css` for why.
  Hidden on `/merch`, where the cart owns that corner.
- **Cart panel** — compact card anchored above the cart FAB, grows with its
  contents, caps at `50vh`. Not a full-height drawer.
- **Product detail** — overlay with art, colour swatches, blurb, spec bullets
  and size selector.
- **Postcard** — the contact form, built as a physical postcard with stamp,
  postmark and fold.

---

## Do not "fix"

These trip generic design linters and are all intentional:

| Flagged as | Why it stays |
|---|---|
| Heavy 4px borders | The ink outline *is* the identity |
| Unblurred offset shadows | Letterpress depth, not a shadow bug |
| Low-opacity dot overlays | Halftone print texture |
| Saturated orange on teal/purple | Vintage poster contrast, deliberately loud |
| Four type families | Each has a distinct, non-overlapping job |
| Mixed sharp and pill radii | Poster tension, applied consistently by element type |
| Uppercase with wide tracking | Period-correct signage |

Accessibility is **not** in this list. Contrast ratios, focus states, touch
targets and reduced-motion support are hard requirements — fix those freely.

---

## Constraints

Next.js 15 App Router, TypeScript, plain CSS in `app/globals.css` (Tailwind is
installed but the styling is hand-written CSS — follow that). No component
library. Images live in `public/images`.

**Versioned filenames.** When an image's *contents* change, give it a new
filename (`icon-v2.png`). Vercel and browsers cache `/public` assets hard, and
overwriting in place serves stale bytes for hours.
