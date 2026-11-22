"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import type { GalleryProject } from "@/lib/gallery/projects";

interface PosterCarousel3DProps {
  projects: GalleryProject[];
  jumpRequest: { idx: number; nonce: number } | null;
  reduced: boolean;
  onFocusChange: (idx: number) => void;
  onHoverChange: (idx: number | null) => void;
  onSelectProject: (project: GalleryProject) => void;
  onReady: () => void;
}

const SLUG_TO_EFFECT_ID: Record<string, number> = {
  "ramses-mania": 0,
  "voyager-kids": 1,
  "no-sku": 2,
  "vectra-twin": 3,
  "frame-by-agents": 4,
  fuelorfool: 5,
  "molotov-love": 6,
  "keys-to-my-heart": 7,
  "club-of-the-dead": 8,
  "brrt-receipts": 9,
};

const POSTER_VERT = `
  varying vec2 vUv;
  varying float vBend;
  varying float vCenterBulge;
  varying float vHitDist;

  uniform float uVelocity;
  uniform float uHover;
  uniform float uBrrtHover;
  uniform float uTime;
  uniform float uMotionScale;
  uniform float uIndex;
  uniform float uBump;
  uniform vec2 uHit;
  uniform vec2 uPointer;

  float parabola(float x, float k) {
    return pow(max(0.0, 4.0 * x * (1.0 - x)), k);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Justine Soulié's signature parabolic center-of-viewport convex bulge (no hover zoom!)
    vec4 clipPos = modelViewMatrix * vec4(pos, 1.0);
    float ndcX = clamp(clipPos.x / max(0.001, clipPos.w), -1.0, 1.0);
    float normX = ndcX * 0.5 + 0.5;
    float centerBulge = parabola(normX, 1.35);
    vCenterBulge = centerBulge;

    pos.z += centerBulge * 0.44 * uBump;

    // Subtle pullback on fast swipe + wheat-pasted S-wave velocity flex
    float pullBack = min(abs(uVelocity) * 0.22, 0.16);
    pos.z -= pullBack * uBump;

    float curveY = sin(uv.y * 3.14159265);
    float curveX = (uv.x - 0.5) * 2.0;
    float velBend = -curveX * uVelocity * 0.25 - curveY * abs(uVelocity) * 0.14;
    pos.z += velBend;

    // Subtle living breath across the paper plane
    pos.z -= sin(uv.y * 9.0 + uIndex * 1.9 + uTime * 0.72) * 0.011 * uMotionScale * uBump;
    pos.y -= cos(uv.x * 8.5 + uIndex * 2.3 + uTime * 0.54) * 0.0035 * uMotionScale * uBump;

    // Local cursor dimple pressing gently into the paper without expanding the poster
    float hitDist = clamp(1.0 - distance(uv - vec2(0.5), uHit) / 0.36, 0.0, 1.0) * uHover;
    pos.z -= hitDist * 0.055 * uBump;
    vHitDist = hitDist;
    vBend = clamp(abs(velBend) * 2.4, 0.0, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const POSTER_FRAG = `
  varying vec2 vUv;
  varying float vBend;
  varying float vCenterBulge;
  varying float vHitDist;

  uniform sampler2D uMap;
  uniform sampler2D uNormals;
  uniform float uHover;
  uniform float uBrrtHover;
  uniform float uTime;
  uniform float uMotionScale;
  uniform float uIndex;
  uniform float uEffectId;
  uniform float uFocusWeight;
  uniform vec2 uHit;
  uniform vec2 uPointer;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 rotateUV(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c) * (uv - 0.5) + 0.5;
  }

  vec2 rotateUvPivot(vec2 uv, float angle, vec2 pivot) {
    float s = sin(angle);
    float c = cos(angle);
    vec2 p = uv - pivot;
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c) + pivot;
  }

  vec2 scaleUvPivot(vec2 uv, vec2 scale, vec2 pivot) {
    return (uv - pivot) * scale + pivot;
  }

  // Exact speech-balloon mask for poster 09 BRRT (excludes outer cream paper and curling receipt ribbon)
  float brrtMask(vec2 p) {
    float dx = p.x - 0.52;
    float outerL = max(0.0, 0.20 - p.x);
    float yBot = 0.650
      + 0.098 * smoothstep(0.24, 0.49, p.x)
      + 0.72 * pow(outerL, 1.6)
      + 0.060 * smoothstep(0.80, 0.89, p.x);
    float yTop = 0.974 + 0.048 * dx - 0.55 * dx * dx - 0.03 * smoothstep(0.82, 0.90, p.x);
    float xM = smoothstep(0.125, 0.145, p.x) * smoothstep(0.900, 0.880, p.x);
    float yM = smoothstep(yBot - 0.010, yBot + 0.010, p.y) * smoothstep(yTop + 0.010, yTop - 0.010, p.y);
    return xM * yM;
  }

  // Diagonal sweeping foil/gloss band matching Justine's Extra shine shader
  float extraShine(vec2 uv, float t, float speed, float width, float phase) {
    vec2 ruv = rotateUV(uv, 0.55);
    float progress = mix(1.9, -1.9, fract(t * speed + phase));
    return smoothstep(0.0, width, ruv.x + progress) - smoothstep(width, width * 2.0, ruv.x + progress);
  }

  vec3 blendScreen(vec3 base, vec3 blend, float op) {
    vec3 scr = 1.0 - (1.0 - base) * (1.0 - blend);
    return mix(base, scr, op);
  }

  void main() {
    vec2 normUv = vUv * vec2(0.92, 1.18) + vec2(uIndex * 0.17, uIndex * 0.11);
    vec3 normTexel = texture2D(uNormals, normUv).rgb;
    vec3 nSample = normTexel * 2.0 - 1.0;

    // True ink UV refraction along paper creases that relaxes smoothly under pointer press
    float dispAmt = mix(0.0028, 0.0005, vHitDist) + vBend * 0.0012;
    vec2 baseUv = clamp(vUv - nSample.xy * dispAmt, 0.001, 0.999);
    float id = floor(uEffectId + 0.5);

    // Subtle non-destructive artwork-space micro-motion before texture lookup (motion-gated)
    vec2 artUv = baseUv;
    float m = uMotionScale;
    float brrtZone = 0.0;
    float brrtHoverActive = 0.0;

    if (id < 0.5) {
      // 00 RAMSES: rising radiator heat haze
      float radZone = smoothstep(0.35, 0.18, baseUv.y) * smoothstep(0.24, 0.34, baseUv.x) * smoothstep(0.76, 0.66, baseUv.x);
      float hazeAmp = (0.0015 + 0.0016 * uHover) * radZone * m;
      artUv.x += sin(baseUv.y * 58.0 - uTime * 4.4 + baseUv.x * 18.0) * hazeAmp;
    } else if (id > 5.5 && id < 6.5) {
      // 06 MOLOTOV LOVE: living crimson flame ripple
      vec3 probe = texture2D(uMap, baseUv).rgb;
      float flameMask = smoothstep(0.42, 0.66, probe.r) * smoothstep(0.32, 0.18, probe.g) * smoothstep(0.30, 0.16, probe.b);
      float fAmp = (0.0015 + 0.0014 * uHover) * flameMask * m;
      artUv.x += sin(baseUv.y * 34.0 - uTime * 5.6 + baseUv.x * 16.0) * fAmp;
    } else if (id > 6.5 && id < 7.5) {
      // 07 KEYS TO MY HEART: authentic 1926 8fps animation pencil boil inside Claudia's box
      float step8 = floor(uTime * 8.0);
      float boxMask = step(0.08, baseUv.x) * step(baseUv.x, 0.92) * step(0.05, baseUv.y) * step(baseUv.y, 0.72);
      vec2 boil = vec2(sin(step8 * 17.3 + baseUv.y * 9.0), cos(step8 * 13.7 + baseUv.x * 9.0)) * 0.00055 * boxMask * m;
      artUv += boil;
    } else if (id > 8.5) {
      // 09 BRRT: subtle printer paper-feed wave along the curling ticket ribbon on hover
      float ticketBand = smoothstep(0.24, 0.32, baseUv.y) * smoothstep(0.76, 0.66, baseUv.y);
      artUv.y += sin(baseUv.y * 42.0 - uTime * 6.0) * 0.0011 * ticketBand * vHitDist * m;

      // Justine Soulié createTypo: Liquid UV Displacement + Radial Swirl/Pinch Warp ("Liquify") clamped strictly inside BRRT balloon
      brrtZone = brrtMask(baseUv);
      vec2 hitUv = uHit + vec2(0.5);
      vec2 brrtPivot = vec2(clamp(hitUv.x, 0.20, 0.82), clamp(hitUv.y, 0.70, 0.90));
      brrtHoverActive = uBrrtHover;
      float brrtHoverDist = clamp(1.0 - distance(baseUv, brrtPivot) / 0.30, 0.0, 1.0) * brrtHoverActive;
      vec2 liquidUv = baseUv;
      liquidUv.y += sin(uTime * 1.8 + baseUv.x * 6.0 + baseUv.y * 6.0) * (0.0038 + 0.0045 * brrtHoverActive) * m;
      liquidUv.x += cos(uTime * 1.4 + baseUv.y * 7.0) * (0.0018 + 0.0028 * brrtHoverActive) * m;
      liquidUv = rotateUvPivot(liquidUv, -brrtHoverDist * 0.26 * m, brrtPivot);
      liquidUv = scaleUvPivot(liquidUv, vec2(1.0 - brrtHoverDist * 0.15 * m), brrtPivot);
      float safeWarp = brrtZone * brrtMask(liquidUv);
      artUv = mix(artUv, liquidUv, safeWarp * m);
    }

    vec4 tex = texture2D(uMap, clamp(artUv, 0.001, 0.999));
    vec3 col = tex.rgb;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    float sat = max(col.r, max(col.g, col.b)) - min(col.r, min(col.g, col.b));
    vec2 cDelta = (baseUv - vec2(0.5)) - uHit;
    float cursorMask = exp(-dot(cDelta, cDelta) * 18.0) * uHover;

    if (id < 0.5) {
      // 00 RAMSES: sunburst energy + crown & title gold foil shine + sunbeam hover light
      float sunRays = smoothstep(0.14, 0.32, sat) * smoothstep(0.79, 0.72, baseUv.y) * smoothstep(0.25, 0.38, baseUv.y);
      col += vec3(0.055, 0.035, 0.015) * (0.5 + 0.5 * sin(uTime * 1.9 + atan(baseUv.y - 0.45, baseUv.x - 0.5) * 6.0)) * sunRays * m;

      float crownZone = smoothstep(0.66, 0.70, baseUv.y) * smoothstep(0.81, 0.77, baseUv.y) * smoothstep(0.39, 0.44, baseUv.x) * smoothstep(0.61, 0.56, baseUv.x);
      float goldTone = smoothstep(0.52, 0.78, col.r) * smoothstep(0.45, 0.68, col.g);
      float crownShine = extraShine(baseUv, uTime, 0.34, 0.22, 0.1) * crownZone * goldTone * m;
      float titleShine = extraShine(baseUv, uTime, 0.28, 0.25, 0.4) * step(0.79, baseUv.y) * step(lum, 0.32) * m;

      col += vec3(0.24, 0.19, 0.06) * (crownShine + titleShine * 0.65);
      // Logical hover: warm sunbeam spotlight descending onto Ramses + radiator
      float beamAngle = abs((baseUv.x - 0.5 - uHit.x) - (baseUv.y - 0.5 - uHit.y) * 0.22);
      float sunBeam = exp(-beamAngle * beamAngle * 38.0) * uHover * 0.11;
      col += vec3(0.22, 0.15, 0.05) * cursorMask + vec3(1.0, 0.90, 0.62) * sunBeam;
    } else if (id < 1.5) {
      // 01 VOYAGER 1: twinkling starfield + Golden Record & title 24k gold shine + cosmic cursor aura
      float tinyStar = step(0.58, lum) * smoothstep(0.78, 0.68, baseUv.y);
      float tw = 0.5 + 0.5 * sin(uTime * 3.1 + hash21(floor(baseUv * 36.0)) * 6.283);
      col += vec3(0.14, 0.16, 0.22) * tinyStar * tw * m;

      // Golden Record disc around (0.65, 0.47) + arched VOYAGER 1 letters
      float recDist = distance(baseUv, vec2(0.66, 0.47));
      float recordMask = smoothstep(0.115, 0.092, recDist);
      float titleGold = step(0.77, baseUv.y) * step(0.38, lum);
      float goldShine = extraShine(baseUv, uTime, 0.32, 0.24, 0.25) * m;
      float hoverGlint = smoothstep(0.18, 0.0, abs(dot(normalize(vec2(uHit.x + 0.4, uHit.y + 0.3)), baseUv - vec2(0.66, 0.47)))) * recordMask * uHover;
      col += vec3(0.28, 0.21, 0.06) * (goldShine * (recordMask * 0.9 + titleGold * 0.65) + hoverGlint * 0.45);
      col += vec3(0.14, 0.18, 0.32) * cursorMask * (0.4 + 0.6 * smoothstep(0.35, 0.05, lum));
    } else if (id < 2.5) {
      // 02 NO SKU™: glossy vinyl tape reflection + crisp lacquer sweep across NO SKU™
      float isRedTape = smoothstep(0.52, 0.74, col.r) * smoothstep(0.38, 0.22, col.g) * smoothstep(0.32, 0.18, col.b);
      float isWhiteTape = step(0.84, lum) * smoothstep(0.68, 0.60, baseUv.y) * step(0.10, baseUv.x) * step(baseUv.x, 0.74);
      float sheen = extraShine(baseUv, uTime, 0.30, 0.22, 0.5) * m;
      float titleBlack = step(0.68, baseUv.y) * step(lum, 0.22);
      col += vec3(0.22, 0.20, 0.18) * sheen * (isRedTape * 0.75 + isWhiteTape * 0.45 + titleBlack * 0.55);
      // Logical hover: crisp specular tension highlight sliding over the vinyl tape under cursor
      float hSheen = exp(-abs(dot(baseUv - vec2(0.5) - uHit, vec2(0.707, 0.707))) * 22.0) * cursorMask;
      col += vec3(0.26, 0.22, 0.18) * (hSheen * (0.45 + isRedTape * 0.6) + cursorMask * 0.07);
    } else if (id < 3.5) {
      // 03 VECTRA TWIN // AI: sweeping volumetric radar beam + hologram wireframe + hover scan lock
      vec2 radP = baseUv - vec2(0.50, 0.43);
      float radR = length(radP);
      float radAng = atan(radP.y, radP.x);
      float sweep = pow(0.5 + 0.5 * cos(radAng + uTime * 1.45), 6.0) * smoothstep(0.44, 0.22, radR) * smoothstep(0.04, 0.14, radR);
      float scanLine = 0.5 + 0.5 * sin(baseUv.y * 170.0 - uTime * 3.5);
      float neon = smoothstep(0.35, 0.75, max(col.g, col.b));
      float titleCyan = step(0.74, baseUv.y) * step(baseUv.y, 0.87) * smoothstep(0.45, 0.78, col.b);
      col += vec3(0.05, 0.19, 0.22) * sweep * (0.45 + neon * 0.8) * m;
      col += vec3(0.02, 0.09, 0.11) * scanLine * neon * 0.45 * m;
      col += vec3(0.08, 0.25, 0.28) * extraShine(baseUv, uTime, 0.36, 0.20, 0.2) * titleCyan * m;

      // Logical hover: telemetry lock reticle + tiny wireframe cyan chromatic glow at cursor
      if (uHover > 0.01) {
        float cDist = distance(baseUv - vec2(0.5), uHit);
        float reticle = smoothstep(0.11, 0.10, abs(cDist - 0.10)) * 0.35 + exp(-cDist * cDist * 45.0) * 0.25;
        vec2 splitUv = clamp(artUv + vec2(0.0018 * vHitDist, 0.0), 0.001, 0.999);
        col.b = mix(col.b, texture2D(uMap, splitUv).b, 0.65 * vHitDist);
        col += vec3(0.06, 0.24, 0.28) * reticle * uHover;
      }
    } else if (id < 4.5) {
      // 04 FRAME BY AGENTS: 12fps film-gate flicker + Ben-Day circle glow + Extra logo shine + hover lightbox
      float f12 = floor(uTime * 12.0);
      float gate = (hash21(vec2(f12, uIndex)) - 0.5) * 0.032 * m;
      float frameArea = step(0.09, baseUv.x) * step(baseUv.x, 0.91) * step(0.15, baseUv.y) * step(baseUv.y, 0.77);
      col *= 1.0 + gate * frameArea;

      float dots = smoothstep(0.45, 0.72, col.r) * smoothstep(0.42, 0.25, col.b);
      col += vec3(0.08, 0.02, 0.01) * (0.5 + 0.5 * sin(uTime * 2.2)) * dots * m;
      float logoShine = extraShine(baseUv, uTime, 0.33, 0.24, 0.6) * step(0.77, baseUv.y) * step(0.55, lum) * m;
      col += vec3(0.22, 0.17, 0.10) * logoShine;
      // Logical hover: warm animation desk lightbox illuminating pencil paper & dress
      col += vec3(0.22, 0.16, 0.09) * cursorMask * (0.55 + 0.45 * step(0.55, lum));
    } else if (id < 5.5) {
      // 05 FUEL OR FOOL: Justine's signature "Extra"-style metallic foil glint on yellow & cobra highlights!
      float isYellow = smoothstep(0.72, 0.88, col.r) * smoothstep(0.52, 0.72, col.g) * smoothstep(0.40, 0.18, col.b);
      float isCobalt = smoothstep(0.45, 0.72, col.b) * smoothstep(0.32, 0.16, col.r);
      float foil = extraShine(baseUv, uTime, 0.36, 0.26, 0.0) * m;
      float cobraShimmer = 0.5 + 0.5 * sin(uTime * 3.4 - baseUv.y * 16.0);
      col += vec3(0.32, 0.27, 0.10) * foil * (isYellow * 1.15 + 0.12);
      col += vec3(0.05, 0.09, 0.22) * cobraShimmer * isCobalt * 0.45 * m;
      // Logical hover: vivid specular comic-foil glint chasing cursor
      float hFoil = exp(-abs(dot(baseUv - vec2(0.5) - uHit, vec2(0.83, 0.55))) * 16.0) * uHover;
      col += vec3(0.28, 0.24, 0.12) * hFoil * (isYellow + 0.22) + vec3(0.10, 0.14, 0.24) * cursorMask * isCobalt;
    } else if (id < 6.5) {
      // 06 MOLOTOV LOVE: flickering red embers + gritty Extra bone-gold shine on logo + hover stoke
      float isFlame = smoothstep(0.45, 0.68, col.r) * smoothstep(0.32, 0.16, col.g) * smoothstep(0.28, 0.14, col.b) * smoothstep(0.75, 0.65, baseUv.y);
      float emberWave = 0.5 + 0.5 * sin(uTime * 5.4 - baseUv.y * 22.0 + baseUv.x * 10.0);
      col += vec3(0.18, 0.06, 0.01) * emberWave * isFlame * m;

      float isBoneTitle = step(0.68, baseUv.y) * smoothstep(0.62, 0.80, lum);
      float foil = extraShine(baseUv, uTime, 0.30, 0.26, 0.3) * isBoneTitle * m;
      col += vec3(0.28, 0.23, 0.12) * foil;
      // Logical hover: stokes flames into bright hot amber glow + warm stage light under cursor
      col += vec3(0.28, 0.12, 0.03) * cursorMask * (0.35 + isFlame * 1.2) + vec3(0.12, 0.09, 0.05) * cursorMask * (1.0 - isFlame);
    } else if (id < 7.5) {
      // 07 KEYS TO MY HEART: 1926 cartoon gold-star twinkle + hand-lettered logo Extra shine + hover spotlight
      float isOrangeStar = smoothstep(0.66, 0.84, col.r) * smoothstep(0.24, 0.48, col.g) * smoothstep(0.32, 0.16, col.b);
      float starPulse = 0.5 + 0.5 * sin(uTime * 2.6 + baseUv.x * 12.0);
      col += vec3(0.18, 0.08, 0.01) * isOrangeStar * starPulse * m;

      float titleInk = step(0.73, baseUv.y) * (isOrangeStar + step(lum, 0.25) * 0.65);
      col += vec3(0.24, 0.14, 0.04) * extraShine(baseUv, uTime, 0.29, 0.23, 0.7) * titleInk * m;
      // Logical hover: warm animation-studio cel lamp illuminating Claudia & popping orange star
      col += vec3(0.18, 0.13, 0.07) * cursorMask * (0.4 + 0.8 * isOrangeStar);
    } else if (id < 8.5) {
      // 08 CLUB OF THE DEAD: Extra neon-magenta brush gloss on logo + drifting cemetery fog + lime glow
      float isMagentaLogo = step(0.68, baseUv.y) * step(0.38, baseUv.x) * (smoothstep(0.55, 0.78, col.r) * smoothstep(0.38, 0.22, col.g) + smoothstep(0.72, 0.88, lum) * 0.7);
      float foil = extraShine(baseUv, uTime, 0.35, 0.24, 0.15) * isMagentaLogo * m;
      col += vec3(0.28, 0.14, 0.24) * foil;

      float horizonMist = smoothstep(0.37, 0.44, baseUv.y) * smoothstep(0.60, 0.52, baseUv.y) * smoothstep(0.35, 0.15, lum);
      float mistWave = 0.5 + 0.5 * sin(baseUv.x * 12.0 - uTime * 1.1 + baseUv.y * 8.0);
      col += vec3(0.03, 0.10, 0.11) * horizonMist * mistWave * m;

      // Subtle lime eye & jewel pulse
      float isLime = smoothstep(0.50, 0.75, col.g) * smoothstep(0.45, 0.22, col.b);
      col += vec3(0.05, 0.12, 0.03) * (0.5 + 0.5 * sin(uTime * 3.0)) * isLime * m;
      // Logical hover: nocturnal cyan-magenta rim flashlight around cursor
      col += vec3(0.18, 0.08, 0.16) * cursorMask * step(0.45, baseUv.y) + vec3(0.07, 0.17, 0.18) * cursorMask * step(baseUv.y, 0.55);
    } else {
      // 09 BRRT: rising 80mm thermal print-head scan light + cobalt halftone glow + seamless cream gradient pulse
      float isCobalt = smoothstep(0.50, 0.76, col.b) * smoothstep(0.32, 0.16, col.r);
      float isTicket = step(0.74, lum) * smoothstep(0.26, 0.34, baseUv.y) * smoothstep(0.76, 0.68, baseUv.y) * (1.0 - brrtZone);
      float sweepY = fract(uTime * 0.36);
      float printHead = exp(-pow((baseUv.y - mix(0.26, 0.74, sweepY)) * 12.0, 2.0)) * isTicket * m;
      col += vec3(0.14, 0.16, 0.20) * printHead;
      col += vec3(0.04, 0.08, 0.18) * (0.5 + 0.5 * sin(uTime * 2.5)) * isCobalt * m;

      // Seamless cream-palette vertical gradient pulse strictly inside BRRT letters on hover
      float brrtLetters = brrtZone * brrtMask(artUv) * smoothstep(0.62, 0.78, lum);
      float pulseGrad = abs(mod(baseUv.y * 1.4 + uTime * 0.5, 1.0) - 0.5) * 2.0;
      vec3 creamWarm = vec3(1.00, 0.96, 0.85);
      vec3 creamCool = vec3(0.84, 0.92, 1.00);
      vec3 brrtPulse = mix(creamWarm, creamCool, pulseGrad) * (0.94 + 0.06 * lum);
      col = mix(col, brrtPulse, brrtLetters * brrtHoverActive * 0.72);

      col += vec3(0.20, 0.20, 0.24) * extraShine(baseUv, uTime, 0.33, 0.24, 0.45) * brrtLetters * m;
      // Logical hover: cool electric riso highlight around cursor over ticket & printer (muted on BRRT so shimmer reads cleanly)
      col += vec3(0.10, 0.15, 0.26) * cursorMask * (0.45 + 0.65 * isCobalt + 0.45 * isTicket) * (1.0 - brrtZone * 0.85);
    }

    // Tactile paper-crease relief shading + micro paper fiber grain blended like Justine's posters
    float relief = mix(0.36, 0.20, vHitDist) + vBend * 0.14;
    vec3 n = normalize(vec3(nSample.xy * relief, 1.0));
    vec3 lightDir = normalize(vec3(0.28 + uPointer.x * 0.40, 0.52 - uPointer.y * 0.30, 1.0));
    float diff = clamp(dot(n, lightDir), 0.78, 1.08);
    vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, halfVec), 0.0), 22.0) * (0.04 + 0.06 * uHover + 0.03 * vCenterBulge);

    col = blendScreen(col, normTexel, 0.055);
    col = col * diff + vec3(spec);

    // Gentle contrast focus attenuation on distant flanking posters
    float vignette = mix(0.92, 1.0, uFocusWeight);
    col *= vignette;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

