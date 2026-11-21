"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  disposeRamsesAudio,
  playComicSfx,
  setRamsesMuted,
  toggleDiscoLoop,
  type ComicSfxKind,
} from "@/lib/ramses/ramsesAudio";
import RamsesSunbeamGame from "./RamsesSunbeamGame";

const RamsesComicStage3D = dynamic(() => import("./RamsesComicStage3D"), {
  ssr: false,
  loading: () => (
    <div className="rm-loading-stage">
      <span>RAMSÉS IS WARMING UP…</span>
    </div>
  ),
});

interface ComicBeat {
  num: string;
  tag: Record<"en" | "es", string>;
  speaker: Record<"en" | "es", string>;
  line: Record<"en" | "es", string>;
  actionLabel: Record<"en" | "es", string>;
  onomatopoeia: Record<"en" | "es", string>;
  sfx: ComicSfxKind;
  accent: "gold" | "pink" | "periwinkle";
}

const COMIC_BEATS: ComicBeat[] = [
  {
    num: "01",
    tag: { en: "ISSUE #04 · COVER", es: "EDICIÓN #04 · PORTADA" },
    speaker: { en: "RAMSÉS SPEAKS", es: "DICE RAMSÉS" },
    line: {
      en: "Zero fur. Maximum hubris. The radiator is set to 19°C — utterly unacceptable for a Solar Pharaoh.",
      es: "Cero pelo. Ego infinito. El radiador está en 19°C: una ofensa imperdonable para un Faraón Solar.",
    },
    actionLabel: { en: "👑 Tap Crown", es: "👑 Tocar Corona" },
    onomatopoeia: { en: "ALL HAIL!", es: "¡SALUDEN AL REY!" },
    sfx: "crown",
    accent: "gold",
  },
  {
    num: "02",
    tag: { en: "CH. 01 · TRAGIC REALITY", es: "CAP. 01 · REALIDAD TRÁGICA" },
    speaker: { en: "RAMSÉS (SHIVERING)", es: "RAMSÉS (TEMBLANDO)" },
    line: {
      en: "My skin touches crisp air! Humans wear wool sweaters and expect me to survive like a peasant?!",
      es: "¡Me da brisa en la piel! ¿Los humanos usan suéteres y esperan que sobreviva como un plebeyo?",
    },
    actionLabel: { en: "🐾 Rub Wrinkles", es: "🐾 Acariciar Arrugas" },
    onomatopoeia: { en: "PURRR!!", es: "¡PRRRR!!" },
    sfx: "purr",
    accent: "pink",
  },
  {
    num: "03",
    tag: { en: "CH. 02 · THERMAL COUP", es: "CAP. 02 · GOLPE TÉRMICO" },
    speaker: { en: "NARRATOR", es: "NARRADOR" },
    line: {
      en: "Wait until they leave the room... Crank the cast-iron valve past safety limits to unlock true color.",
      es: "En cuanto salen de la sala... gira la válvula de hierro más allá del límite para liberar el color.",
    },
    actionLabel: { en: "🔥 Crank Valve", es: "🔥 Subir Válvula" },
    onomatopoeia: { en: "CLANK! FZZZT!!", es: "¡CLANK! ¡FZZZT!!" },
    sfx: "valve",
    accent: "gold",
  },
  {
    num: "04",
    tag: { en: "CH. 03 · GRAVITY AUDIT", es: "CAP. 03 · TEST DE GRAVEDAD" },
    speaker: { en: "RAMSÉS (DEADPAN)", es: "RAMSÉS (IMPASIBLE)" },
    line: {
      en: "Ignored my dinner by four minutes. Gravity must be scientifically tested with your ceramic mug.",
      es: "Ignoraste mi cena cuatro minutos. Habrá que comprobar si la gravedad funciona con tu taza.",
    },
    actionLabel: { en: "☕ Nudge the Mug", es: "☕ Empujar la Taza" },
    onomatopoeia: { en: "CRASH!!", es: "¡CRAAAASH!!" },
    sfx: "crash",
    accent: "periwinkle",
  },
  {
    num: "05",
    tag: { en: "CH. 04 · FORBIDDEN BEAM", es: "CAP. 04 · RAYO PROHIBIDO" },
    speaker: { en: "NARRATOR", es: "NARRADOR" },
    line: {
      en: "One diagonal rectangle of 2:00 PM sunlight hits the rug. Time freezes across the entire universe.",
      es: "Un rayo diagonal de sol de las 2:00 PM toca la alfombra. El tiempo se detiene en el universo.",
    },
    actionLabel: { en: "☀ Pull Blinds Cord", es: "☀ Jalar la Persiana" },
    onomatopoeia: { en: "BASK!! ☀", es: "¡¡SOLAZO!! ☀" },
    sfx: "sunbeam",
    accent: "gold",
  },
  {
    num: "06",
    tag: { en: "CH. 05 · 3:00 AM ZOOMIES", es: "CAP. 05 · DISCO 3:00 AM" },
    speaker: { en: "DJ RAMSÉS", es: "DJ RAMSÉS" },
    line: {
      en: "Everyone asleep? Time to steal the chunky periwinkle headphones and throw couch cushions into orbit!",
      es: "¿Todos dormidos? Hora de ponerse los audífonos y lanzar cojines rosas al ritmo del bajo.",
    },
    actionLabel: { en: "🎵 Drop 3AM Beat", es: "🎵 Soltar Beat 3AM" },
    onomatopoeia: { en: "BOOM-BAP!!", es: "¡¡BUM-BAP!!" },
    sfx: "beat",
    accent: "periwinkle",
  },
  {
    num: "07",
    tag: { en: "CH. 06 · ASCENSION", es: "CAP. 06 · ASCENSIÓN" },
    speaker: { en: "EMPEROR RAMSÉS I", es: "EMPERADOR RAMSÉS I" },
    line: {
      en: "Warm toes acquired. Star shades locked. Kneel before the bald Sun-Emperor of Apartment 4B!",
      es: "Patitas calientes. Gafas de estrella listas. ¡Inclínense ante el Emperador Pelón del Piso 4B!",
    },
    actionLabel: { en: "✨ Crown the Sun-God", es: "✨ Coronar al Rey" },
    onomatopoeia: { en: "BOW DOWN!!", es: "¡¡ARRODÍLLENSE!!" },
    sfx: "ascend",
    accent: "pink",
  },
  {
    num: "08",
    tag: { en: "CH. 07 · GRAND FINALE", es: "CAP. 07 · GRAN FINAL" },
    speaker: { en: "SUNBEAM MINI-GAME", es: "MINIJUEGO SOLAR" },
    line: {
      en: "Help Ramsés stay toasted inside the drifting golden beam for 15 glorious seconds!",
      es: "¡Ayuda a Ramsés a mantenerse tostadito dentro del rayo dorado durante 15 segundos gloriosos!",
    },
    actionLabel: { en: "🎮 Play Finale", es: "🎮 Jugar Final" },
    onomatopoeia: { en: "TOASTY!!", es: "¡¡TOSTADITO!!" },
    sfx: "pop",
    accent: "gold",
  },
];

