"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { GalleryHeader } from "./GalleryHeader";
import { ZigZagPreloader } from "./ZigZagPreloader";

interface DragonWorld {
  id: "day" | "night" | "rain" | "rainbow";
  textureSrc: string;
  topLogoSrc?: string;
  bottomLogoSrc?: string;
  label: { en: string; es: string };
  badge: { en: string; es: string };
  headerTone: "paper" | "light";
  particleHex: string;
}

const DRAGON_WORLDS: DragonWorld[] = [
  {
    id: "day",
    textureSrc: "/images/gallery/about/dragon-day.png",
    topLogoSrc: "/images/gallery/about/title-juan-day.png",
    bottomLogoSrc: "/images/gallery/about/title-role-day.png",
    label: { en: "☀ SHINE", es: "☀ DÍA" },
    badge: { en: "STUDIO MODE", es: "MODO ESTUDIO" },
    headerTone: "paper",
    particleHex: "#FFF4B8",
  },
  {
    id: "night",
    textureSrc: "/images/gallery/about/dragon-night.png",
    topLogoSrc: "/images/gallery/about/title-juan-night.png",
    bottomLogoSrc: "/images/gallery/about/title-role-night.png",
    label: { en: "🌙 MECHA", es: "🌙 MECHA" },
    badge: { en: "CYBER RIG", es: "MODO MECHA" },
    headerTone: "light",
    particleHex: "#FFE670",
  },
  {
    id: "rain",
    textureSrc: "/images/gallery/about/dragon-rain.png",
    label: { en: "🌧 SYNTHIA-2", es: "🌧 SYNTHIA-2" },
    badge: { en: "SYNTHIA-2 · THE AGENT", es: "SYNTHIA-2 · LA AGENTE" },
    headerTone: "light",
    particleHex: "#DDF0FF",
  },
  {
    id: "rainbow",
    textureSrc: "/images/gallery/about/dragon-rainbow.png",
    label: { en: "🌈 AGENT", es: "🌈 AGENTE" },
    badge: { en: "SYNTHIA.2 · THE AGENT", es: "SYNTHIA.2 · LA AGENTE" },
    headerTone: "paper",
    particleHex: "#FFFDF2",
  },
];

const ABOUT_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ABOUT_FRAG = `
  varying vec2 vUv;
  uniform sampler2D uCurrentTex;
  uniform sampler2D uNextTex;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uHoverUv;
  uniform float uHoverActive;
  uniform vec2 uClickOrigin;
  uniform float uTransition;
  uniform float uTime;
  uniform float uMotionScale;

  vec2 computeSceneUv(vec2 screenUv, float parallaxStrength) {
    float viewAspect = uResolution.x / max(1.0, uResolution.y);
    float imgAspect = 1.77778; // 1600 x 900

    vec2 centered = screenUv - 0.5;
    if (viewAspect < imgAspect) {
      float scaleX = max(0.48, viewAspect / imgAspect);
      centered.x *= scaleX;
    } else {
      centered.y *= imgAspect / viewAspect;
    }

    // Subtle 4% breathing zoom so parallax shift stays cleanly inside texture bounds
    centered *= 0.96;
    vec2 pan = vec2(-uPointer.x * 0.016, uPointer.y * 0.012) * parallaxStrength * uMotionScale;
    return clamp(centered + 0.5 + pan, vec2(0.002), vec2(0.998));
  }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    // Pixel-locked shared UVs so both worlds share 100% identical camera framing across the portal edge
    vec2 sceneUv = computeSceneUv(vUv, 1.0);

    vec3 colA = texture2D(uCurrentTex, sceneUv).rgb;
    vec3 colB = texture2D(uNextTex, sceneUv).rgb;

    float aspect = uResolution.x / max(1.0, uResolution.y);
    vec2 aspectScale = vec2(aspect, 1.0);

    // Circular hover portal peeking directly into NEXT Dragon world (clean Justine Soulie lens edge)
    vec2 hVec = (vUv - uHoverUv) * aspectScale;
    float hAngle = atan(hVec.y, hVec.x);
    float hWobble = sin(hAngle * 5.0 + uTime * 3.0) * 0.0018 * uMotionScale;
    float hDist = length(hVec) + hWobble;
    float minDimFactor = aspect < 1.0 ? 0.145 : 0.165;
    float hRad = minDimFactor * uHoverActive * (1.0 - smoothstep(0.0, 0.2, uTransition));
    float hoverMask = 1.0 - smoothstep(hRad - 0.003, hRad + 0.003, hDist);

    // Click explosive portal wipe expanding across full screen
    vec2 cVec = (vUv - uClickOrigin) * aspectScale;
    float cAngle = atan(cVec.y, cVec.x);
    float cWobble = sin(cAngle * 7.0 - uTime * 5.0) * 0.015 * step(0.005, uTransition) * uMotionScale;
    float cDist = length(cVec) + cWobble;
    float maxRadius = length(aspectScale) * 1.15;
    float cRad = uTransition * maxRadius;
    float clickMask = step(0.004, uTransition) * (1.0 - smoothstep(cRad - 0.035, cRad + 0.012, cDist));
    float clickRim = step(0.004, uTransition) * (smoothstep(cRad - 0.055, cRad - 0.022, cDist) - smoothstep(cRad - 0.008, cRad + 0.015, cDist));

    float portalMix = clamp(max(hoverMask, clickMask), 0.0, 1.0);
    vec3 finalRgb = mix(colA, colB, portalMix);

    // Subtle crisp rim only during click wipe transition
    finalRgb = mix(finalRgb, vec3(0.99, 0.98, 0.94), clamp(clickRim * 0.42, 0.0, 0.42));

    // Gentle living pastel film grain matching Justine Soulie About finish
    float grain = (hash12(floor(vUv * uResolution * 0.5) + fract(uTime * 12.0) * 100.0) - 0.5) * 0.042 * uMotionScale;
    finalRgb = clamp(finalRgb + grain, 0.0, 1.0);

    gl_FragColor = vec4(finalRgb, 1.0);
  }
`;

