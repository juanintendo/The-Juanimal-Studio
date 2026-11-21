# Claude Handoff — Voyager 1 Storybook (`Voyager 1 for Kids` / Juanimal Portfolio Showcase #03)

> **Purpose:** Technical & creative handoff document for Claude to document this build as a case study on **fuelorfool.ing**.  
> **Repository:** `C:\Users\colom\.gemini\antigravity\scratch\juanimal-2026\site`  
> **Branch:** `v3-signature-director` (`5a91a8c` → `774928f` + topbar badge & handoff commit, pushed to `origin/v3-signature-director`)  
> **Routes:** `/work/voyager-kids` and `/work/voyager` (`app/work/voyager-kids/page.tsx`, `app/work/voyager/page.tsx`)  
> **Local Preview Servers:** `http://localhost:3050` (direct redirect proxy), `http://localhost:3000/work/voyager-kids`, and `http://localhost:3030/work/voyager-kids`

---

## 1. Project Context & Creative Direction

**Voyager 1 Storybook** is Portfolio Showcase #03 in Juanimal Studio's v3 signature director series. Inspired by the rounded wax-crayon board-book warmth of `howtotalktowhitekidsaboutracism.com`, it turns NASA's 1977 Voyager 1 interstellar mission into an interactive **bilingual (EN / ES) 3D hardcover picture book** starring **Guaca the Macaw** (*Guaca la Guacamaya Roja*).

Rather than placing flat HTML captions over static artwork, every chapter lives inside a **panoramic 1.95:1 rounded board-book spread** composed of 5 independent depth-separated layers inside WebGL:
- A tactile **Three.js 3D hardcover book** whose cover closes cleanly, whose flexible cotton-paper leaves bend realistically with arc-length preservation (`VoyagerBook3D.tsx`), and whose layers float and respond to desktop mouse motion or mobile device gyroscope tilt.
- **Sculpted 3D display typography headers** (`VOYAGER 1`, `Look UP HIGH`, `Mira ARRIBA`, `BLAST OFF!`, `¡DESPEGUE!`, `JUPITER`, `SATURN`, `GOLDEN RECORD`, `PALE BLUE DOT`, and Spanish equivalents) floating independently above starry night backgrounds and illustrated characters.
- A persistent **Guaca's Fact & Parent Spark** dock (`Dato de Guaca + Pregunta`) framed by an animated soothing bedtime pastel glowing edge (`@property --vg-glow-angle`) to invite parents to read science facts and bedtime prompts together with their kids.
- An interactive **Golden Record Explorer Modal** on Spread 05 (`Spin the Golden Record` / `Girar el Disco de Oro`) where parents and children can spin the gold vinyl disc, expand tracks inline to watch/listen via **YouTube embeds** (`youtube-nocookie.com`) or open direct YouTube links—including NASA's 55 greetings, Humpback Whale songs, Sounds of Earth, *El Cascabel* (Mexico) + Peruvian Panpipes, and Chuck Berry's **"Johnny B. Goode"** highlighted with a **`★ JB Favorite · Rock & Roll`** badge.
- A **Back-Cover Epilogue Panel** sliding open on the final closing page with direct NASA live-tracking and kids-science resource links.

---

## 2. Visual System, Palette & Typography Stack

All styling is isolated under `.vg-font-root` / `.vg-page` / `.vg-*` classes in [`app/work/voyager-kids/voyager.css`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/app/work/voyager-kids/voyager.css) with **0 occurrences of `object-fit: cover`**.

### Palette Tokens
| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Deep Cosmos** | `#0B0E1E` / `#14193A` | Full-viewport backdrop, popover glass cards, modal stage |
| **Cotton Cream** | `#FFF7E6` / `#F6EEDC` | Editorial storybook body copy, outlines, crisp contrast controls |
| **Voyager Gold** | `#FFD166` / `#F4A236` | Active chapter medallion rings, Golden Record disc, explorer tags |
| **Scarlet Guaca** | `#E84A3A` | Wax-crayon page navigation arrows & Chuck Berry rock badge |
| **Nebula Aqua** | `#98DCE6` / `#BCEEF7` | Parent prompt headers, Saturn icy highlights, gyroscope tilt toggle |
| **Soothing Bedtime Halo** | `#A8E6E2` → `#C7B8FF` → `#FFD6A5` → `#F9C6D3` → `#9BD4F8` | Animated conic-gradient pastel border & calm breathing halo on `.vg-maca-hero-pill` and `.vg-maca-popover` |

### Font Stack ([`app/work/voyager-kids/layout.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/app/work/voyager-kids/layout.tsx)) & Layer Typography
| Role | Font Family / Asset | CSS Variable / Layer | Usage |
| :--- | :--- | :--- | :--- |
| **Story Serif** | `Fraunces` (variable) | `--vg-font-serif` (`--vg-serif`) | Modal titles, parent prompts, rendered `text-{en\|es}.png` story prose |
| **Crayon Script** | `Patrick Hand` (400) | `--vg-font-crayon` (`--vg-crayon`) | Chapter arrows, popover eyebrows, tag headers |
| **Hand Brush** | `Caveat Brush` (400) | `--vg-font-brush` (`--vg-brush`) | Topbar fallback typography weight |
| **UI Sans** | `Inter Tight` (400/600/700) | `--vg-font-ui` (`--vg-ui`) | Controls, resource links, Golden Record player UI |
| **Sculpted Display Titles** | Custom isolated PNGs | `letters-{en\|es}.png` | Cloud, marbled Jupiter, frosted Saturn ice, engraved gold, and pale blue dot display lettering |

