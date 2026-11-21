# Claude Handoff — Juanimal Designs v4 (`v4-juanimal-gallery`)

> **Branch:** `v4-juanimal-gallery` (forked cleanly from `v3-signature-director`, leaving `main` and `v3-signature-director` untouched)  
> **Inspiration:** `justinesoulie.fr` (Justine Soulié — French indie art-direction poster gallery, crumpled paper cloth shader, zig-zag underline motif, horizontal editorial case studies, and 4-world interactive hover portal `/about`)

---

## 1. Visual & Interactive System

1. **Minimal Header & Zig-Zag SVG Preloader (`GalleryHeader.tsx`, `ZigZagPreloader.tsx`):**
   - Warm archival cream paper background (`#F4F0ED`) with crisp `#15131A` ink.
   - Top navigation pairs `JUANIMAL DESIGNS` with `ABOUT` (using Justine's lightning zig-zag underline `<path d="M0 1H155.026L144.122 5H311" />`), `MERCH`, live `EN / ES` language switch, and Web Audio mute pill.

2. **WebGL Infinite Poster Carousel Home (`/`, `/es` — `PosterCarousel3D.tsx`, `PosterGalleryHome.tsx`):**
   - **10 `900×1200` (`3:4`) Gallery Posters (`public/images/gallery/posters/poster-01..10.png`):**
     `01 Ramsés Mania`, `02 Voyager 1`, `03 NO SKU™`, `04 Vectra Twin // AI`, `05 Frame by Agents`, `06 fuelorfool.ing`, `07 Keys to My Heart`, `08 Mina AI Grow House`, `09 Synthia: Club of the Dead`, and `10 GTA VI: Saul Bass Countdown`.
   - **Custom GLSL Crumpled Paper Cloth Shader (`POSTER_VERT`, `POSTER_FRAG`):**
     - Tangent-space crumpled-paper normal map (`/images/gallery/paper-normals.png`) + velocity-driven S-wave paper bending (`uVelocity`), pointer 3D tilt/lift, specular highlight along creases, seamless modulo horizontal wrapping, wheel/drag/touch/arrow inertia, and smooth color-curtain transition into `/poster-work/[slug]`.
   - Includes a clean bottom archival dock + **Interactive Toys** quick launcher linking directly to all playable WebGL prototypes (`/work/ramses-mania`, `/work/voyager-kids`, `/work/no-sku`, `/work/vectra-twin`) and the 4-world Dragon `/about` experience.

3. **4-World Interactive Juanimal Dragon `/about` (`DragonAboutStage.tsx`):**
   - **Four `1600×900` painterly gouache & wax-crayon worlds (`public/images/gallery/about/dragon-{day,night,rain,rainbow}.png`):**
     1. **`day` (`☀ SHINE`)**: Emerald Juanimal Dragon with retro 3D glasses, leather jacket & artist's pencil in sunlit buttercream-mint foliage.
     2. **`night` (`🌙 MECHA`)**: Riveted silver-chrome Mechanical Dragon with glowing 3D optics, steel wings, flame jacket & fireflies.
     3. **`rain` (`🌧 DEVSAURUS`)**: Crimson DevSaurus with dark glasses, blue bandana & coffee mug in misty storm clouds.
     4. **`rainbow` (`🌈 COSMIC`)**: Golden-iridescent Wizard Dragon with star 3D glasses & cape surrounded by paint/code sparkles.
   - **Dual-World Circular Portal Shader (`ABOUT_FRAG`):**
     - Moving the cursor opens a live circular lens peeking directly into the NEXT Dragon world.
     - Clicking anywhere triggers an expanding circular portal wipe with synthesized harmonic chimes (`playPortalMorph`), plus world-specific 3D weather particles (sun dust, fireflies, falling raindrops, rainbow sparks), arched `Modak` typography synced to each world, and an archival **`CONTACT ME`** dossier modal.

4. **Horizontal Editorial Case Studies (`/poster-work/[slug]` — `PosterCaseStudy.tsx`):**
   - Archival left poster matte frame + full-height signature-color info column (`accentHex`) + wheel-to-horizontal visual gallery (`object-fit: contain` on every image) + direct **`LAUNCH LIVE EXPERIENCE ↗`** CTA into the full WebGL experience + `NEXT PROJECT →` loop tile.

---

## 2. Architecture & Style Guardrails
- All gallery styles are strictly scoped under `.jd-gallery-root` in `app/gallery.css`.
- **0 occurrences of `object-fit: cover`** across every CSS file (`app/globals.css`, `app/gallery.css`, `app/work/no-sku/nosku.css`, `app/work/voyager-kids/voyager.css`, `app/work/ramses-mania/ramses.css`).
- Upgraded `next` / `eslint-config-next` to `15.5.29` and loaded `Bricolage Grotesque`, `Modak`, and `Space Mono` via Google Fonts `<link rel="stylesheet">` in `app/layout.tsx` to avoid `next/font/google`'s build-time regex crash on intermittent extensionless `/l/font?kit=` subset URLs.
- All existing flagship routes (`/work/ramses-mania`, `/work/voyager-kids`, `/work/no-sku`, `/work/vectra-twin`, `/work/frame-by-agents`, `/work/fuelorfool`, `/work/keys-to-my-heart`, `/work/minas-house`, `/merch`, `/contact`) remain completely intact.