export function DragonAboutStage() {
  const { lang, t } = useLanguage();
  const reduced = usePrefersReducedMotion();

  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [worldIdx, setWorldIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const worldIdxRef = useRef(0);
  const triggerMorphRef = useRef<((targetIdx: number, uvX?: number, uvY?: number) => void) | null>(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const ui = {
    en: {
      contactBtn: "CONTACT ME",
      leftBadgeTop: "VENEZUELA → WORLD",
      leftBadgeSub: "SINCE 2016",
      rightBadgeTop: "DIRECTION & CODE",
      rightBadgeSub: "TECH WIZARD",
      morphHint: "Move cursor to peek portal · Click anywhere to morph world",
      closeDrawer: "Close",
      contactCta: "Book a Launch Call →",
      labLink: "Visit fuelorfool.ing ↗",
    },
    es: {
      contactBtn: "CONTÁCTAME",
      leftBadgeTop: "VENEZUELA → MUNDO",
      leftBadgeSub: "DESDE 2016",
      rightBadgeTop: "DIRECCIÓN & CÓDIGO",
      rightBadgeSub: "TECH WIZARD",
      morphHint: "Pasa el cursor para espiar otro mundo · Haz clic para cambiar de mundo",
      closeDrawer: "Cerrar",
      contactCta: "Agendar Llamada →",
      labLink: "Visitar fuelorfool.ing ↗",
    },
  }[lang];

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglReady(false);
      setReady(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const initW = container.clientWidth || 1280;
    const initH = container.clientHeight || 720;
    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH);
    renderer.domElement.className = "jd-about-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 2;

    const fallbackTex = new THREE.DataTexture(
      new Uint8Array([224, 240, 232, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackTex.needsUpdate = true;

    const textures: THREE.Texture[] = DRAGON_WORLDS.map(() => fallbackTex);
    const createdTextures: THREE.Texture[] = [fallbackTex];
    DRAGON_WORLDS.forEach((w) => {
      [w.topLogoSrc, w.bottomLogoSrc].forEach((src) => {
        if (src) {
          const pre = new window.Image();
          pre.src = src;
        }
      });
    });
    const loader = new THREE.TextureLoader();
    let disposed = false;
    let readySent = false;

    const uniforms = {
      uCurrentTex: { value: textures[0] },
      uNextTex: { value: textures[1] },
      uResolution: { value: new THREE.Vector2(initW, initH) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uHoverUv: { value: new THREE.Vector2(0.5, 0.5) },
      uHoverActive: { value: 0 },
      uClickOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uTransition: { value: 0 },
      uTime: { value: 0 },
      uMotionScale: { value: 1 },
    };

    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const quadMat = new THREE.ShaderMaterial({
      vertexShader: ABOUT_VERT,
      fragmentShader: ABOUT_FRAG,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    const quadMesh = new THREE.Mesh(quadGeo, quadMat);
    scene.add(quadMesh);

    // Subtle glowing atmospheric particle sprite (soft circular bokeh instead of raw squares)
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 1, 32, 32, 31);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.75)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.18)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(spriteCanvas);

    const pCount = 56;
    const pPositions = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount * 2);
    for (let i = 0; i < pCount; i += 1) {
      pPositions[i * 3] = (Math.random() - 0.5) * 2.0;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      pPositions[i * 3 + 2] = 0.5;
      pSpeeds[i * 2] = 0.25 + Math.random() * 0.75;
      pSpeeds[i * 2 + 1] = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(DRAGON_WORLDS[0].particleHex),
      map: particleTex,
      size: 10,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    points.renderOrder = 5;
    scene.add(points);

    const readyTimer = setTimeout(() => {
      if (!readySent) {
        readySent = true;
        setReady(true);
      }
    }, 1200);

    DRAGON_WORLDS.forEach((world, idx) => {
      loader.load(
        world.textureSrc,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;
          createdTextures.push(tex);
          textures[idx] = tex;

          if (idx === worldIdxRef.current) {
            uniforms.uCurrentTex.value = tex;
            if (!readySent) {
              readySent = true;
              setReady(true);
            }
          }
          if (idx === (worldIdxRef.current + 1) % DRAGON_WORLDS.length) {
            uniforms.uNextTex.value = tex;
          }
        },
        undefined,
        () => {
          if (idx === 0 && !readySent) {
            readySent = true;
            setReady(true);
          }
        }
      );
    });

    let targetWorldIdx = 1;
    let isMorphing = false;
    let morphProgress = 0;

    triggerMorphRef.current = (nextTarget: number, uvX = 0.5, uvY = 0.5) => {
      const normalized = ((nextTarget % DRAGON_WORLDS.length) + DRAGON_WORLDS.length) % DRAGON_WORLDS.length;
      if ((isMorphing && normalized === targetWorldIdx) || (!isMorphing && normalized === worldIdxRef.current)) {
        return;
      }
      if (isMorphing) {
        worldIdxRef.current = targetWorldIdx;
        uniforms.uCurrentTex.value = textures[targetWorldIdx];
      }
      targetWorldIdx = normalized;
      setWorldIdx(targetWorldIdx);
      uniforms.uNextTex.value = textures[targetWorldIdx];
      uniforms.uClickOrigin.value.set(uvX, uvY);

      if (reducedRef.current) {
        worldIdxRef.current = targetWorldIdx;
        uniforms.uCurrentTex.value = textures[targetWorldIdx];
        uniforms.uNextTex.value = textures[(targetWorldIdx + 1) % DRAGON_WORLDS.length];
        uniforms.uTransition.value = 0;
        pMat.color.set(DRAGON_WORLDS[targetWorldIdx].particleHex);
        return;
      }

      isMorphing = true;
      morphProgress = 0;
    };

    let hoverTarget = 0;
    let hoverSmooth = 0;
    const hoverUvTarget = new THREE.Vector2(0.5, 0.5);
    let pointerX = 0;
    let pointerY = 0;
    let downX = 0;
    let downY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const u = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const v = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
      hoverUvTarget.set(u, v);
      hoverTarget = 1;
      pointerX = u * 2 - 1;
      pointerY = v * 2 - 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 14) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const u = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const v = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
      const next = (worldIdxRef.current + 1) % DRAGON_WORLDS.length;
      triggerMorphRef.current?.(next, u, v);
    };

    const onPointerLeave = () => {
      hoverTarget = 0;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointermove", onPointerMove, { passive: true });
    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1280;
      const h = container.clientHeight || 720;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(container);

    let rafId = 0;
    let prevNow = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      const tSec = now * 0.001;
      const mScale = reducedRef.current ? 0 : 1;

      uniforms.uTime.value = tSec;
      uniforms.uMotionScale.value = mScale;
      uniforms.uPointer.value.lerp(
        new THREE.Vector2(pointerX, pointerY),
        Math.min(1, dt * 7)
      );

      hoverSmooth = THREE.MathUtils.lerp(hoverSmooth, hoverTarget, Math.min(1, dt * 9));
      uniforms.uHoverActive.value = reducedRef.current ? 0 : hoverSmooth;
      uniforms.uHoverUv.value.lerp(hoverUvTarget, Math.min(1, dt * 14));

      if (isMorphing) {
        morphProgress = Math.min(1, morphProgress + dt * 1.55);
        const eased = 1 - Math.pow(1 - morphProgress, 3);
        uniforms.uTransition.value = eased;

        if (morphProgress >= 1) {
          isMorphing = false;
          worldIdxRef.current = targetWorldIdx;
          setWorldIdx(targetWorldIdx);
          const nextAfter = (targetWorldIdx + 1) % DRAGON_WORLDS.length;
          uniforms.uCurrentTex.value = textures[targetWorldIdx];
          uniforms.uNextTex.value = textures[nextAfter];
          uniforms.uTransition.value = 0;
          pMat.color.set(DRAGON_WORLDS[targetWorldIdx].particleHex);
          const nextId = DRAGON_WORLDS[targetWorldIdx].id;
          pMat.size = nextId === "night" ? 14 : nextId === "rain" ? 8.5 : nextId === "rainbow" ? 12.5 : 10;
          pMat.opacity = nextId === "night" ? 0.78 : nextId === "rainbow" ? 0.72 : 0.48;
        }
      }

      // Animate world-specific particles (rain streaks fall down, fireflies & rainbow sparks float)
      const activeMode = DRAGON_WORLDS[worldIdxRef.current].id;
      const posAttr = pGeo.getAttribute("position") as THREE.BufferAttribute;
      if (mScale > 0) {
        for (let i = 0; i < pCount; i += 1) {
          let px = posAttr.getX(i);
          let py = posAttr.getY(i);
          const spd = pSpeeds[i * 2];
          const phase = pSpeeds[i * 2 + 1];

          if (activeMode === "rain") {
            py -= dt * (0.85 * spd);
            px -= dt * (0.24 * spd);
            if (py < -1.05) {
              py = 1.05;
              px = (Math.random() - 0.5) * 2.1;
            }
          } else if (activeMode === "night") {
            py += Math.sin(tSec * 1.4 + phase) * dt * 0.08;
            px += Math.cos(tSec * 1.1 + phase) * dt * 0.09;
          } else {
            py += dt * (0.09 * spd);
            px += Math.sin(tSec * 0.9 + phase) * dt * 0.04;
            if (py > 1.05) {
              py = -1.05;
              px = (Math.random() - 0.5) * 2.0;
            }
          }
          posAttr.setXY(i, px, py);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      clearTimeout(readyTimer);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      domEl.removeEventListener("pointermove", onPointerMove);
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      quadGeo.dispose();
      quadMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      particleTex.dispose();
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  const currentWorld = DRAGON_WORLDS[worldIdx] ?? DRAGON_WORLDS[0];

  const handleSelectWorld = useCallback((idx: number) => {
    triggerMorphRef.current?.(idx, 0.5, 0.5);
  }, []);

  return (
    <div
      className={`jd-gallery-root jd-about-page is-world-${currentWorld.id}`}
    >
      <ZigZagPreloader ready={ready} />

      <GalleryHeader
        active="about"
        tone={currentWorld.headerTone}
      />

      <main className="jd-about-stage">
        {webglReady ? (
          <div ref={hostRef} className="jd-about-canvas-host" />
        ) : (
          <div className="jd-about-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentWorld.textureSrc}
              alt={`Juanimal Dragon — ${currentWorld.badge[lang]}`}
              className="jd-about-fallback-img"
            />
          </div>
        )}

        {/* Top center Contact trigger + hand-lettered logo aligned inside sky clearing (Day & Night only) */}
        <div className="jd-about-top-hero">
          {currentWorld.topLogoSrc ? (
            <>
              <button
                type="button"
                className="jd-about-contact-pill"
                onClick={() => setDrawerOpen(true)}
              >
                {ui.contactBtn}
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={currentWorld.topLogoSrc}
                src={currentWorld.topLogoSrc}
                alt="Juan Colombo"
                className="jd-about-logo-top"
              />
            </>
          ) : null}
        </div>

        {/* Left & Right floating identity badges matching justinesoulie.fr/about */}
        <div
          className={`jd-about-side-badge is-left ${
            currentWorld.headerTone === "light" ? "is-light" : ""
          }`}
        >
          <strong>{ui.leftBadgeTop}</strong>
          <span>{ui.leftBadgeSub}</span>
        </div>

        <div
          className={`jd-about-side-badge is-right ${
            currentWorld.headerTone === "light" ? "is-light" : ""
          }`}
        >
          <strong>{ui.rightBadgeTop}</strong>
          <span>{ui.rightBadgeSub}</span>
        </div>

        {/* Lower bush mound sculpted title + Contact My Agent pill + world morph dock */}
        <div className="jd-about-bottom-hero">
          {currentWorld.bottomLogoSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={currentWorld.bottomLogoSrc}
              src={currentWorld.bottomLogoSrc}
              alt="Art Director"
              className="jd-about-logo-bottom"
            />
          ) : null}

          <a
            href="mailto:synthia-2@ilands.app"
            className="jd-about-agent-pill"
            title="synthia-2@ilands.app"
          >
            CONTACT MY AGENT
          </a>

          <div className="jd-about-controls">
            <div className="jd-world-switcher" role="group" aria-label="About worlds">
              {DRAGON_WORLDS.map((w, idx) => (
                <button
                  key={w.id}
                  type="button"
                  className={`jd-world-btn ${worldIdx === idx ? "is-active" : ""}`}
                  onClick={() => handleSelectWorld(idx)}
                  aria-pressed={worldIdx === idx}
                >
                  {w.label[lang]}
                </button>
              ))}
            </div>
            <p className="jd-about-hint">{ui.morphHint}</p>
          </div>
        </div>

        {/* Minimal archival bottom credits row */}
        <div
          className={`jd-about-credits ${
            currentWorld.headerTone === "light" ? "is-light" : ""
          }`}
        >
          <span>The Juanimal Studio · Juan Colombo</span>
          <div className="jd-about-links">
            <a href="https://fuelorfool.ing" target="_blank" rel="noreferrer">
              fuelorfool.ing
            </a>
            <Link href="/merch">Merch</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </main>

      {/* Archival Story & Direct Contact Drawer */}
      {drawerOpen ? (
        <div
          className="jd-dossier-backdrop"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.about.eyebrow}
        >
          <div
            className="jd-dossier-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="jd-dossier-head">
              <span className="jd-dossier-eyebrow">{t.about.eyebrow}</span>
              <button
                type="button"
                className="jd-dossier-close"
                onClick={() => setDrawerOpen(false)}
              >
                ✕ {ui.closeDrawer}
              </button>
            </div>

            <h2 className="jd-dossier-title">
              {t.about.storyTitle1} <span>{t.about.storyTitleAccent}</span>
            </h2>
            <p className="jd-dossier-lede">{t.about.lede}</p>
            <p className="jd-dossier-p">{t.about.p1}</p>
            <p className="jd-dossier-p">{t.about.p2}</p>

            <div className="jd-dossier-pillars">
              {t.about.approachCards.map((c) => (
                <div key={c.num} className="jd-dossier-pillar">
                  <span className="jd-pillar-num">{c.num}</span>
                  <strong>{c.title}</strong>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>

            <div className="jd-dossier-actions">
              <Link href="/contact" className="jd-open-case-btn">
                {ui.contactCta}
              </Link>
              <a
                href="https://fuelorfool.ing"
                target="_blank"
                rel="noreferrer"
                className="jd-launch-toy-btn"
              >
                {ui.labLink}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