---

## 3. 3D Engine & Component Architecture

1. **[`components/voyager/VoyagerBook3D.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/voyager/VoyagerBook3D.tsx) (`VoyagerBook3D`):**
   - Renders `SPREADS.length + 1` physical double-sided pages (`pageW = 4.05`, `pageH = 4.15`, forming a `1.95:1` open spread panorama) with rounded outer board-book corners carved via procedural Canvas `alphaMap` + `alphaTest = 0.45`.
   - Uses horizontal vertex bending (`bendGeometry`) along each page leaf to preserve arc length during drag/wheel/button page turns and opens/closes the front & back covers symmetrically around spine center `frontCoverOffset = -pageW * 0.5`.
   - **`vg-parallax-page-v3` Custom `MeshStandardMaterial` Shader (`onBeforeCompile`):**
     - Samples `map` (`bg.png`) and composites 4 independent overlay uniforms: `uLayer1` (`letters`), `uLayer2` (`mid`), `uLayer3` (`fg`), and `uLayer4` (`text`), driven by `uParallax` (`mouse` or smoothed `deviceorientation` gyroscope tilt) with distinct depth weights (`uMove1 = 0.34/0.24`, `uMove2 = 0.52/0.34`, `uMove3 = 0.95/0.62`, `uMove4 = 0.10/0.06`).
     - Adds gentle organic idle hover (`float1`, `float2`, `float3`) animated via `uTime` & `uMotionScale` (`0` when `prefers-reduced-motion` is enabled).
     - Computes **parallax-reactive soft drop shadows** underneath floating display headers (`uv1S`, `0.24` density) and foreground sprites (`uv3S`, `0.20` density), plus a subtle center spine crease shadow (`uGutterShade`).

2. **[`components/voyager/VoyagerBookShowcase.tsx`](file:///C:/Users/colom/.gemini/antigravity/scratch/juanimal-2026/site/components/voyager/VoyagerBookShowcase.tsx):**
   - **Compact Topbar Emblem (`VoyagerHandLogo`):** Displays the custom circular illustrated Voyager 1 badge (`public/images/voyager/voyager-logo-badge.png`, `height: 50px` desktop / `42px` mobile inside the `58px` / `54px` header) linking cleanly back to cover page `0`.
   - **Wax-Crayon Arrows & Chapter Medallion Bar (`.vg-medallion-nav`):** Rounded allegorical illustration discs baked per chapter (`thumb.png`), with the active medallion expanding and displaying a curved SVG `<textPath>` chapter title.
   - **Guaca's Fact & Parent Spark Dock (`.vg-maca-hero-pill` + `.vg-maca-popover`):** Promoted bedtime pill button (`min-height: 52px`) with animated `@property --vg-glow-angle` pastel conic border and soft outer glow.
   - **Expandable Golden Record Player Modal (`RECORD_TRACKS`):** Clicking any engraved track toggles `.vg-track-expand`, embedding a responsive 16:9 `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1` iframe (with multi-version tab chips on `04` and `05`), direct `Watch on YouTube ↗` / `Abrir en YouTube ↗` external links, and clean unmount-on-close (`closeRecordModal` via `×`, backdrop click, page turn, or `Escape`).

---

## 4. Production Pipeline, QA Fixes & Lessons Learned (for `fuelorfool.ing`)

1. **Five-Layer Depth Separation (`bg` / `letters` / `mid` / `fg` / `text`):**
   - Keeping full-bleed flat illustrations on a spinning 3D plane felt stiff when tilted. Splitting each chapter into 5 registered PNGs inside one GLSL `onBeforeCompile` shader kept crisp Z-ordering with zero z-fighting during vertex page-bending while unlocking mouse + mobile gyroscope depth parallax.
2. **Extracting Light Pastel & Cloud Typography Over White Matte (`med_luma >= 252.8`):**
   - Sculpted letter assets rendered on `#FFFFFF` paper initially lost glossy cream highlights when naive white thresholds (`luma >= 244`) punched holes inside `BLAST OFF!`, `SATURN`, and `PALE BLUE DOT`, while leaving ~15,000px white perimeter halo blur against dark indigo backgrounds.
   - Separating enclosed counter thresholding (`med_luma >= 252.8` for pastel big letters, `med_luma >= 246` down to `3px` for cursive top brows like *Ready for* / *Listos para el*) from an outer semi-transparent halo strip (`alpha < 220 & luma > 232 & chroma < 18 -> 0`) + distance-transform RGB decontamination eliminated both punched highlights and chalky edges (`white_fringe_px` reduced from ~15k to `0–2px` across dark headers).
3. **Zero-Residue Character Cutouts (Hybrid Component-Split + RGB Delta Skin Recovery + Neural Matting):**
   - Fixed-column slicing (`[:, :295]`) clipped Voyager 1's bottom-left RTG cap and under-bus V-struts alongside Astronaut Guaca. Replacing coordinate slicing with **0-erosion GrabCut + connected-component centroid splitting** kept Voyager's delicate lattice wires intact across Cover, Jupiter, Saturn, and Pale Blue Dot.
   - On Spread 01 (`kids-maca.png`), neural matting via local **`rembg` (`isnet-general-use`)** preserved both of the Girl's curly afro puffs and Guaca's outstretched cobalt-blue wing cleanly against dusk gradient lighting. To recover the Boy's hand holding Guaca's tail (which softened inside green meadow shadows), we calibrated exact RGB channel deltas—pink/peach skin (`r - g >= 26 & g - b <= 38`) vs. olive meadow (`r - g <= 18 & g - b >= 60`)—to restore `alpha = 255` on the fingers and dark crayon outline without capturing nearby grass tufts.
   - Every exported `fg.png` layer enforces an automated `assert_zero_tiny_fg_residues()` gate (`connectedComponentsWithStats` filtering stray fragments `< 180px` at `alpha > 20`).
4. **Embedded YouTube Verification & Global CSS Isolation:**
   - Every video ID shipped inside `RECORD_TRACKS` (`Ww8nJigowa8`, `yZBMKyag1Gw`, `HslOMs5gMSA`, `Y-9Y4CCIWnM`, `6swgiM9vSEE`, `1puYprEvB4U`, `kG7WLgVEaKk`) was verified against YouTube oEmbed and `playableInEmbed: true`.
   - Just as in Showcase #02, `.vg-page nav` explicitly resets `app/globals.css`'s fixed top-nav styling so the bottom medallion navigation bar stays anchored cleanly.

---

## 5. Asset Inventory

### Standalone Badge & Canonical Plates (`public/images/voyager/`)
| Path | Role | Size (Bytes) |
| :--- | :--- | :--- |
| `voyager-logo-badge.png` | Topbar circular illustrated emblem (`244×240`) | `97,274` |
| `archive-v1/cover.png` | Canonical v1 cover plate | `2,569,325` |
| `archive-v1/spread-01-hello.png` | Canonical v1 Look Up High plate | `2,551,580` |
| `archive-v1/spread-02-launch.png` | Canonical v1 Blast Off plate | `2,324,419` |
| `archive-v1/spread-03-jupiter.png` | Canonical v1 Jupiter plate | `2,537,993` |
| `archive-v1/spread-04-saturn.png` | Canonical v1 Saturn plate | `2,846,985` |
| `archive-v1/spread-05-record.png` | Canonical v1 Golden Record plate | `2,033,476` |
| `archive-v1/spread-06-dot.png` | Canonical v1 Pale Blue Dot plate | `1,720,226` |
| `archive-v1/back-cover.png` | Canonical v1 back cover plate | `1,793,675` |

### Layered 2.5D Plates (`public/images/voyager/layers/`)
Each of the 8 folders (`cover`, `spread-01`, `spread-02`, `spread-03`, `spread-04`, `spread-05`, `spread-06`, `back-cover` — **64 files total**) ships:
- `bg.png` — Night sky, sunbeam, or wax-crayon meadow base
- `letters-en.png` / `letters-es.png` — Sculpted display headers per language
- `mid.png` — Twinkling stars, planetary rings, moons, Earth blue spark, or Golden Record orbits
- `fg.png` — Zero-residue hero foreground characters & Voyager probe (`tiny(<180px) = 0`)
- `text-en.png` / `text-es.png` — Crisp in-page serif narrative typography
- `thumb.png` — `256×256` allegorical crop for bottom chapter medallions

---

## 6. Commit Progression on `v3-signature-director`

- `5a91a8c` — `v3: build Portfolio #03 Voyager 1 for Kids (/work/voyager-kids, EN/ES 3D Three.js wax-crayon hardcover book with Maca the Scarlet Macaw)`
- `4aa6832` — `feat(voyager): round board-book corners, 2.5D parallax story layers, medallion nav, crayon arrows, gyroscope tilt, and clean close`
- `29b7878` — `feat(voyager): studio multi-layer PNG pipeline, sculpted display lettering, panoramic 1.95:1 book, and 2.5D shader parallax`
- `e2d4d4e` — `feat(voyager): sculpted bilingual display titles, zero-residue sprite QA, 3D float shadows & soothing glowing Maca trigger`
- `2028f76` — `feat(voyager): neural sprite cutouts, halo-free display headers, Guaca the Macaw rename & expandable Golden Record YouTube player`
- `774928f` — `fix(voyager): restore full opacity on boy's hand and trim thumb grass tuft in spread-01`
- *(Current commit)* — Compact topbar `voyager-logo-badge.png` emblem replacement + this Claude handoff documentation (`CLAUDE-HANDOFF-VOYAGER-KIDS.md`).
