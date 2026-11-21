# Claude Handoff — NO SKU™ (Juanimal Portfolio Showcase #02)

> **Purpose:** Technical & creative handoff document for Claude to document this build as a case study on **fuelorfool.ing**.  
> **Repository:** `C:\Users\colom\.gemini\antigravity\scratch\juanimal-2026\site`  
> **Branch:** `v3-signature-director` (commits `8d2262c` → `c96f8f4`, pushed to `origin/v3-signature-director`)  
> **Routes:** `/work/no-sku` and `/work/nosku` (`app/work/no-sku/page.tsx`, `app/work/nosku/page.tsx`)  
> **Local Preview Servers:** `http://localhost:3040` (direct redirect proxy), `http://localhost:3000/work/no-sku`, and `http://localhost:3030/work/no-sku`

---

## 1. Project Context & Creative Direction

**NO SKU™** (*"There is no product yet. Watch what we can do."*) is Portfolio Website #02 in Juanimal Studio's v3 showcase series. Instead of inventing a fake e-commerce store, it turns the **absence of a physical product** into an interactive brag piece inspired by the tactile motion engineering of `sweet-tape.com`:

> *"We don't chase the product — the right product sees this, smirks, and finds its way straight into the crate."*

Every section is an interactive physics or spatial demonstration rather than a passive marketing block:
- A live **Three.js 3D adhesive tape roll** that spins freely under pointer orbit at rest and unspools downward on scroll to physically tape shut a folding cardboard box.
- A **6-sheet multicolor Post-it® stack** where every sheet is written with a different human tool (`Felt Marker`, `Bic Blue Pen`, `2B Graphite`, `0.4mm Fineliner`, `Gel Pen 0.7`, `Chisel Sharpie`) and can be peeled, dragged with velocity tilt, and re-stacked anywhere on the Kraft workbench.
- An **Orbital 6-Power Specimen Switcher** (`Motion`, `Tactile`, `Velocity`, `Kinetic`, `Loud`, `Weird`) whose active swatch color stays 1:1 synchronized with the live 3D tape roll and hero waybill tape piece.
- A **Pinned 2D Multi-Directional Camera Canvas** (`500vw × 230svh`) traversing 7 filleted arc stops with viewport-synced self-drawing SVG arrows.
- A **2D Gravity & Collision Playground Footer** containing 9 hollow top-down adhesive rolls (`NoSkuPhysicsFooter.tsx`).
- Full bilingual **EN / ES** copy parity wired through `useLanguage()`.

---

## 2. Visual System, Palette & Multi-Tool Typography

All styling is cleanly isolated under `.ns-font-root` / `.ns-page` / `.ns-*` classes in [`app/work/no-sku/nosku.css`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/app/work/no-sku/nosku.css) with **0 occurrences of `object-fit: cover`**.

### Palette Tokens
| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Archival Bone** | `#F4EFE6` / `#E8DFCE` | Top hero cut stage, sticky topbar, menu sheet, physics footer tank |
| **Raw Kraft** | `#C8A27A` / `#9B754E` | Lower hero corrugated corridor & Post-it® backing cardboard |
| **Espresso Ink** | `#18110E` | Primary outlines, print copy, high-contrast UI borders |
| **Industrial Vermilion** | `#FF4D29` | Primary brand tape swatch (`01 Motion`), `PULL ME` tab, vector camera arrows |
| **Specimen Accents** | `#1F4BFF` (Cobalt), `#D4FF2B` (Volt), `#FF2E88` (Magenta), `#FFB800` (Amber), `#14161A` (Obsidian) | Orbital paint sweeps + synchronized 3D tape roll colorways |

### 7 Google Fonts Stack ([`app/work/no-sku/layout.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/app/work/no-sku/layout.tsx))
| Role | Font Family | CSS Variable | Notes |
| :--- | :--- | :--- | :--- |
| **Display** | `Barlow Condensed` (700/800/900) | `--ns-font-disp` (`--ns-disp`) | Parabolic warped headlines & giant camera words |
| **UI Body** | `Inter Tight` (400/500/600/700) | `--ns-font-body` (`--ns-body`) | Crisp editorial copy |
| **Felt Marker** | `Caveat Brush` (400) | `--ns-font-hand` (`--ns-hand`) | Yellow canary sticky sheet + props |
| **Ballpoint / Gel Pen** | `Caveat` (variable, omit `weight`) | `--ns-font-pen` (`--ns-pen`) | Blue Bic & Teal Gel sticky sheets + hand callout |
| **2B Graphite Pencil** | `Reenie Beanie` (400) | `--ns-font-pencil` (`--ns-pencil`) | Mint sketch sticky sheet |
| **0.4mm Fineliner** | `Kalam` (400/700) | `--ns-font-fineliner` (`--ns-fineliner`) | Tangerine urgent memo sheet |
| **Chisel Sharpie** | `Permanent Marker` (400) | `--ns-font-marker` (`--ns-marker`) | Volt bottom sheet |

