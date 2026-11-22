"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { GALLERY_PROJECTS, type GalleryProject } from "@/lib/gallery/projects";
import { GalleryHeader } from "./GalleryHeader";
import { ZigZagPreloader } from "./ZigZagPreloader";

const PosterCarousel3D = dynamic(() => import("./PosterCarousel3D"), {
  ssr: false,
});

const COPY = {
  en: {
    scrollHint: "Scroll or drag posters · Click any poster to explore",
    openCase: "OPEN CASE",
    playNow: "LAUNCH TOY ↗",
    gamesBtn: "🎮 Interactive Toys",
    gamesTitle: "PLAYABLE WORLDS & WEB TOYS",
    dragonCard: "Dragon 4-World Morph",
    dragonSub: "/about · Interactive Portal",
    prevAria: "Previous poster",
    nextAria: "Next poster",
  },
  es: {
    scrollHint: "Haz scroll o arrastra · Clic en cualquier póster para explorar",
    openCase: "VER CASO",
    playNow: "ABRIR LIVE ↗",
    gamesBtn: "🎮 Juegos & WebGL",
    gamesTitle: "MUNDOS JUGABLES & TOYS WEB",
    dragonCard: "Dragón 4 Mundos",
    dragonSub: "/about · Portal Interactivo",
    prevAria: "Póster anterior",
    nextAria: "Siguiente póster",
  },
} as const;

export function PosterGalleryHome() {
  const { lang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const router = useRouter();
  const ui = COPY[lang];

  const [ready, setReady] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [jumpRequest, setJumpRequest] = useState<{ idx: number; nonce: number } | null>(null);
  const [toysOpen, setToysOpen] = useState(false);
  const [curtainColor, setCurtainColor] = useState<string | null>(null);

  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const displayIdx = hoverIdx !== null ? hoverIdx : focusIdx;
  const activeProject = GALLERY_PROJECTS[displayIdx] ?? GALLERY_PROJECTS[0];

  const jumpTo = useCallback((nextIdx: number) => {
    const wrapped =
      ((nextIdx % GALLERY_PROJECTS.length) + GALLERY_PROJECTS.length) %
      GALLERY_PROJECTS.length;
    setFocusIdx(wrapped);
    setJumpRequest({ idx: wrapped, nonce: Date.now() + wrapped });
  }, []);

  const openProject = useCallback(
    (project: GalleryProject) => {
      setToysOpen(false);
      if (reduced) {
        router.push(`/poster-work/${project.slug}`);
        return;
      }
      setCurtainColor(project.accentHex);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        router.push(`/poster-work/${project.slug}`);
      }, 260);
    },
    [reduced, router]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        jumpTo(focusIdx + 1);
      } else if (e.key === "ArrowLeft") {
        jumpTo(focusIdx - 1);
      } else if (e.key === "Enter" && document.activeElement === document.body) {
        openProject(activeProject);
      } else if (e.key === "Escape") {
        setToysOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject, focusIdx, jumpTo, openProject]);

  const playableToys = GALLERY_PROJECTS.filter((p) => p.isInteractiveToy);

  return (
    <div className="jd-gallery-root jd-home-page">
      <ZigZagPreloader ready={ready} />

      <GalleryHeader
        active="home"
        tone="paper"
        onBrandClick={() => jumpTo(0)}
      />

      <main className="jd-home-stage">
        <PosterCarousel3D
          projects={GALLERY_PROJECTS}
          jumpRequest={jumpRequest}
          reduced={reduced}
          onFocusChange={setFocusIdx}
          onHoverChange={setHoverIdx}
          onSelectProject={openProject}
          onReady={() => setReady(true)}
        />

        <button
          type="button"
          className="jd-carousel-arrow is-prev"
          onClick={() => jumpTo(focusIdx - 1)}
          aria-label={ui.prevAria}
        >
          ←
        </button>

        <button
          type="button"
          className="jd-carousel-arrow is-next"
          onClick={() => jumpTo(focusIdx + 1)}
          aria-label={ui.nextAria}
        >
          →
        </button>
      </main>

      {toysOpen ? (
        <aside className="jd-toys-popover" aria-label={ui.gamesTitle}>
          <div className="jd-toys-head">
            <span>{ui.gamesTitle}</span>
            <button
              type="button"
              className="jd-toys-close"
              onClick={() => setToysOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div className="jd-toys-grid">
            {playableToys.map((toy) => (
              <Link
                key={toy.slug}
                href={toy.liveHref}
                className="jd-toy-card"
                onClick={() => setToysOpen(false)}
              >
                <span
                  className="jd-toy-swatch"
                  style={{ background: toy.accentHex }}
                />
                <span className="jd-toy-meta">
                  <strong>{toy.title}</strong>
                  <small>{toy.subtitle[lang]}</small>
                </span>
              </Link>
            ))}
            <Link
              href="/about"
              className="jd-toy-card is-dragon"
              onClick={() => setToysOpen(false)}
            >
              <span
                className="jd-toy-swatch"
                style={{ background: "#39B86D" }}
              />
              <span className="jd-toy-meta">
                <strong>{ui.dragonCard}</strong>
                <small>{ui.dragonSub}</small>
              </span>
            </Link>
          </div>
        </aside>
      ) : null}

      <footer className="jd-gallery-dock">
        <div className="jd-dock-left">
          <span
            className="jd-dock-num"
            style={{
              background: activeProject.accentHex,
              color: activeProject.accentTextHex,
            }}
          >
            {activeProject.num} / {GALLERY_PROJECTS.length}
          </span>
          <div className="jd-dock-titles">
            <strong className="jd-dock-title">{activeProject.title}</strong>
            <span className="jd-dock-sub">{activeProject.subtitle[lang]}</span>
          </div>
        </div>

        <div className="jd-dock-dots" aria-label="Poster index">
          {GALLERY_PROJECTS.map((p, idx) => (
            <button
              key={p.slug}
              type="button"
              className={`jd-dot ${displayIdx === idx ? "is-active" : ""}`}
              onClick={() => jumpTo(idx)}
              aria-label={`${p.num} ${p.title}`}
              aria-current={displayIdx === idx ? "true" : undefined}
            />
          ))}
        </div>

        <div className="jd-dock-actions">
          <button
            type="button"
            className={`jd-toys-btn ${toysOpen ? "is-open" : ""}`}
            onClick={() => setToysOpen((v) => !v)}
            aria-expanded={toysOpen}
          >
            {ui.gamesBtn}
          </button>

          <button
            type="button"
            className="jd-open-case-btn"
            onClick={() => openProject(activeProject)}
          >
            {ui.openCase} →
          </button>

          {activeProject.isInteractiveToy ? (
            <Link
              href={activeProject.liveHref}
              className="jd-launch-toy-btn"
            >
              {ui.playNow}
            </Link>
          ) : null}
        </div>
      </footer>

      <p className="jd-scroll-microhint" aria-hidden="true">
        {ui.scrollHint}
      </p>

      {curtainColor ? (
        <div
          className="jd-curtain-wipe"
          style={{ backgroundColor: curtainColor }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
