# Claude Handoff — Juanimal Designs v4 (`v4-juanimal-gallery`)

> **Branch:** `v4-juanimal-gallery` (forked cleanly from `v3-signature-director`, leaving `main` and `v3-signature-director` untouched)  
> **Inspiration:** `justinesoulie.fr` (Justine Soulié — French indie art-direction poster gallery, crumpled paper cloth shader, zig-zag underline motif, horizontal editorial case studies, and 4-world interactive hover portal `/about`)

---

## 1. Visual & Interactive System

1. **Minimal Header & Zig-Zag SVG Preloader (`GalleryHeader.tsx`, `ZigZagPreloader.tsx`):**
   - Warm archival cream paper background (`#F4F0ED`) with crisp `#15131A` ink.
   - Top navigation pairs `JUANIMAL DESIGNS` with `ABOUT` (using Justine's lightning zig-zag underline `<path d="M0 1H155.026L144.122 5H311" />`), `MERCH`, and live `EN / ES` language switch (zero header audio/mute clutter).

2. **WebGL Infinite Poster Carousel Home (`/`, `/es` — `PosterCarousel3D.tsx`, `PosterGalleryHome.tsx`):**
   - **10 `900×1200` (`3:4`) Gallery Posters (`public/images/gallery/posters/poster-01..10.png`):**
     `01 Ramses`, `02 Voyager 1`, `03 NO SKU™`, `04 Vectra Twin // AI`, `05 Frame by Agents`, `06 Fuel or Fool` (Jester Cobra Ref 1 edition), `07 Molotov Love` (custom Vince Ray-inspired black/crimson/cream 3-color gig illustration with Horacio + brass/sax skeletons), `08 Keys to My Heart` (starring Claudia — textless animation sheet + custom 1920s hand-lettered logo), `09 Club of the Dead` (custom nocturnal Kustom Kulture key-art starring Synthia + hearse hot rod), and `10 BRRT` (tactile thermal receipt printer riso poster).
   - *(Note: `illusion-of-agency` was consolidated with `keys-to-my-heart`, and Arcadio Labs was held back by user request.)*
   - **Custom GLSL Parabolic Viewport Bulge + 10 Per-Poster Living Effects (`POSTER_VERT`, `POSTER_FRAG`):**
     - Authentic clip-space **parabolic center-of-viewport convex arch** (`centerBulge` without hover scaling/zoom) + fast-scroll aerodynamic pullback + S-wave paper flex + **local tactile cursor dimple** (`uHit`) relaxing paper creases right beneath the pointer.
     - Tangent-space paper normal refraction (`uNormals`) + diagonal **Extra-style foil/gloss sweeps** and bespoke non-destructive per-poster animations & logical hover responses (`01` radiator heat haze & sunbeam crown glint, `02` twinkling stars & 24k Golden Record shine, `03` glossy lacquer packing-tape highlight, `04` sweeping cyan telemetry radar & wireframe reticle, `05` 12fps film-gate flicker & animator's lightbox, `06` signature Extra metallic foil sweep on yellow title & Jester Cobra, `07` living crimson flame wave & ember stoke, `08` 1926 8fps pencil-boil & orange starburst twinkle, `09` electric-magenta brush gloss & drifting cemetery mist, `10` rising 80mm thermal print-head light sweep).
     - All UI sound effects and header mute buttons were removed to keep gallery browsing silent and frictionless.
   - Includes a clean bottom archival dock + **Interactive Toys** quick launcher linking directly to all playable WebGL prototypes (`/work/ramses-mania`, `/work/voyager-kids`, `/work/no-sku`, `/work/vectra-twin`) and the 4-world Dragon `/about` experience.

3. **4-World Interactive Juanimal Dragon `/about` (`DragonAboutStage.tsx`):**
   - **Four pixel-locked `1600×900` in-place transformations (`public/images/gallery/about/dragon-{day,night,rain,rainbow}.png`) from the exact same base illustration (100% locked silhouette, outlines, bushes, clouds, and glasses across portal reveals):**
     1. **`day` (`☀ SHINE`)**: Emerald Juanimal Dragon with retro 3D glasses, leather jacket & artist's pencil in sunlit buttercream-mint foliage.
     2. **`night` (`🌙 MECHA`)**: Riveted silver-chrome Mechanical Dragon with neon cyber optics, metallic stylus & glowing fireflies under a starry midnight sky.
     3. **`rain` (`🌧 DEVSAURUS`)**: Crimson DevSaurus with dark matte dev frames, cobalt polka-dot forehead bandana, rain-slick navy jacket & diagonal storm streaks.
     4. **`rainbow` (`🌈 COSMIC`)**: Golden-amber Wizard Dragon with white prismatic glasses, royal magenta jacket, pastel rainbow arch & paint sparkles.
   - **Pixel-Locked Dual-World Circular Portal Shader (`ABOUT_FRAG`):**
     - Uses a single shared `sceneUv` so moving the cursor opens a butter-smooth circular lens peeking directly into the NEXT Dragon world with zero spatial shift or double-outline ghosting.
     - Clicking anywhere triggers an expanding circular portal wipe with soft `64×64` bokeh `PointsMaterial` weather particles, Justine-style unboxed floating `Modak` typography, and an archival **`CONTACT ME`** dossier modal.

4. **Horizontal Editorial Case Studies (`/poster-work/[slug]` — `PosterCaseStudy.tsx`):**
   - Archival left poster matte frame + full-height signature-color info column (`accentHex`) + wheel-to-horizontal visual & video gallery (`object-fit: contain` on every image and `<video>`) + direct **`LAUNCH LIVE EXPERIENCE ↗`** CTA + `NEXT PROJECT →` loop tile.
   - `/poster-work/molotov-love` embeds all 3 local MP4 clips (`/media/fof/molotov-hey.mp4`, `/media/fof/molotov-coro.mp4`, `/media/fof/molotov-inversion.mp4`) directly inside `.jd-case-media-box`.

---

## 2. Architecture & Style Guardrails
- All gallery styles are strictly scoped under `.jd-gallery-root` in `app/gallery.css`.
- **0 occurrences of `object-fit: cover`** across every CSS file (`app/globals.css`, `app/gallery.css`, `app/work/no-sku/nosku.css`, `app/work/voyager-kids/voyager.css`, `app/work/ramses-mania/ramses.css`).
- Upgraded `next` / `eslint-config-next` to `15.5.29` and loaded `Bricolage Grotesque`, `Modak`, and `Space Mono` via Google Fonts `<link rel="stylesheet">` in `app/layout.tsx` to avoid `next/font/google`'s build-time regex crash on intermittent extensionless `/l/font?kit=` subset URLs.
- All existing flagship routes (`/work/ramses-mania`, `/work/voyager-kids`, `/work/no-sku`, `/work/vectra-twin`, `/work/frame-by-agents`, `/work/fuelorfool`, `/work/keys-to-my-heart`, `/work/minas-house`, `/merch`, `/contact`) remain completely intact.
