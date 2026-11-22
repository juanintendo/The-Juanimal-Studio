"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { GALLERY_PROJECTS, type GalleryProject } from "@/lib/gallery/projects";
import { GalleryHeader, ZigZagUnderline } from "./GalleryHeader";
import { ZigZagPreloader } from "./ZigZagPreloader";

const PosterCarousel3D = dynamic(() => import("./PosterCarousel3D"), {
  ssr: false,
});

const COPY = {
  en: {
    openCase: "open case →",
  },
  es: {
    openCase: "ver caso →",
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
  const [captionHover, setCaptionHover] = useState(false);
  const [leavingToAbout, setLeavingToAbout] = useState(false);
  const [jumpRequest, setJumpRequest] = useState<{ idx: number; nonce: number } | null>(null);
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
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject, focusIdx, jumpTo, openProject]);

  const handleAboutClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduced) return;
      e.preventDefault();
      if (leavingToAbout) return;
      setLeavingToAbout(true);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        router.push("/about");
      }, 540);
    },
    [leavingToAbout, reduced, router]
  );

  const showOpenCase = captionHover || hoverIdx !== null;

  return (
    <div className="jd-gallery-root jd-home-page">
      <ZigZagPreloader ready={ready} />

      <GalleryHeader
        active="home"
        tone="paper"
        onBrandClick={() => jumpTo(0)}
        onAboutClick={handleAboutClick}
      />

      <main className="jd-home-stage">
        <PosterCarousel3D
          projects={GALLERY_PROJECTS}
          jumpRequest={jumpRequest}
          reduced={reduced}
          leaving={leavingToAbout}
          onFocusChange={setFocusIdx}
          onHoverChange={setHoverIdx}
          onSelectProject={openProject}
          onReady={() => setReady(true)}
        />
      </main>

      <button
        type="button"
        className={`jd-poster-caption ${showOpenCase ? "is-hovered" : ""} ${
          leavingToAbout ? "is-leaving" : ""
        }`}
        onClick={() => openProject(activeProject)}
        onMouseEnter={() => setCaptionHover(true)}
        onMouseLeave={() => setCaptionHover(false)}
        aria-label={`${activeProject.title} — ${ui.openCase}`}
      >
        <strong className="jd-caption-title">
          {activeProject.title.toLowerCase()}
        </strong>
        <ZigZagUnderline className="jd-caption-zigzag" />
        <span className="jd-caption-morph">
          <span className="jd-caption-slot is-sub">
            {activeProject.subtitle[lang].toLowerCase()}
          </span>
          <span className="jd-caption-slot is-cta">
            {ui.openCase}
          </span>
        </span>
      </button>

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