const UI_TEXT = {
  en: {
    backStudio: "Back to Studio",
    overviewOn: "✕ Close Panel",
    overviewOff: "⊞ Board Overview",
    overviewHint: "Click any comic panel on the board to swoop straight in!",
    soundOn: "Sound On",
    soundOff: "Muted",
    coloredStat: "COLORED",
    colorAllBtn: "⚡ Color All",
    peekTip: "Hover B&W ink to peek color · Click panel to blast",
    prevBtn: "Prev",
    nextBtn: "Next",
    wrinkleCount: "Wrinkle Rubs",
    discoPlayingBtn: "❚❚ Stop 3AM Disco",
    blindsOpenBtn: "☀ Blinds Wide Open",
    valveLabel: "VALVE HEAT",
  },
  es: {
    backStudio: "Volver al Estudio",
    overviewOn: "✕ Ver Viñeta",
    overviewOff: "⊞ Ver Tablero",
    overviewHint: "¡Toca cualquier viñeta del tablero para volar directo a ella!",
    soundOn: "Audio Activo",
    soundOff: "Silencio",
    coloredStat: "A COLOR",
    colorAllBtn: "⚡ Colorear Todo",
    peekTip: "Pasa el cursor en B&N para espiar · Clic para explotar color",
    prevBtn: "Atrás",
    nextBtn: "Seguir",
    wrinkleCount: "Caricias",
    discoPlayingBtn: "❚❚ Parar Disco 3AM",
    blindsOpenBtn: "☀ Persiana Abierta",
    valveLabel: "CALEFACCIÓN",
  },
} as const;

