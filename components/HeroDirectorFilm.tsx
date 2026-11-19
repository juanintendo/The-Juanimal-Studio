"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const HERO_DURATION = 18;

const ACT_JUMPS = [
  { key: "act1", time: 0.05 },
  { key: "act2", time: 3.35 },
  { key: "act3", time: 6.95 },
  { key: "act4", time: 13.45 },
] as const;

function registerShadow(
  t: number,
  start: number,
  color: string,
  sizePx = 72
): string {
  const dt = Math.max(0, t - start);
  const e = sizePx * (0.025 + 0.08 * Math.exp(-dt * 5));
  return `${e.toFixed(1)}px ${(e * 0.7).toFixed(1)}px 0 ${color}`;
}

function InflateWord({
  text,
  t,
  start,
  stagger = 0.05,
  k = 130,
  c = 13,
  shadowColor,
  className = "",
}: {
  text: string;
  t: number;
  start: number;
  stagger?: number;
  k?: number;
  c?: number;
  shadowColor?: string;
  className?: string;
}) {
  const letters = text.split("");
  return (
    <span
      className={`hdf-inflate-word ${className}`}
      style={
        shadowColor
          ? { textShadow: registerShadow(t, start + 0.15, shadowColor, 68) }
          : undefined
      }
    >
      {letters.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} className="hdf-space">
              &nbsp;
            </span>
          );
        }
        const s = spring(Math.max(0, t - start - i * stagger), k, c);
        const axis = clamp(s, 0, 1);
        const wdth = lerp(62, 125, axis);
        const wght = lerp(140, 900, axis);
        const over = s - axis;
        const sy = clamp(1 - over * 0.25, 0.85, 1.15);
        return (
          <span
            key={i}
            className="hdf-letter"
            style={{
              fontVariationSettings: `"wdth" ${wdth.toFixed(1)}, "wght" ${wght.toFixed(0)}`,
              transformOrigin: "50% 100%",
              transform: volumeSquash(sy),
              opacity: t >= start + i * stagger * 0.6 ? 1 : 0,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

function HalftoneRingCanvas({
  color,
  scale,
}: {
  color: string;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const size = 360;
    c.width = size;
    c.height = size;
    const g = c.getContext("2d");
    if (!g) return;
    g.clearRect(0, 0, size, size);
    const step = size / 40;
    const mid = 0.72;
    const half = 0.24;
    g.fillStyle = color;
    for (let y = 0; y < 40; y++) {
      for (let x = 0; x < 40; x++) {
        const px = (x + (y % 2 ? 0.5 : 0)) * step - size / 2;
        const py = y * step - size / 2;
        const k = 1 - Math.abs(Math.hypot(px, py) / (size / 2) - mid) / half;
        if (k <= 0) continue;
        g.beginPath();
        g.arc(
          px + size / 2,
          py + size / 2,
          step * 0.48 * Math.sqrt(k),
          0,
          Math.PI * 2
        );
        g.fill();
      }
    }
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="hdf-halftone-ring"
      aria-hidden="true"
      style={{
        transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})`,
      }}
    />
  );
}

export function HeroDirectorFilm() {
  const { lang, t: copy } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const h = copy.hero;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [t, setT] = useState<number>(reduced ? HERO_DURATION : 0);
  const [playing, setPlaying] = useState<boolean>(false);
  const userPausedRef = useRef<boolean>(false);
  const lastRef = useRef<number>(0);

  // Respect prefers-reduced-motion; otherwise autoplay on mount and pause offscreen
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
          setT((prev) => (prev < HERO_DURATION ? prev : prev));
          setPlaying((prev) => (prev ? prev : true));
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

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

  const handleToggle = () => {
    if (playing) {
      userPausedRef.current = true;
      setPlaying(false);
    } else {
      userPausedRef.current = false;
      if (t >= HERO_DURATION - 0.05) setT(0);
      setPlaying(true);
    }
  };

  const handleSkip = () => {
    userPausedRef.current = true;
    setPlaying(false);
    setT(14.5);
  };

  const jumpTo = (target: number) => {
    setT(target);
    if (!reduced && !userPausedRef.current && target < HERO_DURATION) {
      setPlaying(true);
    }
  };

  // Stepped 12fps clock for drawings, grain & QA overlays
  const t12 = twos(t);
  const frameIdx = Math.floor(t12 * 12);

  // Active Act calculation
  let activeAct = "act1";
  let bgHex = "#0C0B10";
  let odometerColor = "#F6F1E3";
  if (t >= 3.2 && t < 6.8) {
    activeAct = "act2";
    bgHex = "#F6F1E3";
    odometerColor = "#0C0B10";
  } else if (t >= 6.8 && t < 13.2) {
    activeAct = "act3";
    if (t < 8.4) {
      bgHex = "#0150BE";
      odometerColor = "#FFD200";
    } else if (t < 10.0) {
      bgHex = "#E04E1F";
      odometerColor = "#F6F1E3";
    } else if (t < 11.6) {
      bgHex = "#3B188C";
      odometerColor = "#14E8A8";
    } else {
      bgHex = "#0C0B10";
      odometerColor = "#FFD200";
    }
  } else if (t >= 13.2) {
    activeAct = "act4";
    bgHex = "#0C0B10";
    odometerColor = "#FFD200";
  }

  // Persistent Odometer ride from center (t=0..1.2) to top-right HUD (t=1.2..2.3)
  const parkP = inOutQuart(prog(t, 1.15, 2.25));
  const odoScale = lerp(1.45, 0.88, parkP);
  const grainOffsetX = (frameIdx * 73) % 200;
  const grainOffsetY = (frameIdx * 131) % 200;

  return (
    <header
      ref={sectionRef}
      id="top"
      className="hdf-hero"
      style={{ backgroundColor: bgHex }}
      data-act={activeAct}
    >
      {/* Film grain boiling on twos (12fps) */}
      <div
        className="hdf-grain"
        aria-hidden="true"
        style={{
          backgroundPosition: `${grainOffsetX}px ${grainOffsetY}px`,
        }}
      />

      {/* Persistent Odometer Frame & Time Counter */}
      <div
        className={`hdf-odometer lfp-tabular${parkP < 0.5 ? " is-centered" : ""}`}
        style={{
          color: odometerColor,
          transform: `scale(${odoScale.toFixed(3)})`,
        }}
        aria-hidden="true"
      >
        <span>{t.toFixed(2).padStart(5, "0")}s</span>
        <span className="hdf-odo-sep">·</span>
        <span>FRAME {String(frameIdx).padStart(3, "0")}</span>
        <span className="hdf-odo-sep">·</span>
        <span>120 BPM</span>
      </div>

      {/* ACT 1 (0.0 - 3.2s): AI SLOP vs. DIRECTION */}
      {t < 3.2 && <Act1Problem t={t} t12={t12} lang={lang} />}

      {/* ACT 2 (3.2 - 6.8s): HUMAN KEYS */}
      {t >= 3.2 && t < 6.8 && <Act2HumanKeys t={t} t12={t12} />}

      {/* ACT 3 (6.8 - 13.2s): AGENT SCALE (4 rapid showcases @ 1.6s) */}
      {t >= 6.8 && t < 13.2 && <Act3AgentScale t={t} t12={t12} />}

      {/* ACT 4 (13.2 - 18.0s): LANDED STUDIO HERO */}
      {t >= 13.2 && (
        <Act4LandedHero t={t} h={h} reduced={reduced} lang={lang} />
      )}

      {/* Always-visible Bottom HUD */}
      <div className="hdf-hud">
        <div className="hdf-hud-left">
          <button
            type="button"
            className="hdf-hud-btn is-primary"
            onClick={handleToggle}
          >
            {playing
              ? `❚❚ ${h.hud.pause}`
              : t >= HERO_DURATION - 0.05
                ? `↺ ${h.hud.replay}`
                : `▶ ${h.hud.play}`}
          </button>
          {t < 14.2 && (
            <button
              type="button"
              className="hdf-hud-btn"
              onClick={handleSkip}
            >
              {h.hud.skip}
            </button>
          )}
        </div>

        <div className="hdf-act-pills">
          {ACT_JUMPS.map((aj) => {
            const isAct = activeAct === aj.key;
            return (
              <button
                key={aj.key}
                type="button"
                className={`hdf-act-pill${isAct ? " is-active" : ""}`}
                onClick={() => jumpTo(aj.time)}
              >
                {h.acts[aj.key]}
              </button>
            );
          })}
        </div>

        <div className="hdf-scrub-wrap">
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
            aria-label="Scrub hero opening film"
            className="hdf-scrubber"
          />
        </div>
      </div>

      {/* Progress hairline */}
      <div
        className="hdf-scrub-bar"
        aria-hidden="true"
        style={{ transform: `scaleX(${(t / HERO_DURATION).toFixed(4)})` }}
      />
    </header>
  );
}

/* =========================================================================
   ACT 1 (0.0 - 3.2s): THE PROBLEM — AI SLOP vs. DIRECTION
   ========================================================================= */
function Act1Problem({
  t,
  t12,
  lang,
}: {
  t: number;
  t12: number;
  lang: string;
}) {
  const promptText =
    '> prompt: "SaaS launch video + character animation"';
  const chars = Math.floor(prog(t, 0.05, 1.0) * promptText.length);
  const split = spring(t - 0.85, 130, 13);
  const qaPop = spring(t12 - 1.35, 140, 12);
  const tearP = inOutQuart(prog(t, 2.4, 3.15));

  return (
    <div className="hdf-stage hdf-act1">
      <div className="hdf-term-line">
        <span className="lfp-dot" />
        <code>{promptText.slice(0, Math.max(8, chars))}</code>
      </div>

      <div className="hdf-act1-cards">
        <div
          className="hdf-drift-card"
          style={{
            transform: `translateX(${lerp(0, -18, clamp(split, 0, 1.1)).toFixed(1)}px)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-abc-compare.jpg"
            alt="Unguided character prompt drift"
          />
          {t12 >= 1.35 && (
            <span
              className="hdf-qa-tag"
              style={{
                transformOrigin: "50% 100%",
                transform: volumeSquash(1 + (qaPop - 1) * 0.35),
              }}
            >
              ✕ DRIFT · TWO COUSINS
            </span>
          )}
        </div>

        <div
          className="hdf-drift-card"
          style={{
            transform: `translateX(${lerp(0, 18, clamp(split, 0, 1.1)).toFixed(1)}px)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-drift-detail.jpg"
            alt="Melted hands and silhouette drift"
          />
          {t12 >= 1.55 && (
            <span
              className="hdf-qa-tag"
              style={{
                transformOrigin: "50% 100%",
                transform: volumeSquash(
                  1 + (spring(t12 - 1.55, 140, 12) - 1) * 0.35
                ),
              }}
            >
              ✕ GENERIC AI SLOP
            </span>
          )}
        </div>
      </div>

      <p className="hdf-act-kicker">
        {lang === "es"
          ? "EL PROBLEMA: PROMPTS SUELTOS ≠ PRODUCCIÓN"
          : "THE PROBLEM: LOOSE PROMPTS ≠ PRODUCTION"}
      </p>

      {/* Torn paper director cut wipe (2.4 - 3.2s) */}
      {t >= 2.38 && (
        <svg
          className="hdf-tear-wipe"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            transform: `translateY(${((1 - tearP) * 102).toFixed(2)}%)`,
          }}
        >
          <path
            d="M0 1000 L0 35 L80 18 L180 42 L290 14 L420 40 L540 16 L670 38 L810 15 L920 36 L1000 20 L1000 1000 Z"
            fill="#E04E1F"
          />
          <path
            d="M0 1000 L0 65 L90 48 L190 72 L300 44 L430 68 L550 45 L680 66 L820 44 L930 64 L1000 48 L1000 1000 Z"
            fill="#F6F1E3"
          />
        </svg>
      )}
    </div>
  );
}

/* =========================================================================
   ACT 2 (3.2 - 6.8s): HUMAN KEYS
   ========================================================================= */
function Act2HumanKeys({ t, t12 }: { t: number; t12: number }) {
  const local = t - 3.2;
  const echoX = (local * 90) % 420;
  const sealS = spring(t12 - 4.3, 150, 12);
  const ringScale = lerp(0.55, 1.15, expoOut(prog(local, 0.1, 1.1)));

  return (
    <div className="hdf-stage hdf-act2">
      <HalftoneRingCanvas color="rgba(224,78,31,0.22)" scale={ringScale} />

      <div
        className="hdf-echo-row hdf-echo-top"
        style={{ transform: `translateX(${-echoX}px)` }}
        aria-hidden="true"
      >
        DIRECTION · STORYBOARD · MODEL SHEET · TIMING · DIRECTION · STORYBOARD ·
        MODEL SHEET · TIMING
      </div>
      <div
        className="hdf-echo-row hdf-echo-bot"
        style={{ transform: `translateX(${echoX - 420}px)` }}
        aria-hidden="true"
      >
        DIRECTION · STORYBOARD · MODEL SHEET · TIMING · DIRECTION · STORYBOARD ·
        MODEL SHEET · TIMING
      </div>

      <div className="hdf-act2-center">
        <span className="hdf-badge-vermilion">ACT I · THE DIRECTOR</span>
        <h2 className="hdf-giant-word">
          <InflateWord
            text="HUMAN KEYS"
            t={t}
            start={3.25}
            stagger={0.045}
            shadowColor="#E04E1F"
          />
        </h2>

        <div className="hdf-keys-pair">
          <div className="hdf-reg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fba/02c-1930s-ink.webp"
              alt="Approved 1930s ink model sheet"
            />
            <span>02c-1930s-ink.webp</span>
          </div>
          <div className="hdf-reg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fba/lab-guide-strip.png"
              alt="Color-coded mannequin guide strip"
            />
            <span>4-pose guide strip</span>
          </div>

          {t12 >= 4.3 && (
            <div
              className="hdf-approved-seal"
              style={{
                transformOrigin: "50% 100%",
                transform: `${volumeSquash(1 + (sealS - 1) * 0.35)} scale(${clamp(sealS, 0.2, 1.08)})`,
              }}
            >
              ✓ KEY APPROVED BY DIRECTOR
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ACT 3 (6.8 - 13.2s): AGENT SCALE — 4 Rapid Showcases @ 1.6s each
   ========================================================================= */
function Act3AgentScale({ t, t12 }: { t: number; t12: number }) {
  // Sub-scene 1: 6.8 - 8.4s CODE MOTION
  if (t < 8.4) {
    const local = t - 6.8;
    const flow = inOutQuart(prog(local, 0.45, 1.25));
    const shares = [
      lerp(0.33, 0.52, flow),
      lerp(0.33, 0.26, flow),
      lerp(0.33, 0.22, flow),
    ];
    return (
      <div className="hdf-stage hdf-act3-code">
        <span className="hdf-badge-ink">ACT II · AGENT SCALE · 01/04</span>
        <h2 className="hdf-giant-word hdf-yellow">
          <InflateWord
            text="CODE MOTION"
            t={t}
            start={6.82}
            stagger={0.035}
            shadowColor="#0C0B10"
          />
        </h2>
        <div className="hdf-morph-panes">
          {[
            { label: "16:9 MASTER", w: shares[0] },
            { label: "9:16 REEL", w: shares[1] },
            { label: "WEB LOOP", w: shares[2] },
          ].map((pane) => (
            <div
              key={pane.label}
              className="hdf-morph-pane"
              style={{ flexGrow: pane.w * 10 }}
            >
              <div className="hdf-pane-bar" />
              <strong>{pane.label}</strong>
              <span>draw(t) · 60fps</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sub-scene 2: 8.4 - 10.0s 2.5D PRODUCT UI
  if (t < 10.0) {
    const local = t - 8.4;
    const p = inOutQuart(prog(local, 0.05, 0.75));
    const q = 1 - p;
    const cx = q * q * 12 + 2 * q * p * 55 + p * p * 74;
    const cy = q * q * 76 + 2 * q * p * 14 + p * p * 44;
    const exploded = spring(local - 0.55, 180, 15);
    const s1 = spring(local - 0.25, 180, 15) * 0.88;
    const s2 = spring(local - 0.4, 180, 15) * 0.68;

    return (
      <div className="hdf-stage hdf-act3-ui">
        <span className="hdf-badge-ink">ACT II · AGENT SCALE · 02/04</span>
        <h2 className="hdf-giant-word hdf-paper">
          <InflateWord
            text="2.5D PRODUCT UI"
            t={t}
            start={8.42}
            stagger={0.028}
            shadowColor="#0C0B10"
          />
        </h2>
        <div className="hdf-ui-25d">
          <div
            className="hdf-ui-layer"
            style={{
              transform: `perspective(900px) rotateX(${(exploded * 14).toFixed(1)}deg) rotateY(${(-exploded * 10).toFixed(1)}deg)`,
            }}
          >
            <div className="hdf-ui-slider">
              <span style={{ transform: `scaleX(${clamp(s1, 0, 1)})` }} />
            </div>
            <div className="hdf-ui-slider">
              <span style={{ transform: `scaleX(${clamp(s2, 0, 1)})` }} />
            </div>
            <div className="hdf-ui-toggle-pill">
              {local > 0.72 ? "✓ DEPLOYED IN CODE" : "BUILDING…"}
            </div>
          </div>
          <div
            className="hdf-bezier-cursor"
            style={{ left: `${cx.toFixed(1)}%`, top: `${cy.toFixed(1)}%` }}
            aria-hidden="true"
          >
            ▸
          </div>
        </div>
      </div>
    );
  }

  // Sub-scene 3: 10.0 - 11.6s 12 PRINCIPLES
  if (t < 11.6) {
    const local = t - 10.0;
    const bouncePhase = (local * 1.8) % 1;
    const arc = 4 * bouncePhase * (1 - bouncePhase);
    const sy = arc < 0.1 ? 0.78 + (arc / 0.1) * 0.22 : 1 + (1 - arc) * 0.14;
    const bx = prog(local, 0, 1.55) * 100;
    const by = -arc * 86;

    return (
      <div className="hdf-stage hdf-act3-craft">
        <span className="hdf-badge-yellow">ACT II · AGENT SCALE · 03/04</span>
        <h2 className="hdf-giant-word hdf-mint">
          <InflateWord
            text="12 PRINCIPLES"
            t={t}
            start={10.02}
            stagger={0.03}
            shadowColor="#0C0B10"
          />
        </h2>
        <div className="hdf-craft-pair">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-walk-c.gif"
            alt="Stepped 12fps character walk cycle"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-walk-onion.jpg"
            alt="Onion skin registration check"
          />
        </div>
        <div className="hdf-ball-track" aria-hidden="true">
          <div
            className="hdf-physics-ball"
            style={{
              left: `${bx.toFixed(1)}%`,
              transform: `translate(-50%, ${by.toFixed(1)}px) ${volumeSquash(sy)}`,
            }}
          />
        </div>
      </div>
    );
  }

  // Sub-scene 4: 11.6 - 13.2s SHIPPED FAST (Dual mascots + QA PASSED)
  const local = t - 11.6;
  const enter = spring(local, 130, 13);
  const stamp = spring(t12 - 12.05, 160, 12);

  return (
    <div className="hdf-stage hdf-act3-ship">
      <span className="hdf-badge-yellow">ACT II · AGENT SCALE · 04/04</span>
      <div className="hdf-mascots-duet">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-logo.png"
          alt="Juanimal Robo-Dragon"
          style={{
            transform: `translateX(${lerp(-180, 0, enter).toFixed(1)}px)`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/fof/snake-blue.webp"
          alt="fuelorfool Nozzle Python"
          style={{
            transform: `translateX(${lerp(180, 0, enter).toFixed(1)}px)`,
          }}
        />
      </div>
      <div
        className="hdf-qa-passed-stamp"
        style={{
          transformOrigin: "50% 100%",
          transform: `rotate(-3deg) ${volumeSquash(1 + (stamp - 1) * 0.3)}`,
          opacity: t12 >= 12.0 ? 1 : 0,
        }}
      >
        QA PASSED · 0 DRIFT
      </div>
    </div>
  );
}

/* =========================================================================
   ACT 4 (13.2 - 18.0s): THE LANDED STUDIO HERO
   ========================================================================= */
function Act4LandedHero({
  t,
  h,
  reduced,
  lang,
}: {
  t: number;
  h: {
    eyebrow: string;
    h1: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
    workflowStrip: readonly string[];
  };
  reduced: boolean;
  lang: string;
}) {
  const local = t - 13.2;
  const cardIn = expoOut(prog(local, 0.25, 1.0));

  return (
    <div className="hdf-stage hdf-act4">
      <div className="hdf-landed-grid">
        <div className="hdf-landed-copy">
          <span className="hdf-badge-yellow">{h.eyebrow}</span>
          <div className="hdf-brand-title" aria-hidden="true">
            <InflateWord
              text="JUANIMAL STUDIO"
              t={t}
              start={13.25}
              stagger={0.025}
              shadowColor="#E04E1F"
            />
          </div>
          <h1 className="hdf-landed-h1">{h.h1}</h1>
          <p className="hdf-landed-sub">{h.subhead}</p>

          <div className="hdf-workflow-strip">
            {h.workflowStrip.map((step) => (
              <span key={step} className="hdf-wf-chip">
                {step}
              </span>
            ))}
          </div>

          <div className="hdf-landed-ctas">
            <a href="#launch-kit" className="cta-btn hdf-cta-main">
              {h.ctaPrimary}
            </a>
            <a href="#work" className="hdf-cta-ghost">
              {h.ctaSecondary}
            </a>
            <Link href="/contact" className="hdf-cta-ghost is-yellow">
              {h.ctaTertiary}
            </Link>
          </div>
        </div>

        <div
          className="hdf-landed-reel"
          style={{
            opacity: cardIn,
            transform: `translateY(${lerp(24, 0, cardIn).toFixed(1)}px)`,
          }}
        >
          <div className="hdf-reel-bar">
            <span>LIVE REEL · KEYS + AGENT PIPELINE</span>
            <span className="lfp-tabular">12 FPS / 60 FPS</span>
          </div>
          <video
            src="/media/fof/keys-reel.mp4"
            poster="/media/fof/keys-reel.webp"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            aria-label="Live motion preview reel from Keys to My Heart"
          />
          <div className="hdf-reel-foot">
            <span>
              {lang === "es"
                ? "Nuestro lab abierto: fuelorfool.ing"
                : "Backed by our open R&D lab: fuelorfool.ing"}
            </span>
            <Link href="/work/fuelorfool">
              {lang === "es" ? "Ver motor →" : "Inspect engine →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
