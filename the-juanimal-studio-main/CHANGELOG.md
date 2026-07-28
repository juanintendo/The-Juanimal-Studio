# CHANGELOG — The Juanimal Studio Design Evolution

All changes from the live design conversation via Claude.

## Session Start — Design Brief

**Concept:** 1940s aged halftone print aesthetic portfolio for "Juanimal Studio" (UX/UI web & app, AI implementation, business tools).

**Initial Direction:**
- Atomic Age Print Pack visual reference
- Central character element (1940s cartoon style) with scroll-driven rotation
- Bold typography, cinematic scroll sequences
- Color: warm orange-red, aged cream, midnight black halftones
- Original plan: 3 cinematic video clips via Higgsfield Seedance 2.0

**Decision:** Scrapped video approach early. SVG/canvas halftone visuals + 3D CSS transforms render faster, scale perfectly, require zero external resources.

---

## v1.0 — Initial Build (SVG Character + Halftone)

**Included:**
- Hand-drawn SVG character (hoodie, cap, smirk)
- Halftone dot backgrounds
- Nav with tornasol gradient effect
- 3 service cards
- Stats count-up strip
- Work portfolio rows
- Paper grain overlay

**Issues noted:**
- SVG character looked "off" — illustrations are hard to get right by hand
- Halftone dots too fine (6-9px) — didn't read as print-like at normal viewing distance

---

## v1.1 — Logo Replacement (Gemini Generated)

**Change:** Replaced hand-drawn SVG with Gemini-generated illustration (1940s tech wizard character with red/cyan 3D glasses).

**Reasoning:** Gemini's style matched the brief perfectly — polished line work, authentic halftone halftones within the character.

**File size:** 813KB embedded (too heavy).

**Problem discovered:** Gemini baked a **fake checkerboard transparency pattern** into the image itself (rendered the checkerboard as pixels rather than leaving transparency).

---

## v1.2 — Logo Cleanup (Flood Fill Background Removal)

**Attempted fixes:**
1. First pass: Simple checkerboard detection + flood fill → left stray junk pixels around edges
2. Second pass: More aggressive detection + connected-component labeling → removed 17 disconnected islands

**Result:** Clean transparent PNG, 77-105KB.

**Vectorization experiment:** Tried vtracer to convert to SVG — halftone grain became thousands of tiny paths, file bloated to 1.4MB, posterized the texture. **Decision: Stay with PNG**, better quality at 1/13th the file size.

---

## v2.0 — 3D Scroll Parallax Hero

**Added:**
- Logo now at CSS depth +40px (floats toward viewer)
- Sunburst at -110px (behind logo, spins)
- New "depth ring" halftone layer at -190px (far background, creates parallax separation)
- Mouse parallax on desktop: logo tilts toward cursor (rotateX/rotateY)
- Scroll tilt: logo tilts back as you scroll down (simulates falling-back perspective)

**CSS Perspective:** `perspective: 1100px` on container, `transform-style: preserve-3d`

**Performance:** All GPU-accelerated via `will-change` and transform3d hints.

---

## v2.1 — Floating Seal Star Badges

**Added 4 floating starburst badges:**
- 12-pointed seals (mathematically perfect geometry)
- Labels: UX/UI, Webs, Apps, AI
- 4px black stroke, cream fill
- Halftone dot shadow behind each (rotated 25°)
- Floating animation (offsetY ±14px, eased sine wave, staggered delays)
- Each badge at different CSS depth to interact with 3D hero

**Positioning:**
- First pass: Stars at top/bottom of hero → clashed with tagline
- Revised: Top pair (13-16%), side pair at mid-height (48-52%) to avoid overlapping text and provide frame

---

## v2.2 — Halftone Size Increase

All dot patterns increased ~50% for better visual impact:

- Nav tornasol halftone: 6px → 9px (background-size)
- Star shadow pattern: 5px → 7.5px grid
- Depth ring: 11px → 15px
- Stats section dots: 9px → 13px
- Footer aged dots: 6px → 9px

**Reasoning:** At smaller sizes, halftone looked like fine texture noise. At 9-15px, dots become readable as an intentional **print technique**, not an accident.

---

## v2.3 — Nav Enhancement (Tornado Gradient Scroll Effect)

**Added:**
- Nav bar `::before` pseudo-element with animated gradient (iridescent 6-color cycling)
- Nav `::after` halftone dot mask layer (opacity 0 by default)
- On scroll past 40px: Both layers fade in, creating tornasol + halftone combo
- Transitions timed separately for layered effect

**Effect reads as:** Glass/foil revealing a hidden iridescent coating underneath, then getting stippled with halftone texture.

---

## v3.0 — Interactive Nav Frosted Glass Bubble

**Original approach:** Individual underline for each link (simple, boring).

**New approach:** Frosted glass pill-shaped bubble behind each nav link.

**Tech:**
- `backdrop-filter: blur(9px) saturate(1.35)` (diffuses nav tornasol behind the bubble)
- `-webkit-backdrop-filter` for Safari
- `box-shadow: 0 2px 14px` (soft depth)
- Scales from 0.7→1 on hover (elastic cubic-bezier, slight overshoot)
- Link also scales 1→1.06

**Design decision:** NO white stroke, NO inset highlight. Just the frosted glass itself — lets the nav's beautiful gradient shine through blurred.

---

## v3.1 — Attempted Morphing Bubble (Reverted)

