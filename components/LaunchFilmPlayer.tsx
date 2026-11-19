"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/lib/i18n";
import {
  clamp,
  expoOut,
  formatTimecode,
  inOutQuart,
  lerp,
  prog,
  spring,
  twos,
  volumeSquash,
} from "@/lib/motion";

const MASTER_DURATION = 75;
const VERTICAL_DURATION = 15;

type FormatMode = "master" | "vertical" | "loops";

interface SceneDef {
  id: string;
  start: number;
  end: number;
  labelEn: string;
  labelEs: string;
  subEn: string;
  subEs: string;
}

const SCENES: SceneDef[] = [
  {
    id: "hook",
    start: 0,
    end: 10,
    labelEn: "01 Hook",
    labelEs: "01 Hook",
    subEn: "Ask a model for the same character twice — you get two cousins.",
    subEs:
      "Pídele a un modelo el mismo personaje dos veces — y te da dos primos.",
  },
  {
    id: "problem",
    start: 10,
    end: 18,
    labelEn: "02 Problem",
    labelEs: "02 Problema",
    subEn: "Melted hands, duplicated walk cycles, drifting silhouettes. Fatal for a game or film.",
    subEs:
      "Manos derretidas, ciclos duplicados y siluetas que cambian. Fatal para un juego o film.",
  },
  {
    id: "turn",
    start: 18,
    end: 28,
    labelEn: "03 Chain",
    labelEs: "03 Cadena",
    subEn: "Consistency isn't a better prompt. It's a chain: Frame by Agents.",
    subEs:
      "La consistencia no es un mejor prompt. Es una cadena: Frame by Agents.",
  },
  {
    id: "desk",
    start: 28,
    end: 46,
    labelEn: "04 2.5D UI",
    labelEs: "04 UI 2.5D",
    subEn: "One approved image feeds the chain. Your agent plans every limb — and asks before it draws.",
    subEs:
      "Una imagen aprobada alimenta la cadena. Tu agente planea cada extremidad — y pregunta antes de dibujar.",
  },
  {
    id: "craft",
    start: 46,
    end: 54,
    labelEn: "05 12 Rules",
    labelEs: "05 12 Reglas",
    subEn: "Twelve classical principles checked on every drawing against the approved sheet.",
    subEs:
      "Doce principios clásicos verificados en cada dibujo contra la hoja aprobada.",
  },
  {
    id: "outputs",
    start: 54,
    end: 64,
    labelEn: "06 Outputs",
    labelEs: "06 Salidas",
    subEn: "Your game. Your film. Your video. Your website — from one locked character.",
    subEs:
      "Tu juego. Tu corto. Tu video. Tu web — desde un mismo personaje bloqueado.",
  },
  {
    id: "honest",
    start: 64,
    end: 70,
    labelEn: "07 Audit",
    labelEs: "07 Auditoría",
    subEn: "We say so on the box: 25 Codex gens, <1/255 color drift, fast limbs still flagged for QA.",
    subEs:
      "Lo decimos en la caja: 25 generaciones en Codex, deriva <1/255, extremidades rápidas pasan por QA humano.",
  },
  {
    id: "cta",
    start: 70,
    end: 75,
    labelEn: "08 CTA",
    labelEs: "08 Cierre",
    subEn: "Frame by Agents. The Kit $99 · The Studio $299. Take a seat.",
    subEs: "Frame by Agents. The Kit $99 · The Studio $299. Toma asiento.",
  },
];

const PRINCIPLES = [
  "Squash & Stretch",
  "Anticipation",
  "Staging",
  "Pose to Pose",
  "Follow Through",
  "Slow In / Slow Out",
  "Arcs",
  "Secondary Action",
  "Timing",
  "Exaggeration",
  "Solid Drawing",
  "Appeal",
] as const;

const ERAS = [
  { label: "CANON", img: "/images/fba/00-canon.webp" },
  { label: "PENCIL", img: "/images/fba/01-pencil.webp" },
  { label: "30s PENCIL", img: "/images/fba/02b-1930s-pencil.webp" },
  { label: "30s INK", img: "/images/fba/02c-1930s-ink.webp" },
  { label: "1940s CEL", img: "/images/fba/03-1940s.webp" },
  { label: "STYLIZED 3D", img: "/images/fba/07-3d.webp" },
] as const;