function modPositive(val: number, len: number): number {
  return ((val % len) + len) % len;
}

export default function PosterCarousel3D({
  projects,
  jumpRequest,
  reduced,
  onFocusChange,
  onHoverChange,
  onSelectProject,
  onReady,
}: PosterCarousel3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(true);

  const reducedRef = useRef(reduced);
  const onFocusRef = useRef(onFocusChange);
  const onHoverRef = useRef(onHoverChange);
  const onSelectRef = useRef(onSelectProject);
  const onReadyRef = useRef(onReady);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const lastInputTimeRef = useRef(0);

  reducedRef.current = reduced;
  onFocusRef.current = onFocusChange;
  onHoverRef.current = onHoverChange;
  onSelectRef.current = onSelectProject;
  onReadyRef.current = onReady;

  const stride = 3.25;
  const totalCount = projects.length;
  const loopW = totalCount * stride;

  useEffect(() => {
    if (!jumpRequest) return;
    const targetRaw = jumpRequest.idx * stride;
    const cur = targetScrollRef.current;
    const curMod = modPositive(cur, loopW);
    let delta = targetRaw - curMod;
    if (delta > loopW * 0.5) delta -= loopW;
    if (delta < -loopW * 0.5) delta += loopW;
    targetScrollRef.current = cur + delta;
    lastInputTimeRef.current = performance.now();
  }, [jumpRequest, loopW, stride]);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglReady(false);
      onReadyRef.current();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const initW = container.clientWidth || 1280;
    const initH = container.clientHeight || 720;
    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH);
    renderer.domElement.className = "jd-webgl-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      initW / Math.max(1, initH),
      0.1,
      80
    );

    const posterW = 2.55;
    const posterH = 3.4;
    const posterGeo = new THREE.PlaneGeometry(posterW, posterH, 28, 36);
    const shadowGeo = new THREE.PlaneGeometry(posterW * 1.01, posterH * 1.01);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x15131a,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });

    const createdTextures: THREE.Texture[] = [];
    const createdMats: THREE.Material[] = [shadowMat];
    const createdVideos: Array<{
      video: HTMLVideoElement;
      tex: THREE.VideoTexture;
      onReady: () => void;
    }> = [];

    const unlockVideos = () => {
      createdVideos.forEach(({ video }) => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
    };

    const fallbackPosterTex = new THREE.DataTexture(
      new Uint8Array([240, 234, 224, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackPosterTex.needsUpdate = true;

    const flatNormalTex = new THREE.DataTexture(
      new Uint8Array([128, 128, 255, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    flatNormalTex.needsUpdate = true;
    createdTextures.push(fallbackPosterTex, flatNormalTex);

    const loader = new THREE.TextureLoader();
    let disposed = false;
    let readyFired = false;
    let loadedInitialCount = 0;

    const markLoaded = () => {
      loadedInitialCount += 1;
      if (!readyFired && loadedInitialCount >= Math.min(4, totalCount)) {
        readyFired = true;
        onReadyRef.current();
      }
    };

    const readyTimeout = setTimeout(() => {
      if (!readyFired) {
        readyFired = true;
        onReadyRef.current();
      }
    }, 1100);

    const loadTex = (
      url: string,
      wrapRepeat = false,
      onDone?: (tex: THREE.Texture) => void
    ) => {
      loader.load(
        url,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.wrapS = wrapRepeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
          tex.wrapT = wrapRepeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;
          createdTextures.push(tex);
          onDone?.(tex);
        },
        undefined,
        () => {
          markLoaded();
        }
      );
    };

    interface PosterRig {
      idx: number;
      project: GalleryProject;
      group: THREE.Group;
      mesh: THREE.Mesh;
      shadowMesh: THREE.Mesh;
      hoverVal: number;
      brrtHoverVal: number;
      targetHit: THREE.Vector2;
      uniforms: {
        uMap: { value: THREE.Texture };
        uNormals: { value: THREE.Texture };
        uVelocity: { value: number };
        uHover: { value: number };
        uBrrtHover: { value: number };
        uTime: { value: number };
        uMotionScale: { value: number };
        uIndex: { value: number };
        uEffectId: { value: number };
        uBump: { value: number };
        uHit: { value: THREE.Vector2 };
        uPointer: { value: THREE.Vector2 };
        uFocusWeight: { value: number };
      };
    }

    const posterRigs: PosterRig[] = [];
    const hitTargets: THREE.Mesh[] = [];

    const sharedNormals = { value: flatNormalTex as THREE.Texture };
    loadTex("/images/gallery/paper-normals.png", true, (tex) => {
      sharedNormals.value = tex;
      posterRigs.forEach((rig) => {
        rig.uniforms.uNormals.value = tex;
      });
    });

    projects.forEach((project, idx) => {
      const group = new THREE.Group();
      scene.add(group);

      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0.08, -0.1, -0.12);
      group.add(shadowMesh);

      const effectId = SLUG_TO_EFFECT_ID[project.slug] ?? idx;
      const uniforms: PosterRig["uniforms"] = {
        uMap: { value: fallbackPosterTex },
        uNormals: { value: sharedNormals.value },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uBrrtHover: { value: 0 },
        uTime: { value: 0 },
        uMotionScale: { value: 1 },
        uIndex: { value: idx },
        uEffectId: { value: effectId },
        uBump: { value: 1 },
        uHit: { value: new THREE.Vector2(0, 0) },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uFocusWeight: { value: 1 },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: POSTER_VERT,
        fragmentShader: POSTER_FRAG,
        uniforms,
      });
      createdMats.push(mat);

      const mesh = new THREE.Mesh(posterGeo, mat);
      mesh.userData = { idx };
      group.add(mesh);
      hitTargets.push(mesh);

      const restTilt = (idx % 2 === 0 ? -1 : 1) * (0.011 + (idx % 3) * 0.004);
      group.rotation.z = restTilt;

      posterRigs.push({
        idx,
        project,
        group,
        mesh,
        shadowMesh,
        hoverVal: 0,
        brrtHoverVal: 0,
        targetHit: new THREE.Vector2(0, 0),
        uniforms,
      });

      loadTex(project.posterSrc, false, (tex) => {
        // Keep static frame loaded instantly as fallback; swap to VideoTexture once decoded
        if (uniforms.uMap.value === fallbackPosterTex) {
          uniforms.uMap.value = tex;
        }
        markLoaded();
      });

      if (project.posterVideoSrc && !reducedRef.current) {
        const video = document.createElement("video");
        video.src = project.posterVideoSrc;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");

        const videoTex = new THREE.VideoTexture(video);
        videoTex.minFilter = THREE.LinearFilter;
        videoTex.magFilter = THREE.LinearFilter;
        videoTex.generateMipmaps = false;
        videoTex.colorSpace = THREE.NoColorSpace;
        createdTextures.push(videoTex);

        const onReady = () => {
          if (disposed || reducedRef.current) return;
          if (video.readyState >= 2) {
            uniforms.uMap.value = videoTex;
            videoTex.needsUpdate = true;
            if (video.paused) {
              video.play().catch(() => {});
            }
          }
        };

        video.addEventListener("loadeddata", onReady);
        video.addEventListener("canplay", onReady);
        video.load();
        video.play().catch(() => {});

        createdVideos.push({ video, tex: videoTex, onReady });
      }
    });

    const fitCamera = (w: number, h: number) => {
      const aspect = Math.max(0.42, w / Math.max(1, h));
      const fov = aspect < 1 ? 42 : 34;
      const halfTanV = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
      const halfTanH = halfTanV * aspect;
      const zH = (posterH * 1.48) / (2 * halfTanV);
      const zW = (posterW * 1.28) / (2 * halfTanH);
      camera.fov = fov;
      camera.aspect = aspect;
      camera.position.set(0, 0.04, Math.max(zH, zW));
      camera.updateProjectionMatrix();
    };

    fitCamera(initW, initH);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1280;
      const h = container.clientHeight || 720;
      fitCamera(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => onResize())
        : null;
    resizeObserver?.observe(container);

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    let pointerX = 0;
    let pointerY = 0;
    let hoveredIdx: number | null = null;
    let isDragging = false;
    let activePointerId: number | null = null;
    let dragStartX = 0;
    let dragLastX = 0;
    let dragLastTime = 0;
    let dragMoved = 0;
    let dragVelocity = 0;
    let lastFocusReported = 0;

    const updateHover = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerX = THREE.MathUtils.clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerY = THREE.MathUtils.clamp(-((clientY - rect.top) / rect.height) * 2 + 1, -1, 1);
      pointerNdc.set(pointerX, pointerY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      const nextHover = hits.length > 0 ? Number(hits[0].object.userData.idx ?? -1) : null;
      const resolved = nextHover !== null && nextHover >= 0 ? nextHover : null;

      if (resolved !== null && hits[0]?.uv) {
        posterRigs[resolved]?.targetHit.set(
          hits[0].uv.x - 0.5,
          hits[0].uv.y - 0.5
        );
      }

      if (resolved !== hoveredIdx) {
        hoveredIdx = resolved;
        onHoverRef.current(resolved);
        renderer.domElement.style.cursor = resolved !== null ? "pointer" : "grab";
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      unlockVideos();
      const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetScrollRef.current += raw * 0.0056;
      lastInputTimeRef.current = performance.now();
    };

    const onPointerDown = (e: PointerEvent) => {
      unlockVideos();
      isDragging = true;
      activePointerId = e.pointerId;
      dragStartX = e.clientX;
      dragLastX = e.clientX;
      dragLastTime = performance.now();
      dragMoved = 0;
      dragVelocity = 0;
      if (e.pointerType === "touch") {
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      renderer.domElement.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch" && !isDragging) {
        updateHover(e.clientX, e.clientY);
      }
      if (!isDragging) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      const nowMs = performance.now();
      const dtMs = Math.max(4, nowMs - dragLastTime);
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragLastTime = nowMs;
      dragMoved += Math.abs(dx);

      const dragFactor = e.pointerType === "touch" ? 0.0145 : 0.009;
      targetScrollRef.current -= dx * dragFactor;
      const instV = (dx * dragFactor) / (dtMs * 0.001);
      dragVelocity = dragVelocity * 0.55 + instV * 0.45;
      lastInputTimeRef.current = nowMs;
    };

    const finishDrag = (e: PointerEvent, allowClick: boolean) => {
      if (!isDragging) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      if (e.pointerType === "touch") {
        try {
          renderer.domElement.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      renderer.domElement.style.cursor = hoveredIdx !== null ? "pointer" : "grab";

      if (dragMoved > 10) {
        const throwDist = THREE.MathUtils.clamp(
          -dragVelocity * 0.26,
          -stride * 1.6,
          stride * 1.6
        );
        targetScrollRef.current += throwDist;
        lastInputTimeRef.current = performance.now();
        return;
      }

      if (!allowClick) return;
      const totalMoved = Math.hypot(e.clientX - dragStartX, dragMoved);
      if (totalMoved > 12) return;

      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const hitIdx = Number(hits[0].object.userData.idx ?? -1);
        const rig = posterRigs[hitIdx];
        if (!rig) return;
        if (Math.abs(rig.group.position.x) > 1.75) {
          const delta = rig.group.position.x;
          targetScrollRef.current += delta;
          lastInputTimeRef.current = performance.now();
        } else {
          onSelectRef.current(rig.project);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => finishDrag(e, true);
    const onPointerCancel = (e: PointerEvent) => finishDrag(e, false);

    const onPointerLeave = () => {
      isDragging = false;
      if (hoveredIdx !== null) {
        hoveredIdx = null;
        onHoverRef.current(null);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("wheel", onWheel, { passive: false });
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    domEl.addEventListener("pointerleave", onPointerLeave);

    let rafId = 0;
    let prevNow = performance.now();
    let smoothVel = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;

      if (!isDragging && now - lastInputTimeRef.current > 460) {
        const nearest = Math.round(targetScrollRef.current / stride) * stride;
        targetScrollRef.current = THREE.MathUtils.lerp(
          targetScrollRef.current,
          nearest,
          Math.min(1, dt * 4.5)
        );
      }

      const prevScroll = currentScrollRef.current;
      const lerpAmt = reducedRef.current ? 1 : Math.min(1, dt * 9.5);
      currentScrollRef.current = THREE.MathUtils.lerp(
        prevScroll,
        targetScrollRef.current,
        lerpAmt
      );

      const instVel = THREE.MathUtils.clamp(
        ((currentScrollRef.current - prevScroll) / Math.max(0.008, dt)) * 0.085,
        -1.3,
        1.3
      );
      smoothVel = THREE.MathUtils.lerp(smoothVel, instVel, Math.min(1, dt * 12));

      const focusIdx = modPositive(
        Math.round(currentScrollRef.current / stride),
        totalCount
      );
      if (focusIdx !== lastFocusReported) {
        lastFocusReported = focusIdx;
        onFocusRef.current(focusIdx);
      }

      const tSec = now * 0.001;
      const mScale = reducedRef.current ? 0 : 1;

      for (let i = 0; i < posterRigs.length; i += 1) {
        const rig = posterRigs[i];
        const rawX = i * stride - currentScrollRef.current;
        const relX = modPositive(rawX + loopW * 0.5, loopW) - loopW * 0.5;

        const isHov = hoveredIdx === i;
        rig.hoverVal = THREE.MathUtils.lerp(
          rig.hoverVal,
          isHov ? 1 : 0,
          Math.min(1, dt * (isHov ? 10 : 4.2))
        );
        if (!isHov) {
          rig.targetHit.set(0, 0);
        }
        rig.uniforms.uHit.value.lerp(
          rig.targetHit,
          Math.min(1, dt * (isHov ? 11 : 3.2))
        );

        let brrtTarget = 0;
        if (rig.project.slug === "brrt-receipts" && isHov) {
          const px = rig.targetHit.x + 0.5;
          const py = rig.targetHit.y + 0.5;
          if (px >= 0.13 && px <= 0.89 && py >= 0.65 && py <= 0.97) {
            brrtTarget = 1;
          }
        }
        rig.brrtHoverVal = THREE.MathUtils.lerp(
          rig.brrtHoverVal,
          brrtTarget,
          Math.min(1, dt * (brrtTarget > rig.brrtHoverVal ? 7.5 : 2.6))
        );

        const distNorm = THREE.MathUtils.clamp(Math.abs(relX) / (stride * 1.45), 0, 1);
        const arcRotY = THREE.MathUtils.clamp(-relX * 0.028, -0.16, 0.16);

        // No hover zoom/pop — center relief comes from POSTER_VERT's smooth parabolic viewport bulge
        rig.group.position.x = relX;
        rig.group.position.y = Math.sin(tSec * 0.85 + i * 1.1) * 0.014 * mScale;
        rig.group.position.z = 0;
        rig.group.rotation.y = arcRotY;
        rig.group.rotation.x = 0;

        const focusW = THREE.MathUtils.clamp(1.0 - distNorm * 0.72, 0.3, 1.0);
        rig.uniforms.uVelocity.value = reducedRef.current ? 0 : smoothVel;
        rig.uniforms.uHover.value = rig.hoverVal;
        rig.uniforms.uBrrtHover.value = rig.brrtHoverVal;
        rig.uniforms.uTime.value = tSec + i * 1.3;
        rig.uniforms.uMotionScale.value = mScale;
        rig.uniforms.uBump.value = mScale;
        rig.uniforms.uPointer.value.set(pointerX, pointerY);
        rig.uniforms.uFocusWeight.value = focusW;

        const nearCenter = Math.abs(relX) < stride * 0.5;
        rig.shadowMesh.renderOrder = nearCenter ? 19 : 9;
        rig.mesh.renderOrder = nearCenter ? 20 : 10;
      }

      const swayScale = reducedRef.current ? 0 : 0.12;
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        pointerX * swayScale,
        Math.min(1, dt * 6)
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        0.04 + pointerY * (swayScale * 0.65),
        Math.min(1, dt * 6)
      );

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      clearTimeout(readyTimeout);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      domEl.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      posterGeo.dispose();
      shadowGeo.dispose();
      createdVideos.forEach(({ video, onReady }) => {
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("canplay", onReady);
        video.pause();
        video.removeAttribute("src");
        video.load();
      });
      createdMats.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [loopW, projects, stride, totalCount]);

  if (!webglReady) {
    return (
      <div className="jd-fallback-strip">
        {projects.map((p) => (
          <Link key={p.slug} href={`/poster-work/${p.slug}`} className="jd-fallback-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.posterSrc} alt={p.title} className="jd-fallback-img" />
            <span className="jd-fallback-title">
              {p.num} · {p.title}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return <div ref={hostRef} className="jd-webgl-host" />;
}
