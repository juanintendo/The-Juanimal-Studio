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
   - Extracts opaque 2.5D character breakout layers (`panel-01-fg.png`, `panel-06-fg.png`, `panel-07-fg.png`) via closed-ink interior floodfill and `rembg` binary masks applied to unmodified original saturated RGB pixels (eliminating edge bleach and halo residue).
   - Generates `ramses-badge.png` (`192×192` transparent mascot badge) plus Studio Home preview cards (`card-cover.png`, `card-disco.png`).

---

## 3. Technical Architecture

- **Spatial 3D Comic Board (`components/ramses/RamsesComicStage3D.tsx`):**
  - Positions all 8 panels (7 illustrated panels + Panel 08 interactive finale emblem card) across a staggered 2.5D graphic-novel board in Three.js with `#161420` comic borders and hard offset drop shadows.
  - **Custom GLSL Shader (`rm-comic-panel-v1`):**
    - Samples `uBwTex` and `uColorTex` seamlessly in a single draw call.
    - **Cursor Peek Spotlight (`uHoverUv`):** Hovering an unrevealed B&W ink panel opens a live circular pop-color lens around the pointer.
    - **Shockwave Color Blast (`uReveal`, `uWaveOrigin`):** Clicking or completing the panel micro-interaction fires a wavy 3-band `#7E7EFF / #F894C0 / #FFE14D` chromatic ring radiating from the exact raycast hit UV across the entire frame.
    - **Velocity Spring Bend & Beat Pulse:** Subtle camera-velocity arch deflection (`uVelocity`) plus a `116 BPM` disco beat pulse on Panel 06.
  - **2.5D Breakout Foreground Planes:** Positioned at `z = +0.28` (`1.07×` scale) on Panels 01, 06, and 07 so Ramsés bursts above the ink frame with subtle pointer parallax.
  - **Bird's-Eye Overview Mode + Raycasting:** Pulls the camera smoothly back to view all 8 panels simultaneously; clicking any panel swoops directly into focus. Includes bounding-box `fitCamera` math for Desktop, Mobile Portrait, and Mobile Landscape + `orientationchange` listener.
- **Procedural Web Audio Foley (`lib/ramses/ramsesAudio.ts`):**
  - Zero external audio files — synthesizes crown harp chimes, `26 Hz` AM triangle cat purrs, radiator valve ratchet clanks + steam hiss, mug shatter + cartoon slide whistle, radiant major-9th sunbeam swells, and a live `116 BPM` four-on-the-floor disco bass/hi-hat loop.
- **Playable Finale Mini-Game (`components/ramses/RamsesSunbeamGame.tsx`):**
  - Interactive 15-second Canvas 2D round on Panel 08: steer Ramsés with mouse, touch, or arrow keys to stay inside the drifting golden sunbeam, catch falling crowns/socks (`+25`), and dodge snowflakes (`-10`) to unlock Thermal Pharaoh Ranks up to `35°C Supreme Sun-God`.
- **Framing & Style Contract:**
  - All styles scoped under `.rm-font-root` / `.rm-page` in `app/work/ramses-mania/ramses.css`, isolating `<nav className="rm-bottom-bar">` cleanly from global navigation and maintaining **0 occurrences of `object-fit: cover`**.