**Idea:** Single shared bubble that drags & morphs between nav links as you hover.

**Implementation:** 
- CSS custom properties for bubble position/size (--bx, --by, --bw, --bh, --bo)
- JavaScript to update on mouseenter/focus
- Separate transition timing for position (cubic-bezier with overshoot) vs. size

**Problem:** JavaScript state management was fragile — edge cases with keyboard nav, focus loss, rapid mouse movement caused the bubble to "snap" or disappear unexpectedly.

**Decision:** Reverted to per-link bubbles. Simpler, bulletproof, looks nearly as good.

---

## v3.2 — Breathing Room & Layout Refinement

**Increased:**
- Hero center wrap bottom padding: 30px → 74px max (more space under logo)
- Tagline top margin: 34px → 48px (separates from stars)
- Tagline max-width: constrained to prevent line break under logo

**Stars repositioned:**
- Bottom pair moved to mid-height sides (top: 48-52% instead of bottom: 14-16%)
- Ensures tagline never overlaps badges
- Better visual balance (stars frame the logo, not the text below)

---

## v3.3 — Logo Version 2 (White Background)

**Received new logo file** with pure white background (no checkerboard baked in).

**Cleanup:**
- White detection: (min > 218) & (chroma < 26)
- Flood fill from edges → clean single component
- **Result:** Zero junk pixels on first pass (component labeling found only 1 region)
- PNG: 106KB, squeaky clean

---

## v3.4 — Wizard Theme Copy Updates

**Nav link text:**
- "What we do" → "About a Wizard"
- "Work" → "Portfolio Spellbook"
- "Contact" → "Summon me"

**Services section:**
- Eyebrow: "What we print" → "What we do" (original made no sense, the studio doesn't print)
- Title: "Soak your product with hot tactile craft" → "**Digital magic for *you or your business***"

**Rationale:** The wizard theme should extend through all copy, not just the logo. Copy feels like it matters when it's bespoke to the brand voice.

---

## v3.5 — Button Refinement (Pill Shape)

**CTA button in footer:**
- Added `border-radius: 999px` (full pill)
- Kept: 4px black stroke, red fill, 6px drop shadow, hover scale & shadow increase

**Visual:** Old sharp corners (still echoed 1940s brutalism). Pill shape softens it → feels playful, like a vintage gumball machine button.

---

## v3.6 — Logo Size & Scaling

- Hero logo width: 100% of centered container (max ~780px)
- Scales down on scroll: `scale(Math.max(.78, 1 - y/2600))`
- Scroll threshold: Full size until ~2600px scrolled, then caps at 78% min (never gets too small)

---

## v3.7 — Spacing & Responsive Refinement

**Hero section:**
- Padding increased: `130px 20px 80px` → extra top breathing room for nav
- Stars reposition on mobile (<700px): shrink from 96px → 82px width

**Services grid:**
- `grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))`
- Flows to 1 column on mobile, 2-3 on tablet/desktop

**Work rows:**
- Flex layout: title left, meta (date/type) right
- On mobile, meta stays inline but is smaller
- Hover padding-left increase only on hover (left arrow effect)

---

## v3.8 — Accessibility & Performance

**Included (no opt-in needed):**
- Semantic HTML5 (nav, section, article, header)
- ARIA labels on decorative SVGs (`aria-hidden="true"`)
- Focus visible states (3px outline, offset 3px)
- Keyboard nav: Tab through nav links and CTA button
- `prefers-reduced-motion: reduce` respected — animations disabled, transitions removed

**Performance:**
- Single HTTP request (everything embedded, base64 logo)
- Zero external scripts
- CSS Grid & Flexbox (native GPU acceleration)
- 307KB gzipped HTML

---

## Design Principles (Meta)

**Why this direction?**

1. **Print aesthetic** — Halftone + drop shadows + aged paper feel grounds a digital portfolio as real craft, not AI-generated-looking templates
2. **3D scroll theater** — Logo in perspective makes the hero feel like a stage; viewer is an audience watching it tilt & rotate
3. **Wizard branding** — Not just a logo; it's a persona. Copy, interactions, details (frosted glass, sparkling stars, magical motion) all reinforce it
4. **Performance first** — No heavy video, no external fonts beyond Google Fonts, no framework bloat
5. **Tactile feedback** — Hover effects (bubble scale, pill buttons, link pops) feel good because they're instant and physical (not floating, not too smooth)

---

## Known Limitations / Future Ideas

- [ ] SVG star morph animation on nav (attempted, too complex for now)
- [ ] Animated work examples (project images/video embeds)
- [ ] Dark mode toggle (brief didn't ask for it, but halftone theme is so red/cream-specific it's hard to invert tastefully)
- [ ] Parallax on mobile (backdrop-filter isn't GPU-accelerated on iOS 15-, performance risk)
- [ ] Full-page scroll snap (could lock to sections, but might fight with 3D parallax timing)

---

## File Manifest

```
index.html              307KB   Main site (everything embedded)
README.md                       Setup & customization guide
CHANGELOG.md            (you are here)
.gitignore             (git config, node_modules, .env)
package.json (optional) (for deployment scripts, no dependencies needed)
```

---

**Last Updated:** 2026-07-18 18:40 UTC  
**Status:** Production-ready  
**Browser Target:** Chrome/Firefox/Safari (ES6+, CSS Grid, backdrop-filter)
