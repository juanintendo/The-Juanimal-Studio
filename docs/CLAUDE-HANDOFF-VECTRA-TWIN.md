# Claude Handoff — Vectra Twin // AI (Juanimal Portfolio Showcase #01)

> **Purpose:** Technical & creative handoff document for Claude to document this build as a case study on **fuelorfool.ing**.  
> **Repository:** `C:\Users\colom\.gemini\antigravity\scratch\juanimal-2026\site`  
> **Branch:** `v3-signature-director` (local commits up to `34356cf` prior to this document; not pushed to remote)  
> **Routes:** `/work/vectra-twin` and `/work/vect` (`app/work/vectra-twin/page.tsx`, `app/work/vect/page.tsx`)  
> **Local Preview Servers:** `http://localhost:3000/work/vect` and `http://localhost:3030/work/vect`

---

## 1. Project Context & Creative Direction

**Vectra Twin // AI** is Portfolio Website #01 in Juanimal Studio's new curated showcase series inside the `juanimal-2026` v3 revamp. The goal was twofold:

1. **Motion & Scroll Choreography Benchmark:** Emulate the cognitive focus and scroll-driven storytelling cadence of `https://www.wembi.ai/en` — where every scroll stop feels like a self-contained hero — without cloning its lime-green/black visual skin.
2. **Service Blueprint:** Frame an industrial/AI Digital Twin offering (`Data → Device → Application` and `Data Acquisition → Full Control → Prediction`) that Juanimal Studio can showcase as an interactive reference for future client commissions, and document cleanly in **fuelorfool.ing**.

Key creative principles applied during iteration:
- **Anti-template hero proportions:** Rather than a standard 16:9 top fold, the opening composition uses a tall, poster-scale vertical stage (`1870/2380`) paired with a monumental `VECTRA` SVG wordmark and an SVG metaball bullet (`#vtGooBullet`).
- **Typographic condensation & scale:** Oversized Swiss Neo-Grotesque hierarchy and tight spacing eliminate accidental dead air so attention locks cleanly onto each viewport beat.
- **No brute-force cropping (`0` `object-fit: cover`):** Videos were physically pre-cropped and mastered to match container aspect ratios instead of relying on CSS `object-fit: cover` clipping.

---

## 2. Visual System & Bespoke Color Palette

Instead of copying the reference site's neon key-lime palette, color selection was rebuilt from the user's custom floral-glass palette sheet using contrast and warm/cool tension:

| Token Role | Hex | Usage |
| :--- | :--- | :--- |
| **Glacial Ice** | `#c6d8e6` | Primary cool architectural canvas and light editorial ground |
| **Glacial Steps** | `#edf3f8` / `#dce7f0` | Tonal elevation layers for cards, controls, and quiet surfaces |
| **Coral Rose** | `#f97279` | Energetic warm accent driving **Chapter 01 (`01 Digital Twin`)** gradient reveals & highlights |
| **Cerulean Blue** | `#2a72a3` | Deep structural cool accent driving **Chapter 02 (`02 Functioning`)** gradient reveals & active states |
| **Obsidian Ink** | `#0d1520` | High-contrast ink target for typography lock-in and dark surfaces |

Typography pairs Swiss Neo-Grotesque sizing with responsive clamps (`@media(max-width:900px)` fallback rules and reduced-motion safeguards) scoped under `.vt-*` classes in `app/globals.css`.

---

## 3. Section-by-Section Component & Motion Architecture

