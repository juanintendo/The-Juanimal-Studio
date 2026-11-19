"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KineticHeading } from "@/components/KineticHeading";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  clamp,
  expoOut,
  inOutQuart,
  lerp,
  prog,
  spring,
  twos,
  volumeSquash,
} from "@/lib/motion";

const HERO_DURATION = 20;
const TOTAL_FRAMES = 480; // 24fps reference X-sheet

export function HeroSignatureStage() {
  const { lang, t: copy } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const h = copy.hero;

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  const [t, setT] = useState<number>(reduced ? HERO_DURATION : 0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [activeChannel, setActiveChannel] = useState<number>(0);
  const userPausedRef = useRef<boolean>(false);
  const lastRef = useRef<number>(0);
  const tRef = useRef<number>(t);
  tRef.current = t;

  // Autoplay when visible unless reduced-motion is active
  useEffect(() => {
    if (reduced) {
      setPlaying(false);
      setT(HERO_DURATION);
      return;
    }
    setPlaying(true);

    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPlaying(false);
        } else if (!userPausedRef.current) {
          setPlaying((prev) => (prev ? prev : tRef.current < HERO_DURATION));
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Playback loop
  useEffect(() => {
    if (!playing || reduced) return;
    lastRef.current = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.06, Math.max(0, (now - lastRef.current) / 1000));
      lastRef.current = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= HERO_DURATION) {
          setPlaying(false);
          return HERO_DURATION;
        }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  // Pointer tracking for damped spring crosshairs on canvas
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      pointerRef.current.tx = clamp((e.clientX - r.left) / r.width, 0, 1);
      pointerRef.current.ty = clamp((e.clientY - r.top) / r.height, 0, 1);
      pointerRef.current.active = true;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  // Live Procedural X-Sheet + Arc Tracer Canvas synced to `t`
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = sectionRef.current;
    if (!canvas || !host) return;

    const drawCanvas = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = host.clientWidth || 1200;
      const ht = host.clientHeight || 720;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(ht * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(ht * dpr);
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, ht);

      const curT = tRef.current;
      const isLight = curT >= 3.8 && curT < 7.8;
      const railInk = isLight ? "rgba(9,9,12,0.22)" : "rgba(244,239,228,0.18)";
      const accentGold = isLight ? "#FF3B14" : "#FFD200";

      // 1. X-Sheet Sprocket Rails on left & right edges
      ctx.strokeStyle = railInk;
      ctx.fillStyle = railInk;
      ctx.lineWidth = 1;
      const scrollTicks = (curT * 36) % 24;
      for (let y = -scrollTicks; y < ht + 24; y += 24) {
        ctx.fillRect(10, y, 8, 5);
        ctx.fillRect(w - 18, y, 8, 5);
        const major = Math.round((y + scrollTicks) / 24) % 4 === 0;
        ctx.beginPath();
        ctx.moveTo(22, y + 2);
        ctx.lineTo(major ? 38 : 29, y + 2);
        ctx.moveTo(w - 22, y + 2);
        ctx.lineTo(w - (major ? 38 : 29), y + 2);
        ctx.stroke();
      }

      // 2. Scene 01 & Scene 04 Motion-Arc Tracers (Slow in/out dot spacing)
      if (curT < 3.8 || (curT >= 12.2 && curT < 15.6)) {
        const arcProgress =
          curT < 3.8
            ? prog(curT, 0.4, 3.0)
            : prog(curT, 12.4, 15.1);

        const p0x = w * 0.14;
        const p0y = ht * 0.68;
        const cx = w * 0.5;
        const cy = ht * 0.18;
        const p1x = w * 0.86;
        const p1y = ht * 0.68;

        ctx.strokeStyle = "rgba(255,210,0,0.32)";
        ctx.setLineDash([5, 6]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.quadraticCurveTo(cx, cy, p1x, p1y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Plot spacing dots bunched near start/end keys (inOutQuart timing)
        const steps = 18;
        for (let i = 0; i <= steps; i++) {
          const u = inOutQuart(i / steps);
          if (i / steps > arcProgress) break;
          const q = 1 - u;
          const dx = q * q * p0x + 2 * q * u * cx + u * u * p1x;
          const dy = q * q * p0y + 2 * q * u * cy + u * u * p1y;
          ctx.fillStyle = i % 3 === 0 ? "#FF3B14" : accentGold;
          ctx.beginPath();
          ctx.arc(dx, dy, i === steps ? 5 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Damped Spring Cursor Crosshair & Coordinate Telemetry
      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * 0.14;
      ptr.y += (ptr.ty - ptr.y) * 0.14;
      if (ptr.active && !reduced) {
        const px = ptr.x * w;
        const py = ptr.y * ht;
        ctx.strokeStyle = accentGold;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px - 14, py);
        ctx.lineTo(px + 14, py);
        ctx.moveTo(px, py - 14);
        ctx.lineTo(px, py + 14);
        ctx.stroke();

        ctx.font = "700 10px ui-monospace, monospace";
        ctx.fillStyle = accentGold;
        ctx.fillText(
          `X:${Math.round(px)} Y:${Math.round(py)} F:${Math.round(curT * 24)}`,
          px + 14,
          py - 10
        );
      }
    };

    drawCanvas();
    if (reduced) return;

    let raf = 0;
    const tick = () => {
      drawCanvas();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t, reduced]);

  // Active scene lookup
  let sceneId = "s1";
  let bg = "#09090C";
  if (t >= 3.8 && t < 7.8) {
    sceneId = "s2";
    bg = "#F4EFE4";
  } else if (t >= 7.8 && t < 12.2) {
    sceneId = "s3";
    bg = "#0047FF";
  } else if (t >= 12.2 && t < 15.6) {
    sceneId = "s4";
    bg = "#09090C";
  } else if (t >= 15.6) {
    sceneId = "s5";
    bg = "#09090C";
  }

  const t12 = twos(t);
  const frameNum = Math.min(TOTAL_FRAMES, Math.round(t * 24));

  const handleTogglePlay = () => {
    if (playing) {
      userPausedRef.current = true;
      setPlaying(false);
    } else {
      userPausedRef.current = false;
      if (t >= HERO_DURATION - 0.05) setT(0);
      setPlaying(true);
    }
  };

  const handleConsoleSwitch = () => {
    if (sceneId === "s5") {
      userPausedRef.current = false;
      setT(0);
      setPlaying(!reduced);
    } else {
      userPausedRef.current = true;
      setPlaying(false);
      setT(16.4);
    }
  };

  return (
    <header
      ref={sectionRef}
      id="top"
      className="xstage-hero"
      style={{ backgroundColor: bg }}
      data-scene={sceneId}
    >
      {/* Procedural X-Sheet & Arc Tracer Canvas */}
      <canvas ref={canvasRef} className="xstage-canvas" aria-hidden="true" />

      {/* Top X-Sheet Frame Telemetry Pill */}
      <div
        className={`xstage-telemetry lfp-tabular${sceneId === "s2" ? " is-light" : ""}`}
        aria-hidden="true"
      >
        <span>{sceneId.toUpperCase()}</span>
        <span>·</span>
        <span>F:{String(frameNum).padStart(3, "0")}/480</span>
        <span>·</span>
        <span>{t.toFixed(2).padStart(5, "0")}s</span>
        <span>·</span>
        <span>120 BPM</span>
      </div>

      {/* SCENE 01 (0.0 - 3.8s): SAUL BASS SLICE */}
      {sceneId === "s1" && <Scene01BassSlice t={t} lang={lang} />}

      {/* SCENE 02 (3.8 - 7.8s): KEYS BY HUMANS */}
      {sceneId === "s2" && <Scene02HumanKeys t={t} t12={t12} lang={lang} />}

      {/* SCENE 03 (7.8 - 12.2s): IN-BETWEENS BY AGENTS */}
      {sceneId === "s3" && <Scene03SpatialCode t={t} lang={lang} />}

      {/* SCENE 04 (12.2 - 15.6s): 12 PRINCIPLES WITH vs WITHOUT */}
      {sceneId === "s4" && <Scene04WithVsWithout t={t} lang={lang} />}

      {/* SCENE 05 (15.6 - 20.0s): THE DIRECTOR'S CONSOLE */}
      {sceneId === "s5" && (
        <Scene05DirectorsConsole
          t={t}
          h={h}
          lang={lang}
          reduced={reduced}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
      )}

      {/* Always-Visible X-Sheet Transport Bar */}
      <div className="xstage-hud">
        <div className="xstage-hud-btns">
          <button
            type="button"
            className="xstage-btn is-gold"
            onClick={handleTogglePlay}
          >
            {playing
              ? `❚❚ ${h.hud.pause}`
              : t >= HERO_DURATION - 0.05
                ? `↺ ${h.hud.replay}`
                : `▶ ${h.hud.play}`}
          </button>
          <button
            type="button"
            className="xstage-btn"
            onClick={handleConsoleSwitch}
          >
            {sceneId === "s5" ? h.hud.film : h.hud.console}
          </button>
        </div>

        <div className="xstage-scene-tabs" role="group" aria-label="Hero Scenes">
          {h.sceneTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`xstage-tab${sceneId === tab.id ? " is-active" : ""}`}
              onClick={() => {
                setT(tab.time);
                if (tab.id === "s5") {
                  userPausedRef.current = true;
                  setPlaying(false);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="xstage-scrub-wrap">
          <input
            type="range"
            min={0}
            max={HERO_DURATION}
            step={0.04}
            value={t}
            onChange={(e) => {
              userPausedRef.current = true;
              setPlaying(false);
              setT(parseFloat(e.target.value));
            }}
            aria-label="Scrub X-Sheet timeline"
            className="xstage-scrubber"
          />
        </div>
      </div>

      <div
        className="xstage-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${(t / HERO_DURATION).toFixed(4)})` }}
      />
    </header>
  );
}

/* =========================================================================
   SCENE 01 (0.0 - 3.8s): SAUL BASS SLICE — DEAD UI DOESN'T SELL
   ========================================================================= */
function Scene01BassSlice({ t, lang }: { t: number; lang: string }) {
  const bands = [
    { color: "#FF3B14", seed: 0.0, offset: -32 },
    { color: "#FFD200", seed: 0.08, offset: 28 },
    { color: "#F4EFE4", seed: 0.14, offset: -22 },
    { color: "#0047FF", seed: 0.2, offset: 34 },
    { color: "#09090C", seed: 0.26, offset: -18 },
  ];

  const ballU = inOutQuart(prog(t, 0.35, 2.75));
  const arc = 4 * ballU * (1 - ballU);
  const impactP = prog(t, 2.7, 3.15);
  const sy =
    impactP > 0 && impactP < 1
      ? 0.76 + spring(impactP, 140, 12) * 0.24
      : 1;
  const wipe = inOutQuart(prog(t, 3.2, 3.78));

  return (
    <div className="xstage-scene xstage-s1">
      <div className="xstage-bass-bands" aria-hidden="true">
        {bands.map((b, i) => {
          const p = inOutQuart(prog(t, b.seed, b.seed + 0.75));
          const x = lerp(b.offset * (i % 2 ? 1 : -1), 0, p);
          return (
            <div
              key={i}
              className="xstage-bass-band"
              style={{
                backgroundColor: b.color,
                transform: `translateX(${x.toFixed(1)}%)`,
              }}
            />
          );
        })}
      </div>

      <div className="xstage-s1-center">
        <span className="xstage-chip-dark">X-SHEET BENCHMARK · 01</span>
        <KineticHeading
          text={lang === "es" ? "UI MUERTA NO VENDE" : "DEAD UI DOESN'T SELL"}
          t={t}
          start={0.25}
          stagger={0.08}
          maxFontPx={86}
          minFontPx={30}
          shadowColor="#09090C"
          className="xstage-s1-title"
        />
        <div
          className="xstage-drop-ball"
          aria-hidden="true"
          style={{
            left: `${lerp(16, 84, ballU).toFixed(1)}%`,
            transform: `translate(-50%, ${(-arc * 120).toFixed(1)}px) ${volumeSquash(sy)}`,
          }}
        />
      </div>

      {t >= 3.2 && (
        <div
          className="xstage-hard-wipe"
          aria-hidden="true"
          style={{
            backgroundColor: "#F4EFE4",
            clipPath: `inset(0 ${((1 - wipe) * 100).toFixed(1)}% 0 0)`,
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   SCENE 02 (3.8 - 7.8s): KEYS BY HUMANS — ZERO DRIFT, FULL SILHOUETTE
   ========================================================================= */
function Scene02HumanKeys({
  t,
  t12,
  lang,
}: {
  t: number;
  t12: number;
  lang: string;
}) {
  const stamp = spring(t12 - 5.1, 150, 12);
  const cels = [
    { src: "/images/fba/01-pencil.webp", tag: "01 PENCIL KEY" },
    { src: "/images/fba/02c-1930s-ink.webp", tag: "02 1930s CEL" },
    { src: "/images/fba/07-3d.webp", tag: "03 FINAL 3D" },
    { src: "/images/v3/ag-keys-vs-agents-diptych.png", tag: "04 CODE LOCK" },
  ];

  return (
    <div className="xstage-scene xstage-s2">
      <span className="xstage-chip-vermilion">ACT I · HUMAN DIRECTION</span>
      <KineticHeading
        text={lang === "es" ? "KEYS HUMANOS" : "KEYS BY HUMANS"}
        t={t}
        start={3.85}
        stagger={0.08}
        maxFontPx={82}
        minFontPx={28}
        shadowColor="#FF3B14"
        className="xstage-s2-title"
      />

      <div className="xstage-cel-row">
        {cels.map((cel, idx) => {
          const active = Math.floor((t12 - 3.8) * 1.6) >= idx;
          return (
            <div
              key={cel.tag}
              className={`cel-frame xstage-cel-card${active ? " is-on" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cel.src} alt={cel.tag} />
              <span className="cel-tag">{cel.tag}</span>
            </div>
          );
        })}
      </div>

      {t12 >= 5.1 && (
        <div
          className="xstage-approved-stamp"
          style={{
            transformOrigin: "50% 100%",
            transform: volumeSquash(1 + (stamp - 1) * 0.25),
          }}
        >
          ✓ APPROVED KEY · 0.0px DRIFT
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   SCENE 03 (7.8 - 12.2s): IN-BETWEENS BY AGENTS — 3D SPATIAL CODE
   ========================================================================= */
function Scene03SpatialCode({ t, lang }: { t: number; lang: string }) {
  const local = t - 7.8;
  const explode = spring(local - 0.35, 110, 15);
  const p = inOutQuart(prog(local, 0.4, 2.8));
  const q = 1 - p;
  const cx = q * q * 15 + 2 * q * p * 52 + p * p * 78;
  const cy = q * q * 75 + 2 * q * p * 16 + p * p * 68;
  const clicked = local > 2.85;

  const planes = [
    { name: "16:9 MASTER UI", sub: "Remotion · 60fps", z: 0 },
    { name: "9:16 VERTICAL SHORT", sub: "HyperFrames · 24fps", z: 42 },
    { name: "1:1 RIVE / SPRITE", sub: "State Machine · .riv", z: 84 },
  ];

  return (
    <div className="xstage-scene xstage-s3">
      <span className="xstage-chip-gold">ACT II · AGENT PIPELINE</span>
      <KineticHeading
        text={lang === "es" ? "CÓDIGO EN 3D ESPACIAL" : "3D SPATIAL CODE"}
        t={t}
        start={7.85}
        stagger={0.07}
        maxFontPx={76}
        minFontPx={26}
        shadowColor="#09090C"
        className="xstage-s3-title"
      />

      <div className="xstage-3d-stage">
        <div
          className="xstage-3d-stack"
          style={{
            transform: `perspective(1200px) rotateX(${(explode * 14).toFixed(1)}deg) rotateY(${(-explode * 12).toFixed(1)}deg)`,
          }}
        >
          {planes.map((pl, i) => (
            <div
              key={pl.name}
              className="xstage-3d-plane"
              style={{
                transform: `translate3d(${(i - 1) * 150 * explode}px, ${(i - 1) * 12}px, ${(pl.z * explode).toFixed(1)}px)`,
              }}
            >
              <strong>{pl.name}</strong>
              <span>{pl.sub}</span>
              <small>{clicked ? "✓ RENDERED" : "QUEUED"}</small>
            </div>
          ))}
        </div>

        <button type="button" className={`xstage-render-btn${clicked ? " is-done" : ""}`}>
          {clicked ? "✓ ALL FORMATS RENDERED" : "[RENDER ALL FORMATS]"}
        </button>

        <div
          className="xstage-vector-cursor"
          style={{ left: `${cx.toFixed(1)}%`, top: `${cy.toFixed(1)}%` }}
          aria-hidden="true"
        >
          ▸
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 04 (12.2 - 15.6s): 12 PRINCIPLES AS CODE TESTS (WITH vs WITHOUT)
   ========================================================================= */
function Scene04WithVsWithout({ t, lang }: { t: number; lang: string }) {
  const local = t - 12.2;
  const cycle = prog(local, 0.3, 3.0);

  // Track A: Flat constant speed (no anticipation, no arc, no squash)
  const linearX = lerp(8, 88, cycle);

  // Track B: -8% anticipation recoil (0..0.15), eased arc (0.15..0.85), squash impact
  const ant = cycle < 0.16 ? -6 * Math.sin((cycle / 0.16) * Math.PI) : 0;
  const moveU = cycle < 0.16 ? 0 : clamp((cycle - 0.16) / 0.72, 0, 1);
  const easedX = lerp(8, 88, inOutQuart(moveU)) + ant;
  const arcY = -4 * moveU * (1 - moveU) * 52;
  const impact = moveU > 0.94 ? 0.78 : 1;

  return (
    <div className="xstage-scene xstage-s4">
      <span className="xstage-chip-vermilion">ACT III · PASS / FAIL QA</span>
      <KineticHeading
        text={lang === "es" ? "12 PRINCIPIOS COMO TESTS" : "12 PRINCIPLES AS CODE TESTS"}
        t={t}
        start={12.25}
        stagger={0.05}
        maxFontPx={68}
        minFontPx={26}
        shadowColor="#FF3B14"
        className="xstage-s4-title"
      />

      <div className="xstage-compare-grid">
        <div className="xstage-compare-lane is-bad">
          <div className="xstage-lane-head">
            <span>WITHOUT PRINCIPLE (Linear AI Tween)</span>
            <span className="xstage-badge-fail">✕ REJECTED</span>
          </div>
          <div className="xstage-lane-track">
            <div
              className="xstage-lane-puck"
              style={{ left: `${linearX.toFixed(1)}%` }}
            />
          </div>
        </div>

        <div className="xstage-compare-lane is-good">
          <div className="xstage-lane-head">
            <span>WITH 12 PRINCIPLES (Anticipation + Arc + Squash)</span>
            <span className="xstage-badge-pass">✓ PASSED</span>
          </div>
          <div className="xstage-lane-track">
            <div
              className="xstage-lane-puck is-gold"
              style={{
                left: `${easedX.toFixed(1)}%`,
                transform: `translate(-50%, ${arcY.toFixed(1)}px) ${volumeSquash(impact)}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 05 (15.6 - 20.0s): THE DIRECTOR'S CONSOLE (LANDED INTERACTIVE STAGE)
   ========================================================================= */
function Scene05DirectorsConsole({
  t,
  h,
  lang,
  reduced,
  activeChannel,
  setActiveChannel,
}: {
  t: number;
  h: (typeof import("@/lib/i18n").COPY)[import("@/lib/i18n").Locale]["hero"];
  lang: string;
  reduced: boolean;
  activeChannel: number;
  setActiveChannel: (idx: number) => void;
}) {
  const local = Math.max(0, t - 15.6);
  const monIn = expoOut(prog(local, 0.15, 0.95));
  const ch = h.channels[activeChannel] ?? h.channels[0];

  return (
    <div className="xstage-scene xstage-s5">
      <div className="xstage-console-grid">
        {/* Left Console: Brand, Auto-Fitted Headline, Workflow & CTAs */}
        <div className="xstage-console-left">
          <span className="xstage-chip-gold">{h.eyebrow}</span>
          <KineticHeading
            as="h1"
            text={h.h1}
            t={t >= 19.9 ? undefined : t}
            start={15.65}
            stagger={0.04}
            maxFontPx={56}
            minFontPx={25}
            shadowColor="#FF3B14"
            className="xstage-console-h1"
          />
          <p className="xstage-console-sub">{h.subhead}</p>

          <div className="xstage-wf-row">
            {h.workflowStrip.map((w) => (
              <span key={w} className="xstage-wf-pill">
                {w}
              </span>
            ))}
          </div>

          <div className="xstage-console-ctas">
            <a href="#launch-kit" className="cta-btn xstage-cta-primary">
              {h.ctaPrimary}
            </a>
            <a href="#work" className="xstage-cta-outline">
              {h.ctaSecondary}
            </a>
            <Link href="/contact" className="xstage-cta-outline is-gold">
              {h.ctaTertiary}
            </Link>
          </div>
        </div>

        {/* Right Console: 4-Channel Live Monitor Switcher */}
        <div
          className="xstage-monitor"
          style={{
            opacity: reduced ? 1 : monIn,
            transform: reduced
              ? "none"
              : `translateY(${lerp(20, 0, monIn).toFixed(1)}px)`,
          }}
        >
          <div className="xstage-monitor-tabs" role="tablist" aria-label="Studio Showreel Channels">
            {h.channels.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeChannel === idx}
                className={`xstage-ch-tab${activeChannel === idx ? " is-active" : ""}`}
                onClick={() => setActiveChannel(idx)}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className="xstage-monitor-screen">
            {activeChannel === 0 && (
              <div className="cel-frame xstage-ch-view">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/v3/ag-xsheet-stage-poster.png"
                  alt="Exploded 2.5D SaaS UI Launch Stage above 1930s animator X-sheet"
                />
              </div>
            )}

            {activeChannel === 1 && (
              <div className="cel-frame xstage-ch-vertical">
                <video
                  src="/media/saulbass/gta6-saulbass.mp4"
                  poster="/media/saulbass/gta6-poster.png"
                  autoPlay={!reduced}
                  muted
                  loop
                  playsInline
                  aria-label="GTA VI Saul Bass 9:16 vertical HyperFrames launch countdown"
                />
              </div>
            )}

            {activeChannel === 2 && (
              <div className="cel-frame xstage-ch-view">
                <video
                  src="/media/fof/clip-pump.mp4"
                  poster="/media/fof/snake-poster.webp"
                  autoPlay={!reduced}
                  muted
                  loop
                  playsInline
                  aria-label="fuelorfool.ing code motion lab clip"
                />
              </div>
            )}

            {activeChannel === 3 && (
              <div className="xstage-ch-diptych">
                <div className="cel-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/v3/ag-director-emblem.png"
                    alt="Juanimal Director Robo-Dragon circular registration emblem"
                  />
                </div>
                <div className="cel-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/v3/ag-keys-vs-agents-diptych.png"
                    alt="Hand-drawn keyframe vs vector sprite code grid diptych"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="xstage-monitor-foot">
            <div>
              <strong>{ch.title}</strong>
              <p>{ch.caption}</p>
            </div>
            {ch.href.startsWith("#") ? (
              <a href={ch.href} className="xstage-ch-link">
                {ch.cta}
              </a>
            ) : (
              <Link href={ch.href} className="xstage-ch-link">
                {ch.cta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
