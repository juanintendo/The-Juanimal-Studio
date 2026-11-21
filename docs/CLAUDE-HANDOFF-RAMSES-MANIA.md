# Claude Handoff — Ramsés Mania (`Portfolio Web Concept #04`)

> **Purpose:** Technical & creative handoff document for Claude to document this showcase on **fuelorfool.ing**.  
> **Repository:** `C:\Users\colom\.gemini\antigravity\scratch\juanimal-2026\site`  
> **Branch:** `v3-signature-director` (with dedicated standalone deployment branch `ramses-mania`)  
> **Routes:** `/work/ramses-mania` and `/work/ramses` (`app/work/ramses-mania/page.tsx`, `app/work/ramses/page.tsx`)  
> **Local Preview Proxy:** `http://localhost:3060` (redirects directly to `/work/ramses-mania`)

---

## 1. Concept & Awwwards Inspiration

Inspired by the spatial WebGL graphic novel **Ponpon Mania** (*Justine Soulié & Patrick Heng — Awwwards SOTD / SOTM*), **Ramsés Mania** flips the joke: instead of a super-fluffy megalomaniac sheep dreaming of becoming a DJ, our mascot is **Ramsés**, a **100% hairless, wrinkled peach-pink Sphynx cat** freezing at `19°C` inside Apartment 4B, convinced he is the reincarnated **Solar Emperor** deserving `35°C` radiator heat, sunbeams, and absolute obedience.

### Visual Identity & Signature Contrast
- **Monochrome Ink Reality → Pop-Color Fantasy:** Every comic panel enters as crisp French *bande dessinée* black-and-white ink (`#161420`) with 45° rotated Ben-Day halftone dots on warm off-white paper (`#FAF8F4`).
- **Four Pop Accents:**
  - `#F9C7B8` (Hairless Sphynx peach skin)
  - `#7E7EFF` (Electric periwinkle-indigo — cel shadows, headphones, star glasses, discosky)
  - `#F894C0` (Bubblegum pink — chunky turtleneck sleeve, sun-cape, cushions, cloud silhouettes)
  - `#FFE14D` (Sun-God gold — crown, diagonal radiator valve wave, sunbeam column, onomatopoeias)

---

## 2. Character Approval Pack & Custom Asset Pipeline

1. **Character Pitch Approval (`sphynx_character_pitch.md`):** Before touching any site code, a 4-plate character pack (3-pose turnaround model sheet, 6-expression grid, 3-panel B&W-to-pop-color transition strip, and styling archetypes A/B/C) was generated and approved.
2. **Python Asset Pipeline (`build_ramses_assets.py`):**
   - Produces 7 pixel-aligned lossless `1200×900` comic plate pairs (`panels/panel-01-color.png` .. `panel-07-color.png` + `panel-01-bw.png` .. `panel-07-bw.png`).
   - Cleanly separates non-duplicating BG and 2.5D FG layer pairs — BOTH color and 45° Ben-Day halftone B&W — for Panels 01 (`panel-01-bg-{bw,color}.png` + hovering crown-only `panel-01-fg-{bw,color}.png` with seam-free radial ray restoration), 06 (`panel-06-bg-{bw,color}.png` + DJ Ramsés `panel-06-fg-{bw,color}.png`), and 07 (`panel-07-bg-{bw,color}.png` + Sun-Emperor `panel-07-fg-{bw,color}.png`), using closed-ink interior floodfill and `rembg` binary masks applied to unmodified original saturated RGB pixels (eliminating double-sprite ghosting, edge bleach, and halo residue).
   - Generates `ramses-badge.png` (`192×192` transparent mascot badge) plus Studio Home preview cards (`card-cover.png`, `card-disco.png`).

---

## 3. Technical Architecture

- **Spatial 3D Comic Board (`components/ramses/RamsesComicStage3D.tsx`):**
  - Positions all 8 panels (7 illustrated panels + Panel 08 interactive finale emblem card) across a wide-gutter staggered 2.5D graphic-novel board in Three.js with `#161420` comic borders, offset drop shadows, explicit per-panel `renderOrder`, and automatic neighbor focus-dimming (`uDim`).
  - **Synchronized BG + FG Custom GLSL Shaders (`PANEL_FRAG`, `FG_FRAG` via `makeComicFragmentShader`):**
    - Both background plates and 2.5D breakout planes sample matching B&W-halftone and pop-color textures using identical shared uniform references (`uWaveOrigin`, `uReveal`, `uHoverUv`, `uHoverStrength`, `uBeatPulse`, `uDim`, `uVelocity`).
    - **Cursor Peek Spotlight (`uHoverUv`):** Hovering an unrevealed B&W ink panel opens a live circular pop-color lens across both BG and FG layers simultaneously.
    - **Shockwave Color Blast (`uReveal`, `uWaveOrigin`):** Clicking or completing the panel micro-interaction fires a wavy 3-band `#7E7EFF / #F894C0 / #FFE14D` chromatic ring radiating from the exact raycast hit UV across the entire frame.
  - **Non-Overlapping Flex-Column Layout (`RamsesManiaShowcase.tsx`, `ramses.css`):**
    - `.rm-page` separates `.rm-topbar`, `.rm-overview-banner`, unobstructed `<main className="rm-stage">` (with `ResizeObserver`-backed camera gutter framing), `.rm-speech-dock`, and `<nav className="rm-bottom-bar">` into dedicated flex bands so speech bubbles, action controls, onomatopoeia stamps, and Prev/Next arrows never occlude panel illustrations across Desktop, Laptop, Mobile Portrait, and Mobile Landscape.
  - **Bird's-Eye Overview Mode + Raycasting:** Pulls the camera smoothly back to view all 8 panels simultaneously; clicking any panel swoops directly into focus. Includes bounding-box `fitCamera` math for Desktop, Portrait, and Mobile Landscape + `orientationchange` listener.
- **Procedural Web Audio Foley (`lib/ramses/ramsesAudio.ts`):**
  - Zero external audio files — synthesizes crown harp chimes, `26 Hz` AM triangle cat purrs, radiator valve ratchet clanks + steam hiss, mug shatter + cartoon slide whistle, radiant major-9th sunbeam swells, and a live `116 BPM` four-on-the-floor disco bass/hi-hat loop.
- **Playable Finale Mini-Game (`components/ramses/RamsesSunbeamGame.tsx`):**
  - Interactive 15-second Canvas 2D round on Panel 08: steer Ramsés with mouse, touch, or arrow keys to stay inside the drifting golden sunbeam, catch falling crowns/socks (`+25`), and dodge snowflakes (`-10`) to unlock Thermal Pharaoh Ranks up to `35°C Supreme Sun-God`.
- **Framing & Style Contract:**
  - All styles scoped under `.rm-font-root` / `.rm-page` in `app/work/ramses-mania/ramses.css`, isolating `<nav className="rm-bottom-bar">` cleanly from global navigation and maintaining **0 occurrences of `object-fit: cover`**.