All interactive showcase logic lives in [`components/VectraTwinShowcase.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/VectraTwinShowcase.tsx) paired with scoped `.vt-*` styles in [`app/globals.css`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/app/globals.css). The showcase includes full **EN / ES** copy switching via `COPY_VT`.

### 3.1 Navigation Medallion Upgrade (`Nav.tsx`)
- Removed the redundant `<span className="brand-wordmark">JUANIMAL</span>` text next to the studio mark across the main site header.
- Strengthened `.brand` into a standalone medallion (`62px` resting / `52px` scrolled) so the return-home hit target never feels lost.

### 3.2 Tall Vertical Hero (`VECTRA` Wordmark + Gooey Twin Bullet)
- Uses a `1870/2380` vertical aspect-ratio stage driven by `HERO_VIDEO_SRC = "/media/vectra/hero-rings.mp4"` alongside `SculpturalRingsCanvas`.
- Full-width `VECTRA` SVG wordmark paired with an inline SVG metaball filter (`#vtGooBullet`) for the twin-dot emblem.

### 3.3 Pinned 3-Step Scroll Steppers (`PinnedStepperSection` + `SmoothGradientDescription`)
Two sticky scroll chapters pause vertical page progression while cycling through three internal sub-steps each:
- **01 Digital Twin** (`#f97279` Coral Rose accent): `Data` → `Device` → `Application`
- **02 Functioning** (`#2a72a3` Cerulean Blue accent): `Data Acquisition` → `Full Control` → `Prediction`

Motion & interpolation details:
- **Damped scroll inertia:** Scroll progress is smoothed frame-by-frame via `smoothP += (targetP - smoothP) * 0.11`, eliminating harsh mouse-wheel jumps.
- **Smooth character wave (`SmoothGradientDescription`):** Instead of an abrupt 1-color swap, a multi-stop RGB character gradient sweeps smoothly across `42%` (`0.42`) of the copy and locks completely to `#0d1520` (Obsidian Ink) by `0.82` sub-progress — letting the reader absorb each state cleanly before the next step or chapter engages.
- **Visual stage & diagram (`StepVisualCanvas` / `StepVisualMediaLayer` + `vectra-twin-core.png`):** Integrates `step-data-ribbons.mp4` and `step-device-turbine.mp4` inside `StepVisualMediaLayer` / `StepVisualCanvas`, alongside the custom `vectra-twin-core.png` layer inspector visual.

### 3.4 Directional Elastic Pill Towers (`InteractivePillTower` — `HOW` & `WHY`)
- Two architectural pill towers paired with dual-layer (blurred + sharp) rendering of `/media/vectra/tower-rings.mp4`.
- **Velocity-kick spring physics (`k = 0.085`, `damp = 0.78`):** Hovering or crossing a pill injects an elastic directional impulse based on pointer entry side (left vs. right entry velocity), physically nudging both the pill shell and typography.
- **Inner typography parallax:** Text inside each pill shifts at `0.35x` relative parallax to create tactile depth without sacrificing readability.

### 3.5 Apple Frosted-Glass Floating Dock, Chapter Switcher & 5-Card Recap Deck
- **Desktop Split Bottom Nav:** Positioned at bottom viewport edges (switching to centered stacking on mobile) with frosted glass (`blur(24px) saturate(190%)`).
- **Scroll-idle behavior:** Fades out cleanly while actively scrolling to maximize canvas focus, then returns after `380ms` of scroll idle.
- **`ExpandableSectionNav`:** Collapses to the active chapter pill at rest and expands smoothly on mouse hover with a sliding active capsule.
- **Roll-up micro-typography (`.vt-roll-text`):** Dual-line CSS vertical roll effect on hover for crisp tactile feedback.
- **5-Card Fanning Recap Deck (`.vt-deck-backdrop`):** Pure CSS `:has()` sibling fan interaction that lifts and fans all 5 project recap cards when hovered.
- **Footer Collision Protection (`#vt-footer` + `.is-footer-clear`):** Commission/contact CTA details live cleanly inside `#vt-footer`; when the footer enters view, `.is-footer-clear` automatically lifts/clears the floating nav so controls never overlap footer links.

### 3.6 Minimalist Soft Dot Cursor (`SoftDotCursor`)
- Replaced an earlier continuous pointer trail with a refined `12px` soft dot pointer (`SoftDotCursor`), hiding immediately during native browser scrollbar drags and `pointerdown` interactions.

### 3.7 Home Portfolio Integration (`WorkShowcaseV2.tsx` & `lib/i18n.ts`)
- Registered `vectra-twin` as the lead work item in EN & ES dictionaries (updating `stats` to `[8, 12, 11, 2]`, work count `7` → `8`).
- Home card (`.wsv2-saulbass-stage` / `.wsv2-card-vectra-twin`) pairs `hero-rings.mp4` (`9:16`) alongside `/images/v3/vectra-twin-core.png`.

---

## 4. Key Engineering Fixes & Lessons Learned (Great for `fuelorfool.ing`)

1. **The `overflow-x: hidden` Sticky Killer:**
   - *Symptom:* `PinnedStepperSection` refused to stick during scroll even with valid `position: sticky; top: 0`.
   - *Root Cause:* Ancestor elements (`html`, `body`, `.page-shell`) in `app/globals.css` had `overflow-x: hidden`, which per CSS spec creates a scroll container and breaks descendant `position: sticky`.
   - *Fix:* Migrated `html`, `body`, and `.page-shell` from `overflow-x: hidden` to `overflow-x: clip` (leaving `overflow-x: hidden` strictly isolated on `.mh-page`), restoring native hardware sticky pinning immediately.
2. **Scroll Cadence vs. Legibility (`0.11` damping + `0.42` wave + `0.82` lock):**
   - Early prototypes snapped text transitions too quickly under standard trackpad/wheel impulses. Tuning the spring damping (`0.11`), widening the RGB gradient wave (`0.42`), and forcing solid-ink settlement (`0.82`) gave each scroll stop a deliberate "pause-and-read" rhythm.
3. **Eliminating Scrollbar-Drag Cursor Artifacts:**
   - Continuous JS particle trails stayed frozen or left graphical artifacts when clicking/dragging the OS browser scrollbar outside normal client mouse-move streams. Moving to `SoftDotCursor` (`12px`) with `pointerdown` / scrollbar-drag hiding eliminated cursor debris completely.
4. **Zero `object-fit: cover` Discipline:**
   - Verified `0` occurrences of `object-fit: cover` in `app/globals.css`. Instead of cropping arbitrarily in CSS, raw AI video assets were framed and cropped mathematically during `ffmpeg` mastering.

---

## 5. Google Flow + `ffmpeg` Asset Pipeline

The workflow combines user-directed **Google Flow** video generations dropped into `C:\Users\colom\Documents\Videos_AG\` with automated mid-frame visual QA, aspect-ratio mastering via `ffmpeg`, poster extraction, and archival into `C:\Users\colom\Documents\Videos_AG\processed\vectra-twin\`.

Encoding baseline for all 4 loops: audio stripped (`-an`), `yuv420p`, `crf 21`, `-movflags +faststart`, `24fps`.

| Output Asset (`public/media/vectra/` & `public/images/v3/`) | Role in Page | Resolution / Crop | Size (Bytes) | Source File (Archived) |
| :--- | :--- | :--- | :--- | :--- |
| `hero-rings.mp4` | Hero vertical canvas (`VECTRA`) & Home card | `1080×1374` (`crop=1080:1374:0:260`) | `1,529,501` | `Interlocking_glass_and_ceramic_r…_ad949491_1080p.mp4` |
| `hero-rings-poster.jpg` | Instant first-paint poster for Hero | JPEG poster | `71,775` | Extracted from `hero-rings.mp4` |
| `tower-rings.mp4` | `InteractivePillTower` dual-layer rings loop | `1080×1920` (9:16 vertical) | `3,671,804` | `Geometric_rings_rotating_slowly_1ec6fa9c_1080p.mp4` |
| `tower-rings-poster.jpg` | Poster frame for Pill Towers | JPEG poster | `135,984` | Extracted from `tower-rings.mp4` |
| `step-data-ribbons.mp4` | Stepper Chapter 01 visual (`Data`) | `900×1062` (`crop=1080:1275:0:580,scale=900:1062`) | `1,125,598` | `Ribbon_waves_transitioning_into_…_9a720810_1080p.mp4` |
| `step-data-ribbons-poster.jpg` | Poster frame for Ribbons | JPEG poster | `54,314` | Extracted from `step-data-ribbons.mp4` |
| `step-device-turbine.mp4` | Stepper visual (`Device` / turbine core) | `900×1062` (`crop=1080:1275:0:360,scale=900:1062`) | `4,661,391` | `Turbine_core_rotating_steadily_bdc97633_1080p.mp4` |
| `step-device-turbine-poster.jpg` | Poster frame for Turbine | JPEG poster | `132,408` | Extracted from `step-device-turbine.mp4` |
| `vectra-twin-core.png` | Custom static Digital Twin architecture plate | Static PNG (uncropped inspector + Home stage) | `1,159,527` | Custom AI-generated diagram (`public/images/v3/`) |

---

## 6. Verification Snapshot & Git History

### Verified Checks (Prior to Writing This Handoff Doc)
- **TypeScript (`npx tsc --noEmit`):** Exit `0`
- **Production Build (`npm run build`):** Exit `0` — compiled in `3.9s`, `17/17` routes built cleanly
- **Live SSR & Media Matrix (`localhost:3000` & `localhost:3030`):**
  - `/` (`52,517` bytes, `hero-rings.mp4` present, `.brand-wordmark` removed): HTTP `200`
  - `/work/vect` & `/work/vectra-twin`: HTTP `200` with all 4 MP4 references present
  - `/media/vectra/*` (4 MP4s + 4 posters = 8 assets): `8 OK / 0 FAIL` on both port `3000` and port `3030`

### Local Commit Progression on `v3-signature-director`
- `96a7d00` — `v3: standalone thick return nav logo + flagship portfolio #01 Vectra Twin (/work/vectra-twin)`
- `14ca803` — `v3: add /work/vect alias route for /work/vectra-twin`
- `d3ea772` — `v3: Wembi pinned 3-step scroll tempo, smooth #c6d8e6/#f97279/#2a72a3 gradients, Swiss Neo-Grotesque type, clean dot cursor & Apple frosted glass split nav`
- `db57c8e` — `v3: Wembi fluid type proportions, zero-void hero frames, directional mouse-push pill towers & hover-expanding frosted glass nav`
- `a7f7e15` — `v3: fix sticky scroll pinning (overflow-x: clip), Wembi fanning 5-card Recap deck + roll-up hover, 12px cursor & clean footer`
- `343cf09` — `v3: tall 1870/2380 vertical poster Hero with full-width VECTRA wordmark, gooey twin-dot bullet & Flow video hook`
- `34356cf` — `v3: master 4 Flow 1080p loops to web MP4/posters & wire live across Vectra Twin hero, towers, steppers & Home card`

---

## 7. Suggested Angle for Claude When Writing for `fuelorfool.ing`

If documenting this project as a **fuelorfool.ing** case study, highlight the intersection of **human art direction + AI-native web engineering**:
- **How we didn't copy a template:** Took the cognitive *pacing* of `wembi.ai` (sticky chapters, vertical hero hook, tactile bottom dock) and translated it into an original palette (`#c6d8e6`, `#f97279`, `#2a72a3`, `#0d1520`) and AI Digital Twin narrative.
- **Physics & timing details that make the UX feel expensive:** Damped scroll inertia (`0.11`), multi-stop `42%` text waves locking at `82%`, directional spring kicks (`k=0.085, damp=0.78`) with `0.35x` inner text parallax, and zero-overlap footer handling (`.is-footer-clear`).
- **Co-creation pipeline:** Human director curating bespoke palette references and **Google Flow** video generations (`Videos_AG`) → Agent auditing frames, mathematically cropping/mastering MP4 loops via `ffmpeg` (zero CSS `object-fit: cover` distortion), debugging subtle CSS specs (`overflow-x: clip` sticky fix), and shipping a compiled Next.js experience.