---

## 3. Component Architecture

1. **[`components/nosku/NoSkuHero3D.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/nosku/NoSkuHero3D.tsx) (`HeroTapeCanvas`):**
   - Procedural procedural canvas textures for corrugated inner core, outer specular tape band (`NO SKU // 000`), layered concentric rings (`ringGeoLeft`, `ringGeoRight`), and live re-paintable ribbon texture whenever `tapeColor` changes.
   - `camera.position.z = 15.6` headroom so the top silhouette curve never clips against `.ns-hero-top`.
   - At rest (`window.scrollY <= 24`), `rawProg === 0`, the roll pivots `32°` to show its hollow Kraft core, `ribbonMesh.visible` stays `false`, and users can click-and-drag to spin/tilt the 3D roll freely.
   - On scroll down, the roll smoothly squares frontal (`32° → 0°`) and peels a `PlaneGeometry(tapeWidth, 1, 8, 48)` ribbon cleanly off the **bottom-front underside** (`startY = rollHomeYWorld + bobY - outerR * 0.86`, `startZ = outerR * 0.54`, reaching `cRect.height * 0.72` on `.ns-crate-stage`) synchronized 1:1 with X-spin (`unspoolDelta / outerR`), triggering the reversible 3D `.ns-crate-flap` fold-shut animation.

2. **[`components/nosku/NoSkuPostItStack.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/nosku/NoSkuPostItStack.tsx):**
   - Renders 6 stacked pastel/neon sheets over a Kraft backing card (`NO SKU™ // PAD-006`) with distinct ink shadows, grid lines, paper fold corner `::after`, and inline hand-drawn SVG doodles.
   - Pointer drag runs directly via DOM ref transforms at 60fps (`vx`-based rotation tilt + `zIndex` stack management) before committing final `{ peeled, x, y, rot, z }` coordinates on drop; click/tap auto-fans notes safely within desktop/mobile viewports; includes `↺ RE-STACK` controls.

3. **[`components/nosku/NoSkuShowcase.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/nosku/NoSkuShowcase.tsx):**
   - **High-Contrast Top Bar (`.ns-topbar`) + `PULL ME` Drawer:** 3-column bone bar keeping the vermilion pull tab in its own center track with zero text collision (`← JUANIMAL STUDIO` / `VECTRA TWIN #01` | `PULL ME` | `EN / ES` + `CLAIM BOX #000`).
   - **6-Layer Curved Preloader:** Stacked `.ns-arc-cut` sheets + 32-strip vertical peeling logo banner.
   - **Right Workbench Column (`.ns-right-column`):** Thermal waybill card (`.ns-waybill-card` with live tape strip + Code-128 SVG barcode + void stamp), spec manifest (`MANIFEST // SKU #000`), and live interactive swatch selector (`triggerSlideChange`) that repaints the 3D Hero roll from the fold.
   - **Wave Marquee Band:** Continuous seamless modulo wrap using `unitLen` measurement + normal-offset alternating badges (`±58px`) that never occlude marquee typography.
   - **Orbital 6-Power Specimen Deck:** Rotational dial synced with an SVG arc-cut background wipe across 6 custom studio specimens.
   - **2D Multi-Directional Camera Stage (`.ns-giant`):** Arc-length parameterized 7-stop filleted Bézier camera (`0.11` damping), DOM-ref HUD updates (zero React re-renders during scroll), inline Row-3 curved downward exit arrow (`.ns-curve-down-arrow` sized dynamically from `row3Ref`), and live `getBoundingClientRect().left` shaft+head arrow drawing.

4. **[`components/nosku/NoSkuPhysicsFooter.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/nosku/NoSkuPhysicsFooter.tsx):**
   - Custom 2D sub-stepped gravity + restitution + inter-body circle collision solver (`6` substeps/frame) inside `.ns-footer-bottom`.
   - Renders 9 hollow top-down adhesive rolls (`ROLL_SPECS`) via SVG strokes + Kraft cardboard inner rings (`r = 40..48`, transparent center core) + curved `<textPath>` typography along each tape band.

---

## 4. Major Engineering Fixes & Lessons Learned (for `fuelorfool.ing`)

1. **Cylinder Underside Peel Math (`0.86² + 0.54² = 1.0312 > 1.0`):**
   - Starting the 3D ribbon at the front equator (`y = 0, z = outerR`) caused the ribbon's quadratic curve toward the crate (`z = 0.16`) to punch back *through* the lower front cylinder wall and create a visible horizontal crease. Anchoring takeoff outside the lower front underside (`startY = rollHomeYWorld - outerR * 0.86`, `startZ = outerR * 0.54`) eliminated self-intersection cleanly.
2. **True Scroll-Anchored Activation (`window.scrollY > 24`):**
   - Computing unspool progress solely from `cRect.top < vh * 1.12` caused taller sections/monitors to trigger `rawProg > 0.25` at `scrollY === 0`, locking the roll flat and hiding the drag orbit. Gating progression cleanly behind `window.scrollY > 24` preserves the tilted 32° resting silhouette and free click-orbit at the top of the page.
3. **Resolving Unscoped Global `nav` CSS Collisions (`.ns-page nav`):**
   - `app/globals.css` defined an unscoped element rule (`nav { position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(...); }`) designed for the main site header, which inadvertently painted a dark blurry bar across `<nav className="ns-footer-nav">` and distorted footer contrast. Adding `.ns-page nav { position: static; background: none; ... }` cleanly isolated the showcase without disturbing main-site routes.
4. **Live Viewport-Position Split SVG Arrows:**
   - Using hardcoded global progress (`smoothP`) percentages for diagonal SVG arrows made arrowheads finish drawing before the viewport reached them. Splitting each arrow into separate `shaft` and `head` `<path>` refs (`opacity: 0` at `<= 0.004` so `strokeLinecap="round"` doesn't leave a resting dot) and driving dashoffset directly from `wrap.getBoundingClientRect().left` made arrow drawing track real scroll velocity forward and backward.
5. **Next.js 15 `next/font/google` Variable Font Crash on `Caveat`:**
   - Passing `weight: ["500", "700"]` to Next.js's variable font loader for `Caveat` triggered a webpack loader crash (`TypeError: Cannot read properties of null (reading '1')` in `google/loader.js:122`). Calling `Caveat({ subsets: ["latin"], variable: "--ns-font-pen", display: "swap" })` without explicit `weight` resolved it cleanly.
6. **Zero `object-fit: cover` Discipline & Silent UX:**
   - Audio synthesizers were completely disconnected for a friction-free silent experience, and CSS verification confirms `0` occurrences of `object-fit: cover`.

---

## 5. Studio PNG Asset Inventory (`public/images/nosku/`)

| File | Role | Size (Bytes) |
| :--- | :--- | :--- |
| `crate-empty.png` | Hero center cardboard crate + Home lead card | `1,373,706` |
| `specimen-motion.png` | Orbital Slide `01 Motion` + Menu thumbnail | `1,351,117` |
| `specimen-tactile.png` | Orbital Slide `02 Tactile` + Menu thumbnail | `1,393,214` |
| `specimen-kinetic.png` | Orbital Slide `04 Kinetic` | `1,192,851` |
| `specimen-loud.png` | Orbital Slide `05 Loud` | `1,687,282` |
| `specimen-weird.png` | Orbital Slide `06 Weird` | `1,421,166` |
| `studio-collage.png` | Manifesto Collage section + Menu thumbnail | `1,496,081` |

*(Orbital Slide `03 Velocity` also shares `crate-empty.png`.)*

---

## 6. Commit Progression on `v3-signature-director`

- `8d2262c` — `v3: build NO SKU™ portfolio showcase #02 (Three.js unspooling tape + curling note, 2D diagonal scroll camera, orbital paint sweep, Web Audio foley & physics balls footer)`
- `07b6dee` — `v3: QA NO SKU™ — frontal 1:1 synced Three.js tape roll, silent mode, fix orbital wipe/tags, 60fps HUD & hero pointer-events`
- `009adcd` — `v3: NO SKU™ visual polish — 6 photo specimens, Caveat Brush hand font, reversible 3D folding crate + draggable color-sync roll, seamless wave band, bold arrows & hollow rim-text tape footer`
- `51462fa` — `v3: NO SKU™ scroll-sync arrows, clean underside 3D tape peel (no stub/clip), non-overlapping exit curve & scaled-up crate stage`
- `c96f8f4` — `v3: NO SKU™ fix 3D tape scroll-lock & click orbit, crisp topbar + nav isolation, larger peel stamp, interactive multicolor Post-it® stack & workbench column`