export function RamsesManiaShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const ui = UI_TEXT[lang];

  const [activePanel, setActivePanel] = useState(0);
  const [overviewMode, setOverviewMode] = useState(false);
  const [revealedPanels, setRevealedPanels] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [waveOrigins, setWaveOrigins] = useState<Array<[number, number]>>([
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  const [muted, setMuted] = useState(false);
  const [wrinkleRubs, setWrinkleRubs] = useState(0);
  const [valveTemp, setValveTemp] = useState(19);
  const [discoPlaying, setDiscoPlaying] = useState(false);
  const [shakeNonce, setShakeNonce] = useState(0);
  const [stampBanner, setStampBanner] = useState<{
    id: number;
    text: string;
    accent: "gold" | "pink" | "periwinkle";
  } | null>(null);

  const stampTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLockRef = useRef(0);

  useEffect(() => {
    return () => {
      if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
      disposeRamsesAudio();
    };
  }, []);

  const flashStamp = useCallback(
    (text: string, accent: "gold" | "pink" | "periwinkle") => {
      if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
      setStampBanner({ id: Date.now(), text, accent });
      stampTimerRef.current = setTimeout(() => {
        setStampBanner(null);
      }, 1350);
    },
    []
  );

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      setRamsesMuted(next);
      if (next) {
        setDiscoPlaying(false);
      }
      return next;
    });
  }, []);

  const triggerPanelColor = useCallback(
    (panelIdx: number, uv?: { x: number; y: number }) => {
      if (panelIdx < 0 || panelIdx >= 7) return;
      const ox = uv ? Math.max(0.08, Math.min(0.92, uv.x)) : 0.5;
      const oy = uv ? Math.max(0.08, Math.min(0.92, uv.y)) : 0.5;

      setWaveOrigins((prev) => {
        const next = [...prev];
        next[panelIdx] = [ox, oy];
        return next;
      });
      setRevealedPanels((prev) => {
        if (prev[panelIdx]) return prev;
        const next = [...prev];
        next[panelIdx] = true;
        return next;
      });
    },
    []
  );

  const runPanelInteraction = useCallback(
    (panelIdx: number, uv?: { x: number; y: number }) => {
      const beat = COMIC_BEATS[panelIdx];
      if (!beat) return;

      if (panelIdx === 1) {
        setWrinkleRubs((prev) => {
          const next = Math.min(3, prev + 1);
          playComicSfx("purr");
          if (next >= 2) {
            triggerPanelColor(1, uv ?? { x: 0.52, y: 0.58 });
            flashStamp(beat.onomatopoeia[lang], "pink");
          } else {
            flashStamp(lang === "es" ? "¡BRRR! (1/2)" : "BRRR! (1/2)", "periwinkle");
          }
          return next;
        });
        return;
      }

      if (panelIdx === 2) {
        setValveTemp((prev) => {
          const next = prev >= 35 ? 35 : Math.min(35, prev + 8);
          playComicSfx("valve");
          if (next >= 31) {
            triggerPanelColor(2, uv ?? { x: 0.54, y: 0.45 });
            flashStamp(beat.onomatopoeia[lang], "gold");
          } else {
            flashStamp(`${next}°C…`, "gold");
          }
          return next;
        });
        return;
      }

      if (panelIdx === 3) {
        playComicSfx("crash");
        setShakeNonce((n) => n + 1);
        triggerPanelColor(3, uv ?? { x: 0.72, y: 0.52 });
        flashStamp(beat.onomatopoeia[lang], "periwinkle");
        return;
      }

      if (panelIdx === 5) {
        triggerPanelColor(5, uv ?? { x: 0.5, y: 0.5 });
        setDiscoPlaying((prev) => {
          const next = !prev;
          if (!muted) {
            toggleDiscoLoop(next);
          }
          playComicSfx("beat");
          flashStamp(
            next ? beat.onomatopoeia[lang] : lang === "es" ? "¡PAUSA!" : "PAUSE!",
            "periwinkle"
          );
          return next;
        });
        return;
      }

      if (panelIdx < 7) {
        triggerPanelColor(panelIdx, uv);
        playComicSfx(beat.sfx);
        flashStamp(beat.onomatopoeia[lang], beat.accent);
      }
    },
    [flashStamp, lang, muted, triggerPanelColor]
  );

  const handleStagePanelClick = useCallback(
    (panelIdx: number, uv?: { x: number; y: number }) => {
      if (overviewMode) {
        setOverviewMode(false);
        setActivePanel(panelIdx);
        playComicSfx("whoosh");
        return;
      }
      if (panelIdx !== activePanel) {
        setActivePanel(panelIdx);
        playComicSfx("whoosh");
        return;
      }
      if (panelIdx < 7) {
        runPanelInteraction(panelIdx, uv);
      }
    },
    [activePanel, overviewMode, runPanelInteraction]
  );

  const goToPanel = useCallback(
    (nextIdx: number) => {
      const clamped = Math.max(0, Math.min(7, nextIdx));
      if (clamped !== 5 && discoPlaying) {
        setDiscoPlaying(false);
        toggleDiscoLoop(false);
      }
      setOverviewMode(false);
      if (clamped !== activePanel) {
        setActivePanel(clamped);
        playComicSfx("whoosh");
      }
    },
    [activePanel, discoPlaying]
  );

  const handleColorAll = useCallback(() => {
    setRevealedPanels([true, true, true, true, true, true, true]);
    setWrinkleRubs(3);
    setValveTemp(35);
    playComicSfx("ascend");
    flashStamp(lang === "es" ? "¡FULL COLOR!" : "FULL COLOR POP!", "gold");
  }, [flashStamp, lang]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToPanel(activePanel + 1);
      } else if (e.key === "ArrowLeft") {
        goToPanel(activePanel - 1);
      } else if (e.key === "m" || e.key === "M") {
        setOverviewMode((v) => !v);
        playComicSfx("whoosh");
      } else if (e.key === " " && activePanel < 7 && !overviewMode) {
        e.preventDefault();
        runPanelInteraction(activePanel);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePanel, goToPanel, overviewMode, runPanelInteraction]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (overviewMode || activePanel === 7) return;
      if (Math.abs(e.deltaY) < 32 && Math.abs(e.deltaX) < 32) return;
      const now = performance.now();
      if (now - wheelLockRef.current < 440) return;
      wheelLockRef.current = now;
      if (e.deltaY > 32 || e.deltaX > 32) {
        goToPanel(activePanel + 1);
      } else if (e.deltaY < -32 || e.deltaX < -32) {
        goToPanel(activePanel - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activePanel, goToPanel, overviewMode]);

  const coloredCount = revealedPanels.filter(Boolean).length;
  const activeBeat = COMIC_BEATS[activePanel] ?? COMIC_BEATS[0];
  const isCurrentRevealed =
    activePanel >= 7 ? true : revealedPanels[activePanel];

  return (
    <div className="rm-page">
      <div className="rm-paper-grid" aria-hidden="true" />

      <header className="rm-topbar">
        <div className="rm-topbar-left">
          <Link href="/" className="rm-back-btn">
            <span aria-hidden="true">←</span>
            <span>{ui.backStudio}</span>
          </Link>
        </div>

        <div className="rm-topbar-center">
          <button
            type="button"
            className="rm-brand-btn"
            onClick={() => goToPanel(0)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ramses/ramses-badge.png"
              alt="Ramsés Sphynx mascot"
              className="rm-brand-badge"
            />
            <span className="rm-brand-wordmark">RAMSÉS MANIA</span>
          </button>
        </div>

        <div className="rm-topbar-right">
          <button
            type="button"
            className={`rm-util-btn ${overviewMode ? "is-active" : ""}`}
            onClick={() => {
              setOverviewMode((v) => !v);
              playComicSfx("whoosh");
            }}
            aria-pressed={overviewMode}
          >
            {overviewMode ? ui.overviewOn : ui.overviewOff}
          </button>

          <button
            type="button"
            className={`rm-util-btn ${!muted ? "is-gold" : ""}`}
            onClick={handleToggleMute}
            aria-pressed={!muted}
          >
            {muted ? `🔇 ${ui.soundOff}` : `🔊 ${ui.soundOn}`}
          </button>

          <div className="rm-lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`rm-lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={`rm-lang-btn ${lang === "es" ? "is-active" : ""}`}
              onClick={() => setLang("es")}
              aria-pressed={lang === "es"}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      <main className="rm-stage">
        <RamsesComicStage3D
          activePanel={activePanel}
          overviewMode={overviewMode}
          revealedPanels={revealedPanels}
          waveOrigins={waveOrigins}
          discoPlaying={discoPlaying}
          shakeNonce={shakeNonce}
          reduced={reduced}
          onPanelClick={handleStagePanelClick}
        />

        {stampBanner ? (
          <div
            key={stampBanner.id}
            className={`rm-stamp-burst is-${stampBanner.accent}`}
            role="status"
          >
            {stampBanner.text}
          </div>
        ) : null}

        {overviewMode ? (
          <div className="rm-overview-banner" role="note">
            <span>{ui.overviewHint}</span>
            {coloredCount < 7 ? (
              <button
                type="button"
                className="rm-mini-action"
                onClick={handleColorAll}
              >
                {ui.colorAllBtn}
              </button>
            ) : null}
          </div>
        ) : null}

        {!overviewMode && activePanel === 7 ? (
          <div className="rm-finale-layer">
            <RamsesSunbeamGame
              lang={lang}
              onPlaySfx={playComicSfx}
              onViewBoard={() => setOverviewMode(true)}
              backHref="/"
              backLabel={ui.backStudio}
            />
          </div>
        ) : null}

        {!overviewMode ? (
          <>
            {activePanel > 0 ? (
              <button
                type="button"
                className="rm-nav-arrow is-prev"
                onClick={() => goToPanel(activePanel - 1)}
                aria-label={ui.prevBtn}
              >
                <span aria-hidden="true">←</span>
                <span className="rm-arrow-txt">{ui.prevBtn}</span>
              </button>
            ) : null}

            {activePanel < 7 ? (
              <button
                type="button"
                className="rm-nav-arrow is-next"
                onClick={() => goToPanel(activePanel + 1)}
                aria-label={ui.nextBtn}
              >
                <span className="rm-arrow-txt">{ui.nextBtn}</span>
                <span aria-hidden="true">→</span>
              </button>
            ) : null}
          </>
        ) : null}

        {!overviewMode && activePanel < 7 ? (
          <section
            className={`rm-speech-dock ${isCurrentRevealed ? "is-colored" : ""}`}
            aria-live="polite"
          >
            <div className="rm-speech-bubble">
              <div className="rm-speech-head">
                <span className="rm-speech-tag">{activeBeat.tag[lang]}</span>
                <span className="rm-speech-speaker">{activeBeat.speaker[lang]}</span>
              </div>
              <p className="rm-speech-line">{activeBeat.line[lang]}</p>
              {!isCurrentRevealed ? (
                <p className="rm-peek-hint">{ui.peekTip}</p>
              ) : null}
            </div>

            <div className="rm-panel-controls">
              {activePanel === 2 ? (
                <div className="rm-valve-widget">
                  <div className="rm-valve-readout">
                    <span>{ui.valveLabel}</span>
                    <strong>{valveTemp}°C</strong>
                  </div>
                  <input
                    type="range"
                    min={19}
                    max={35}
                    step={1}
                    value={valveTemp}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setValveTemp(next);
                      playComicSfx("valve");
                      if (next >= 30) {
                        triggerPanelColor(2, { x: 0.54, y: 0.45 });
                        flashStamp(activeBeat.onomatopoeia[lang], "gold");
                      }
                    }}
                    className="rm-valve-slider"
                    aria-label={ui.valveLabel}
                  />
                </div>
              ) : null}

              <button
                type="button"
                className={`rm-comic-btn is-${activeBeat.accent}`}
                onClick={() => runPanelInteraction(activePanel)}
              >
                {activePanel === 1
                  ? `${activeBeat.actionLabel[lang]} (${wrinkleRubs}/3)`
                  : activePanel === 5 && discoPlaying
                    ? ui.discoPlayingBtn
                    : activePanel === 4 && isCurrentRevealed
                      ? ui.blindsOpenBtn
                      : activeBeat.actionLabel[lang]}
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <nav className="rm-bottom-bar" aria-label="Comic panels navigation">
        <div className="rm-meter-pill">
          <span className="rm-meter-dot" aria-hidden="true" />
          <span>
            {coloredCount}/7 {ui.coloredStat}
          </span>
        </div>

        <div className="rm-panel-dots">
          {COMIC_BEATS.map((beat, idx) => {
            const isCur = activePanel === idx && !overviewMode;
            const isCol = idx === 7 ? true : revealedPanels[idx];
            return (
              <button
                key={beat.num}
                type="button"
                className={`rm-dot-btn ${isCur ? "is-active" : ""} ${isCol ? "is-colored" : ""}`}
                onClick={() => goToPanel(idx)}
                aria-label={`${beat.num} — ${beat.tag[lang]}`}
                aria-current={isCur ? "step" : undefined}
              >
                <span>{beat.num}</span>
              </button>
            );
          })}
        </div>

        {coloredCount < 7 ? (
          <button
            type="button"
            className="rm-colorall-btn"
            onClick={handleColorAll}
          >
            {ui.colorAllBtn}
          </button>
        ) : (
          <div className="rm-meter-pill is-complete">★ 35°C SOLAR GOD</div>
        )}
      </nav>
    </div>
  );
}