const DESK_LAYERS = [
  {
    tag: "01 · BIBLE.MD",
    title: "Canon Locks",
    detail: "Copper hair · Opal sternum · Proportions locked",
    img: "/images/fba/ref.webp",
  },
  {
    tag: "02 · MODEL SHEET",
    title: "1930s Ink Turnaround",
    detail: "[APPROVED BY DIRECTOR]",
    img: "/images/fba/02c-1930s-ink.webp",
  },
  {
    tag: "03 · POSE GUIDE STRIP",
    title: "Color-Coded Rig",
    detail: "Red = near limbs · Blue = far limbs",
    img: "/images/fba/lab-guide-strip.png",
  },
  {
    tag: "04 · BOARDS + KEYS",
    title: "Beat-Mapped Keyframes",
    detail: "[APPROVED BEFORE SPENDING]",
    img: "/images/fba/board.webp",
  },
  {
    tag: "05 · IN-BETWEENS",
    title: "8-Drawing Walk Cycle",
    detail: "Stepped on twos · 202s pipeline",
    img: "/images/fba/lab-walk-c.gif",
  },
] as const;

export function LaunchFilmPlayer() {
  const { lang, t: copy } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const labels = copy.launchShowcase.playerLabels;

  const [mode, setMode] = useState<FormatMode>("master");
  const [subLang, setSubLang] = useState<Locale>(lang);
  const [showSubs, setShowSubs] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [vt, setVt] = useState(0);
  const [loopsRunning, setLoopsRunning] = useState(true);

  useEffect(() => {
    setSubLang(lang);
  }, [lang]);

  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  const duration = mode === "vertical" ? VERTICAL_DURATION : MASTER_DURATION;
  const currentTime = mode === "vertical" ? vt : t;

  useEffect(() => {
    if (!playing || mode === "loops") return;
    if (reduced) {
      setPlaying(false);
      return;
    }

    lastFrameRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;

      if (mode === "master") {
        setT((prev) => {
          const next = prev + dt;
          if (next >= MASTER_DURATION) {
            setPlaying(false);
            return MASTER_DURATION;
          }
          return next;
        });
      } else {
        setVt((prev) => {
          const next = prev + dt;
          if (next >= VERTICAL_DURATION) {
            return 0;
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, mode, reduced]);

  const activeScene = useMemo(() => {
    return (
      SCENES.find((s) => t >= s.start && t < s.end) ??
      SCENES[SCENES.length - 1]
    );
  }, [t]);

  const activeSceneIndex = SCENES.findIndex((s) => s.id === activeScene.id);

  // Two clocks: t60 for camera/cursor/2.5D transforms, t12 stepped on twos (12fps) for drawings/QA marks
  const t60 = t;
  const t12 = twos(t);
  const frameNum = Math.floor(t12 * 12);

  const handleTogglePlay = () => {
    if (mode === "loops") {
      setLoopsRunning((v) => !v);
      return;
    }
    if (mode === "master" && t >= MASTER_DURATION - 0.05) {
      setT(0);
    }
    setPlaying((p) => !p);
  };

  const handleScrub = (nextSec: number) => {
    if (mode === "master") setT(clamp(nextSec, 0, MASTER_DURATION));
    if (mode === "vertical") setVt(clamp(nextSec, 0, VERTICAL_DURATION));
  };

  const jumpToScene = (startSec: number) => {
    setMode("master");
    setT(startSec + 0.01);
  };

  const handleModeChange = (nextMode: FormatMode) => {
    setPlaying(false);
    setMode(nextMode);
  };

  return (
    <div className="lfp-wrap">
      {/* Top Deliverable Switcher */}
      <div className="lfp-tabs" role="tablist" aria-label="Launch Kit Formats">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "master"}
          className={`lfp-tab${mode === "master" ? " is-active" : ""}`}
          onClick={() => handleModeChange("master")}
        >
          {labels.masterTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "vertical"}
          className={`lfp-tab${mode === "vertical" ? " is-active" : ""}`}
          onClick={() => handleModeChange("vertical")}
        >
          {labels.verticalTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "loops"}
          className={`lfp-tab${mode === "loops" ? " is-active" : ""}`}
          onClick={() => handleModeChange("loops")}
        >
          {labels.loopsTab}
        </button>
      </div>

      {/* MODE 1: 16:9 MASTER LAUNCH FILM (75s) */}
      {mode === "master" && (
        <div className="lfp-player-shell">
          <div className="lfp-stage" aria-label="Frame by Agents 75s Launch Film Stage">
            {/* Top Cinema Slate Telemetry */}
            <div className="lfp-slate-bar">
              <span>SCENE {activeScene.id.toUpperCase()}</span>
              <span className="lfp-tabular">
                {formatTimecode(t60)} / 01:15.00
              </span>
              <span>{labels.beatLabel} · {labels.fpsLabel}</span>
            </div>

            {/* SCENE 01: HOOK (0.0 - 10.0s) */}
            {t >= 0 && t < 10 && <SceneHook t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 02: PROBLEM (10.0 - 18.0s) */}
            {t >= 10 && t < 18 && <SceneProblem t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 03: TURN & REVEAL (18.0 - 28.0s) */}
            {t >= 18 && t < 28 && <SceneTurn t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 04: 2.5D PRODUCTION DESK (28.0 - 46.0s) */}
            {t >= 28 && t < 46 && <SceneDesk25D t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 05: 12 PRINCIPLES (46.0 - 54.0s) */}
            {t >= 46 && t < 54 && <SceneCraft t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 06: FOUR OUTPUTS (54.0 - 64.0s) */}
            {t >= 54 && t < 64 && <SceneOutputs t60={t60} t12={t12} subLang={subLang} />}

            {/* SCENE 07: THE HONEST PART (64.0 - 70.0s) */}
            {t >= 64 && t < 70 && <SceneHonest t60={t60} subLang={subLang} />}

            {/* SCENE 08: CTA (70.0 - 75.0s) */}
            {t >= 70 && t <= 75 && <SceneCta t60={t60} t12={t12} subLang={subLang} />}

            {/* Burned-in Subtitles */}
            {showSubs && (
              <div className="lfp-subs" aria-live="off">
                <span>
                  {subLang === "es" ? activeScene.subEs : activeScene.subEn}
                </span>
              </div>
            )}

            {/* Ready Play Trigger Overlay when paused at t=0 */}
            {!playing && t < 0.05 && (
              <button
                type="button"
                className="lfp-center-play"
                onClick={() => setPlaying(true)}
                aria-label={`${labels.play} Launch Film`}
              >
                <span className="lfp-play-tri" aria-hidden="true">
                  ▶
                </span>
                <span>
                  {subLang === "es"
                    ? "REPRODUCIR LAUNCH FILM (01:15)"
                    : "PLAY LAUNCH FILM (01:15)"}
                </span>
              </button>
            )}
          </div>

          {/* Transport + Scene Jump Bar */}
          <div className="lfp-controls">
            <div className="lfp-ctrl-row">
              <div className="lfp-ctrl-btns">
                <button
                  type="button"
                  className="lfp-btn-primary"
                  onClick={handleTogglePlay}
                >
                  {playing ? `❚❚ ${labels.pause}` : `▶ ${labels.play}`}
                </button>
                <button
                  type="button"
                  className="lfp-btn-sec"
                  onClick={() => {
                    setPlaying(false);
                    setT(0);
                  }}
                >
                  ↺ {labels.restart}
                </button>
              </div>

              <div className="lfp-readout lfp-tabular">
                <span>TC {formatTimecode(t60)}</span>
                <span>FRAME {String(frameNum).padStart(3, "0")}</span>
                <span>
                  {activeSceneIndex === 6
                    ? "SPRING k=300 c=30"
                    : activeSceneIndex === 3
                      ? "SPRING k=100 c=15"
                      : "SPRING k=120 c=14"}
                </span>
              </div>

              <div className="lfp-ctrl-btns">
                <button
                  type="button"
                  className={`lfp-btn-sec${showSubs ? " is-on" : ""}`}
                  onClick={() => setShowSubs((v) => !v)}
                >
                  CC {showSubs ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  className="lfp-btn-sec"
                  onClick={() =>
                    setSubLang((l) => (l === "en" ? "es" : "en"))
                  }
                >
                  {subLang.toUpperCase()}
                </button>
              </div>
            </div>

            <div className="lfp-scrubber-wrap">
              <input
                type="range"
                min={0}
                max={MASTER_DURATION}
                step={0.05}
                value={t}
                onChange={(e) => handleScrub(parseFloat(e.target.value))}
                aria-label="Scrub Launch Film timeline"
                className="lfp-scrubber"
              />
            </div>

            <div className="lfp-scene-strip">
              {SCENES.map((sc) => {
                const isActive = sc.id === activeScene.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    className={`lfp-scene-pill${isActive ? " is-active" : ""}`}
                    onClick={() => jumpToScene(sc.start)}
                  >
                    {subLang === "es" ? sc.labelEs : sc.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 9:16 VERTICAL PAID-SOCIAL CUTDOWN (15s) */}
      {mode === "vertical" && (
        <div className="lfp-vertical-layout">
          <div className="lfp-phone-frame">
            <div className="lfp-safe-guide" aria-hidden="true">
              <span>9:16 SAFE AREA</span>
            </div>
            <VerticalCutdownStage vt={vt} subLang={subLang} />
            <div className="lfp-phone-bar">
              <button
                type="button"
                className="lfp-btn-primary"
                onClick={handleTogglePlay}
              >
                {playing ? `❚❚ ${labels.pause}` : `▶ ${labels.play} 15s`}
              </button>
              <span className="lfp-tabular lfp-phone-tc">
                {vt.toFixed(1)}s / 15.0s
              </span>
              <input
                type="range"
                min={0}
                max={VERTICAL_DURATION}
                step={0.05}
                value={vt}
                onChange={(e) => handleScrub(parseFloat(e.target.value))}
                aria-label="Scrub 9:16 vertical cutdown"
                className="lfp-scrubber"
              />
            </div>
          </div>

          <div className="lfp-vertical-notes">
            <span className="eyebrow" style={{ marginBottom: 14 }}>
              9:16 PAID-SOCIAL DELIVERABLE
            </span>
            <h3>
              {subLang === "es"
                ? 'Corte Vertical "Dos Primos" (15s)'
                : '"Two Cousins" Vertical Cutdown (15s)'}
            </h3>
            <p>
              {subLang === "es"
                ? "Re-renderizado paramétricamente desde las mismas composiciones de UI y keys del Master 16:9. Optimizado para LinkedIn, X y Reels con subtítulos quemados dentro de la safe area móvil."
                : "Re-rendered parametrically from the exact same code compositions and approved keys as the 16:9 Master. Tuned for LinkedIn, X, and Reels with burned-in captions inside mobile safe margins."}
            </p>
            <ul className="lfp-spec-list">
              <li>0.0–4.5s: Hook visual — dos generaciones incompatibles + círculos rojos QA</li>
              <li>4.5–9.5s: Giro — Canon Lock + Cadena 1930s → Guías Maniquí → Walk C</li>
              <li>9.5–12.5s: 12 Principios en ticker rápido a 120 BPM</li>
              <li>12.5–15.0s: CTA directo — Frame by Agents · Take a seat</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODE 3: SILENT WEB LOOPS (4x FEATURE GRID) */}
      {mode === "loops" && (
        <div className="lfp-loops-shell">
          <div className="lfp-loops-head">
            <p>{labels.loopsIntro}</p>
            <button
              type="button"
              className="lfp-btn-sec"
              onClick={() => setLoopsRunning((v) => !v)}
            >
              {loopsRunning ? `❚❚ ${labels.pause}` : `▶ ${labels.play}`}
            </button>
          </div>
          <div className="lfp-loops-grid">
            {copy.launchShowcase.loops.map((lp, idx) => (
              <article key={lp.id} className="lfp-loop-card">
                <div className={`lfp-loop-viewport${loopsRunning && !reduced ? " is-animating" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lp.img}
                    alt={lp.alt}
                    className={`lfp-loop-img lfp-loop-variant-${idx}`}
                    loading="lazy"
                  />
                  <span className="lfp-loop-tag">{lp.tag}</span>
                </div>
                <div className="lfp-loop-body">
                  <h4>{lp.title}</h4>
                  <p>{lp.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   SCENE 01 — HOOK (0.0 – 10.0s)
   Verb: Collide & Red-line
   ========================================================================= */
function SceneHook({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const promptFull =
    '> generate: "Synthia, 1930s rubber-hose cartoon, holding mace"';
  const charCount = Math.floor(prog(t60, 0.2, 2.3) * promptFull.length);
  const splitProg = spring(t60 - 2.4, 120, 14);
  const splitX = lerp(0, 18, clamp(splitProg, 0, 1.1));
  const qaStep = spring(t12 - 5.8, 120, 14);
  const qaScale = qaStep > 0 ? clamp(qaStep, 0, 1.07) : 0;

  return (
    <div className="lfp-scene lfp-scene-paper">
      <div className="lfp-terminal-bar">
        <span className="lfp-dot" />
        <span className="lfp-dot" />
        <span className="lfp-dot" />
        <code>{promptFull.slice(0, Math.max(12, charCount))}</code>
      </div>

      <div className="lfp-hook-grid">
        <div
          className="lfp-cousin-card"
          style={{
            transform: `translateX(${-splitX}px)`,
            opacity: t60 < 0.3 ? 0.88 : 1,
          }}
        >
          <span className="lfp-badge-dark">RUN #01 · NO CHAIN</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-abc-compare.jpg"
            alt="Unguided character generation run A vs B vs C comparison"
            className="lfp-crop-left"
          />
          {t12 >= 5.8 && (
            <div
              className="lfp-qa-callout"
              style={{
                transformOrigin: "50% 100%",
                transform: `${volumeSquash(1 + (qaScale - 1) * 0.4)} scale(${qaScale})`,
              }}
            >
              ✕ DRIFT: MACE GRIP &amp; HAIR
            </div>
          )}
        </div>

        <div
          className="lfp-cousin-card"
          style={{
            transform: `translateX(${splitX}px)`,
            opacity: t60 < 2.2 ? 0.35 : 1,
          }}
        >
          <span className="lfp-badge-dark">RUN #02 · RE-PROMPTED</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fba/lab-drift-detail.jpg"
            alt="Second prompt generation showing limb and costume drift"
            className="lfp-crop-right"
          />
          {t12 >= 6.4 && (
            <div
              className="lfp-qa-callout"
              style={{
                transformOrigin: "50% 100%",
                transform: volumeSquash(
                  1 + (spring(t12 - 6.4, 120, 14) - 1) * 0.2
                ),
              }}
            >
              ✕ TWO COUSINS
            </div>
          )}
        </div>
      </div>

      <h3 className="lfp-scene-title">
        {t60 < 5.6
          ? subLang === "es"
            ? "Pide el mismo personaje dos veces…"
            : "Ask for the same character twice…"
          : subLang === "es"
            ? "…y obtienes dos primos distintos."
            : "…you get two cousins."}
      </h3>
    </div>
  );
}

/* =========================================================================
   SCENE 02 — PROBLEM (10.0 – 18.0s)
   Verb: Reject on beat (120 BPM)
   ========================================================================= */
function SceneProblem({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const failures = [
    {
      titleEn: "MELTED HANDS & LIMB SWAP",
      titleEs: "MANOS DERRETIDAS Y EXTREMIDADES",
      img: "/images/fba/lab-drift-detail.jpg",
      metric: "QA FAIL #01 · ARM JUMP",
    },
    {
      titleEn: "DUPLICATED HALF-CYCLE",
      titleEs: "MEDIO CICLO DUPLICADO",
      img: "/images/fba/lab-abc-compare.jpg",
      metric: "QA FAIL #02 · 7/7 WHOLE SHEETS",
    },
    {
      titleEn: "HEIGHT & SCALE POP",
      titleEs: "SALTO DE ESCALA Y ALTURA",
      img: "/images/fba/lab-walk-rulers.jpg",
      metric: "QA FAIL #03 · +/- 22PX DRIFT",
    },
  ];
  const local = t60 - 10;
  const idx = Math.min(2, Math.floor(local / 2.65));
  const beatLocal = local - idx * 2.65;
  const stamp = spring(twos(beatLocal) - 0.35, 120, 14);
  const sy = 1 - Math.sin(clamp(stamp, 0, 1) * Math.PI) * 0.11;

  const item = failures[idx];

  return (
    <div className="lfp-scene lfp-scene-ink">
      <div className="lfp-problem-card">
        <div className="lfp-problem-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt={item.titleEn} />
          <div
            className="lfp-reject-stamp"
            style={{
              transformOrigin: "50% 100%",
              transform: `rotate(-5deg) ${volumeSquash(sy)} scale(${clamp(stamp, 0.2, 1.07)})`,
              opacity: stamp > 0.05 ? 1 : 0,
            }}
          >
            ✕ REJECTED
          </div>
        </div>
        <div className="lfp-problem-meta">
          <span className="lfp-badge-red">{item.metric}</span>
          <h3>{subLang === "es" ? item.titleEs : item.titleEn}</h3>
          <p>
            {subLang === "es"
              ? "En un juego o film, un solo frame fuera de modelo rompe toda la escena."
              : "For a game or a launch film, a single off-model frame breaks the whole shot."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 03 — TURN & REVEAL (18.0 – 28.0s)
   Verb: Lock & Chain
   ========================================================================= */
function SceneTurn({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const local = t60 - 18;
  const stampLock = spring(t12 - 20.3, 120, 14);
  const chainProgress = prog(local, 4.2, 9.2);
  const activeEraIdx = Math.min(
    ERAS.length - 1,
    Math.floor(chainProgress * ERAS.length)
  );

  return (
    <div className="lfp-scene lfp-scene-paper">
      {local < 4.2 ? (
        <div className="lfp-turn-solo">
          <div className="lfp-canon-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/fba/00-canon.webp" alt="Synthia canon model sheet" />
            {t12 >= 20.3 && (
              <div
                className="lfp-approve-seal"
                style={{
                  transformOrigin: "50% 100%",
                  transform: volumeSquash(1 + (stampLock - 1) * 0.45),
                }}
              >
                ✓ APPROVED · CANON LOCK
              </div>
            )}
          </div>
          <h3 className="lfp-scene-title">
            {subLang === "es"
              ? "Consistencia no es un mejor prompt."
              : "Consistency isn't a better prompt."}
          </h3>
        </div>
      ) : (
        <div className="lfp-chain-reveal">
          <div className="lfp-chain-head">
            <span className="lfp-badge-red">
              {subLang === "es" ? "ES UNA CADENA" : "IT'S A CHAIN"}
            </span>
            <h3>FRAME BY AGENTS</h3>
          </div>
          <div className="lfp-era-strip">
            {ERAS.map((era, i) => {
              const unlocked = i <= activeEraIdx;
              return (
                <div
                  key={era.label}
                  className={`lfp-era-cell${unlocked ? " is-locked" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={era.img} alt={era.label} />
                  <span>{era.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   SCENE 04 — 2.5D PRODUCTION DESK UI BREAKDOWN (28.0 – 46.0s)
   Verb: Explode in 2.5D space (60fps cam + 12fps assets)
   ========================================================================= */
function SceneDesk25D({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const local = t60 - 28; // 0 -> 18s
  const tiltProg = inOutQuart(prog(local, 0.4, 3.0));
  const rotX = lerp(0, 14, tiltProg);
  const rotY = lerp(0, -11, tiltProg);
  const explodeGap = lerp(0, 1, spring(local - 1.5, 100, 15));

  const activeLayer = Math.min(
    DESK_LAYERS.length - 1,
    Math.floor(prog(local, 2.5, 17.2) * DESK_LAYERS.length)
  );

  const cursorX = lerp(18, 78, inOutQuart(prog(local, 3.0, 16.5)));
  const cursorY = 50 + Math.sin(local * 1.4) * 16;

  return (
    <div className="lfp-scene lfp-scene-desk">
      <div className="lfp-desk-copy">
        <span className="lfp-badge-red">2.5D PRODUCTION STACK</span>
        <h3>
          {subLang === "es"
            ? "Una imagen alimenta toda la cadena."
            : "One approved image feeds the entire chain."}
        </h3>
        <div className="lfp-desk-steps">
          {DESK_LAYERS.map((layer, i) => (
            <div
              key={layer.tag}
              className={`lfp-desk-step${i === activeLayer ? " is-active" : ""}${i < activeLayer ? " is-done" : ""}`}
            >
              <strong>{layer.tag}</strong>
              <span>{layer.title}</span>
              <small>{layer.detail}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="lfp-desk-viewport">
        <div
          className="lfp-desk-stack"
          style={{
            transform: `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
          }}
        >
          {DESK_LAYERS.map((layer, i) => {
            const z = (i - 2) * 34 * explodeGap;
            const isActive = i === activeLayer;
            const yShift = (i - activeLayer) * 18;
            return (
              <div
                key={layer.tag}
                className={`lfp-desk-layer${isActive ? " is-active" : ""}`}
                style={{
                  transform: `translate3d(${i * 12 * explodeGap}px, ${yShift}px, ${z.toFixed(1)}px)`,
                  opacity: i <= activeLayer + 1 ? (isActive ? 1 : 0.42) : 0.14,
                  zIndex: isActive ? 20 : 10 + i,
                }}
              >
                <div className="lfp-desk-layer-head">
                  <span>{layer.tag}</span>
                  <span>{i <= activeLayer ? "✓ APPROVED" : "QUEUED"}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={layer.img}
                  alt={layer.title}
                  style={{
                    filter:
                      t12 % 0.5 < 0.08 && isActive ? "contrast(1.06)" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Smooth 60fps UI cursor */}
        <div
          className="lfp-cursor"
          aria-hidden="true"
          style={{
            left: `${cursorX.toFixed(1)}%`,
            top: `${cursorY.toFixed(1)}%`,
          }}
        >
          ▸ QA
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 05 — CRAFT & 12 PRINCIPLES (46.0 – 54.0s)
   Verb: Each principle performs its own rule
   ========================================================================= */
function SceneCraft({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const local = t60 - 46; // 0 -> 8s
  const passedCount = Math.min(12, Math.floor(prog(local, 0.3, 6.8) * 12) + 1);

  return (
    <div className="lfp-scene lfp-scene-paper lfp-scene-craft">
      <div className="lfp-craft-onion">
        <span className="lfp-badge-dark">
          ONION SKIN QA · {String(passedCount).padStart(2, "0")}/12
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/fba/lab-walk-onion.jpg"
          alt="Onion skin walk cycle registration overlay"
        />
        <p>
          {subLang === "es"
            ? "Doce reglas. En cada dibujo."
            : "Twelve rules. On every drawing."}
        </p>
      </div>

      <div className="lfp-principles-grid">
        {PRINCIPLES.map((p, i) => {
          const active = i < passedCount;
          const onset = i * 0.52;
          const dt = Math.max(0, t12 - 46 - onset);
          let animStyle: React.CSSProperties = {};

          if (active) {
            if (i === 0) {
              // Squash & Stretch (volume preserving)
              const sy = 1 - Math.sin(clamp(dt * 4, 0, Math.PI)) * 0.14;
              animStyle = {
                transformOrigin: "50% 100%",
                transform: volumeSquash(sy),
              };
            } else if (i === 1) {
              // Anticipation (-8% counter-move before landing)
              const x = dt < 0.2 ? -6 : lerp(-6, 0, expoOut(dt - 0.2));
              animStyle = { transform: `translateX(${x.toFixed(1)}px)` };
            } else if (i === 6) {
              // Arcs (curved pivot)
              const ang = Math.sin(clamp(dt * 3.5, 0, Math.PI)) * -5;
              animStyle = {
                transformOrigin: "0% 100%",
                transform: `rotate(${ang.toFixed(1)}deg)`,
              };
            } else {
              const s = spring(dt, 100, 15);
              animStyle = {
                transform: `translateY(${lerp(8, 0, s).toFixed(1)}px)`,
              };
            }
          }

          return (
            <div
              key={p}
              className={`lfp-principle-chip${active ? " is-checked" : ""}`}
              style={animStyle}
            >
              <span>{active ? "✓" : "○"}</span> {p}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 06 — FOUR OUTPUTS (54.0 – 64.0s)
   Verb: Split & Act (80ms stagger, k=100 c=15)
   ========================================================================= */
function SceneOutputs({ t60, subLang }: { t60: number; t12: number; subLang: Locale }) {
  const local = t60 - 54;
  const outputs = [
    {
      label: subLang === "es" ? "TU JUEGO" : "YOUR GAME",
      note: "Sprite atlas · <0.5px jitter",
      img: "/images/fba/use-game.webp",
    },
    {
      label: subLang === "es" ? "TU ANIMACIÓN" : "YOUR FILM",
      note: "Shots & shorts held on twos",
      img: "/images/fba/use-film.webp",
    },
    {
      label: subLang === "es" ? "TU VIDEO" : "YOUR VIDEO",
      note: "Launch explainers & ads",
      img: "/images/fba/use-motion.webp",
    },
    {
      label: subLang === "es" ? "TU WEB" : "YOUR WEBSITE",
      note: "Characters acting on scroll",
      img: "/images/fba/use-web.webp",
    },
  ];

  return (
    <div className="lfp-scene lfp-scene-ink">
      <div className="lfp-outputs-grid">
        {outputs.map((out, i) => {
          const s = spring(local - i * 0.12, 100, 15);
          return (
            <div
              key={out.label}
              className="lfp-output-card"
              style={{
                opacity: clamp(s, 0, 1),
                transform: `translateY(${lerp(22, 0, s).toFixed(1)}px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out.img} alt={out.label} />
              <div className="lfp-output-caption">
                <strong>{out.label}</strong>
                <span>{out.note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 07 — THE HONEST PART (64.0 – 70.0s)
   Verb: Index & Audit (critically damped k=300 c=30)
   ========================================================================= */
function SceneHonest({ t60, subLang }: { t60: number; subLang: Locale }) {
  const local = t60 - 64;
  const s = spring(local, 300, 30);

  return (
    <div className="lfp-scene lfp-scene-paper">
      <div
        className="lfp-honest-ledger"
        style={{
          opacity: clamp(s, 0.2, 1),
          transform: `translateY(${lerp(12, 0, s).toFixed(1)}px)`,
        }}
      >
        <span className="lfp-badge-red">
          {subLang === "es"
            ? "LO DECIMOS EN LA CAJA"
            : "WE SAY SO ON THE BOX"}
        </span>
        <h3>
          {subLang === "es"
            ? "Telemetría real de laboratorio (RESULTS.md)"
            : "Real Lab Telemetry (RESULTS.md)"}
        </h3>
        <div className="lfp-ledger-grid lfp-tabular">
          <div>
            <strong>25</strong>
            <span>Codex benchmark runs</span>
          </div>
          <div>
            <strong>202s</strong>
            <span>4-pose strip pipeline (Arm C)</span>
          </div>
          <div>
            <strong>&lt;1/255</strong>
            <span>Color drift inside sheet</span>
          </div>
          <div>
            <strong>FLAGGED</strong>
            <span>Fast limbs checked by human QA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 08 — CTA HOLD (70.0 – 75.0s)
   Verb: Settle & Hold (>= 2.5s readable hold)
   ========================================================================= */
function SceneCta({
  t60,
  t12,
  subLang,
}: {
  t60: number;
  t12: number;
  subLang: Locale;
}) {
  const local = t60 - 70;
  const settle = spring(local, 120, 14);
  const sy = 1 + (settle - 1) * 0.25;

  return (
    <div className="lfp-scene lfp-scene-cta">
      <div className="lfp-cta-card">
        <div className="lfp-cta-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t12 % 1.6 > 1.3 ? "/images/fba/face-wink.webp" : "/images/fba/synthia-desk.webp"}
            alt="Synthia at the animation desk"
          />
        </div>
        <div className="lfp-cta-info">
          <span className="lfp-badge-red">FRAME BY AGENTS</span>
          <h3
            style={{
              transformOrigin: "50% 100%",
              transform: volumeSquash(sy),
            }}
          >
            {subLang === "es" ? "Toma asiento." : "Take a seat."}
          </h3>
          <p>The Kit $99 · The Studio $299 · Human Direction + Agent Skills</p>
          <a
            href="https://fuelorfool.ing/frame-by-agents/"
            target="_blank"
            rel="noopener noreferrer"
            className="lfp-cta-link"
          >
            {subLang === "es"
              ? "Ver Producto en Vivo ↗"
              : "Visit Live Product ↗"}
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   9:16 VERTICAL PAID-SOCIAL CUTDOWN STAGE (15.0s)
   ========================================================================= */
function VerticalCutdownStage({
  vt,
  subLang,
}: {
  vt: number;
  subLang: Locale;
}) {
  const vt12 = twos(vt);
  let phase = 0;
  if (vt >= 4.5) phase = 1;
  if (vt >= 9.5) phase = 2;
  if (vt >= 12.5) phase = 3;

  const captions = [
    subLang === "es"
      ? "Dos generaciones = dos primos distintos."
      : "Two prompts = two cousins.",
    subLang === "es"
      ? "Consistencia es una cadena aprobada."
      : "Consistency is an approved chain.",
    subLang === "es"
      ? "12 principios revisados en cada frame."
      : "12 principles checked on every frame.",
    subLang === "es"
      ? "Frame by Agents — Toma asiento."
      : "Frame by Agents — Take a seat.",
  ];

  const imgs = [
    "/images/fba/lab-abc-compare.jpg",
    "/images/fba/lab-guide-strip.png",
    "/images/fba/lab-walk-onion.jpg",
    "/images/fba/synthia-desk.webp",
  ];

  const pop = spring(vt12 - (phase === 0 ? 0 : phase === 1 ? 4.5 : phase === 2 ? 9.5 : 12.5), 120, 14);

  return (
    <div className="lfp-vertical-stage">
      <div className="lfp-vertical-top">
        <span>LAUNCH CUTDOWN · 9:16</span>
        <span className="lfp-tabular">0{phase + 1}/04</span>
      </div>
      <div className="lfp-vertical-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgs[phase]}
          alt={captions[phase]}
          style={{
            transformOrigin: "50% 100%",
            transform: volumeSquash(1 + (pop - 1) * 0.2),
          }}
        />
        {phase === 0 && (
          <div className="lfp-qa-callout lfp-qa-float">✕ DRIFT DETECTED</div>
        )}
        {phase === 1 && (
          <div className="lfp-approve-seal lfp-seal-float">✓ CANON LOCKED</div>
        )}
      </div>
      <div className="lfp-vertical-caption">
        <p>{captions[phase]}</p>
      </div>
    </div>
  );
}
