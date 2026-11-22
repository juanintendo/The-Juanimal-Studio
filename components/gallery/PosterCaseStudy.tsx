"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  getNextGalleryProject,
  type GalleryProject,
} from "@/lib/gallery/projects";
import { GalleryHeader, ZigZagUnderline } from "./GalleryHeader";

interface PosterCaseStudyProps {
  project: GalleryProject;
}

export function PosterCaseStudy({ project }: PosterCaseStudyProps) {
  const { lang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const nextProject = getNextGalleryProject(project.slug);

  const labels = {
    en: {
      backGallery: "← All Posters",
      role: "Role",
      stack: "Stack",
      year: "Year",
      scrollMore: "SCROLL OR DRAG TO SEE MORE >>>",
      nextLabel: "NEXT PROJECT",
    },
    es: {
      backGallery: "← Todos los Pósters",
      role: "Rol",
      stack: "Motor / Stack",
      year: "Año",
      scrollMore: "HAZ SCROLL O ARRASTRA >>>",
      nextLabel: "SIGUIENTE PROYECTO",
    },
  }[lang];

  // Smooth inertial rAF horizontal scroll + drag-to-scroll on desktop/tablet
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let targetX = el.scrollLeft;
    let currentX = el.scrollLeft;
    let isDragging = false;
    let pointerId: number | null = null;
    let dragLastX = 0;
    let dragLastT = 0;
    let dragMoved = 0;
    let dragVel = 0;
    let suppressNextClick = false;
    let rafId = 0;
    let prevNow = performance.now();

    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);
    const clampTarget = (v: number) => Math.max(0, Math.min(maxScroll(), v));

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      if (window.innerWidth > 860 && !isDragging) {
        const lerpAlpha = reduced ? 1 : Math.min(1, dt * 9.5);
        currentX = currentX + (targetX - currentX) * lerpAlpha;
        if (Math.abs(targetX - currentX) < 0.25) {
          currentX = targetX;
        }
        el.scrollLeft = currentX;
      } else if (!isDragging) {
        currentX = el.scrollLeft;
        targetX = el.scrollLeft;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 860) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      targetX = clampTarget(targetX + delta * 1.2);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (window.innerWidth <= 860 || e.pointerType === "touch") return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest("a, button, video, input, select")) return;
      isDragging = true;
      pointerId = e.pointerId;
      dragLastX = e.clientX;
      dragLastT = performance.now();
      dragMoved = 0;
      dragVel = 0;
      currentX = el.scrollLeft;
      targetX = el.scrollLeft;
      el.classList.add("is-dragging");
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
      const nowMs = performance.now();
      const dtMs = Math.max(4, nowMs - dragLastT);
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragLastT = nowMs;
      dragMoved += Math.abs(dx);
      const next = clampTarget(el.scrollLeft - dx);
      el.scrollLeft = next;
      currentX = next;
      targetX = next;
      const instVel = -dx / (dtMs * 0.001);
      dragVel = dragVel * 0.55 + instVel * 0.45;
    };

    const stopDrag = (e: PointerEvent) => {
      if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
      isDragging = false;
      pointerId = null;
      el.classList.remove("is-dragging");
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (dragMoved > 8) {
        suppressNextClick = true;
        targetX = clampTarget(el.scrollLeft + dragVel * 0.22);
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth <= 860) return;
      if (e.key === "ArrowRight") {
        targetX = clampTarget(targetX + 460);
      } else if (e.key === "ArrowLeft") {
        targetX = clampTarget(targetX - 460);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", stopDrag);
    el.addEventListener("pointercancel", stopDrag);
    el.addEventListener("click", onClickCapture, true);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", stopDrag);
      el.removeEventListener("pointercancel", stopDrag);
      el.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [reduced]);

  return (
    <div className="jd-gallery-root jd-case-page">
      <GalleryHeader
        active="case"
        tone="paper"
      />

      <div ref={trackRef} className="jd-case-track">
        {/* Panel 1: Hero Archival Poster Frame */}
        <section className="jd-case-poster-panel">
          <Link href="/" className="jd-case-back-pill">
            {labels.backGallery}
          </Link>
          <div className="jd-case-poster-frame">
            {project.posterVideoSrc ? (
              <video
                src={project.posterVideoSrc}
                poster={project.posterSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label={project.title}
                className="jd-case-poster-img"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.posterSrc}
                alt={project.title}
                className="jd-case-poster-img"
              />
            )}
          </div>
        </section>

        {/* Panel 2: Full-Height Signature-Color Editorial Column */}
        <section
          className="jd-case-info-col"
          style={{
            backgroundColor: project.accentHex,
            color: project.accentTextHex,
          }}
        >
          <span className="jd-case-num">CASE STUDY #{project.num}</span>
          <h1 className="jd-case-title">{project.title}</h1>
          <p className="jd-case-subtitle">{project.subtitle[lang]}</p>

          <p className="jd-case-summary">{project.summary[lang]}</p>

          <ZigZagUnderline className="jd-case-zigzag" />

          {project.liveExternal ? (
            <a
              href={project.liveHref}
              target="_blank"
              rel="noreferrer"
              className="jd-case-live-pill"
            >
              {project.liveLabel[lang]}
            </a>
          ) : (
            <Link
              href={project.liveHref}
              className="jd-case-live-pill"
            >
              {project.liveLabel[lang]}
            </Link>
          )}

          <dl className="jd-case-credits">
            <div>
              <dt>{labels.role}</dt>
              <dd>{project.role[lang]}</dd>
            </div>
            <div>
              <dt>{labels.stack}</dt>
              <dd>{project.stack}</dd>
            </div>
            <div>
              <dt>{labels.year}</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </section>

        {/* Panel 3+: Real Framed Showcase Frames & Narrative Notes */}
        <section className="jd-case-story-strip">
          {project.storyParagraphs[lang].map((para, i) => (
            <article key={i} className="jd-case-note-card">
              <span className="jd-note-idx">0{i + 1}</span>
              <p>{para}</p>
            </article>
          ))}

          {project.galleryFrames.map((frame, i) => (
            <figure key={frame.src + i} className="jd-case-media-card">
              <div className="jd-case-media-box">
                {frame.videoSrc ? (
                  <video
                    src={frame.videoSrc}
                    poster={frame.src}
                    controls
                    playsInline
                    loop
                    muted
                    autoPlay
                    preload="metadata"
                    aria-label={frame.caption[lang]}
                    className="jd-case-media-video"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={frame.src}
                    alt={frame.caption[lang]}
                    className="jd-case-media-img"
                  />
                )}
              </div>
              <figcaption>{frame.caption[lang]}</figcaption>
            </figure>
          ))}
        </section>

        {/* Final Next Project Editorial Tile */}
        <section className="jd-case-next-tile">
          <span className="jd-next-eyebrow">{labels.nextLabel}</span>
          <Link
            href={`/poster-work/${nextProject.slug}`}
            className="jd-next-card"
            style={{ backgroundColor: nextProject.accentHex, color: nextProject.accentTextHex }}
          >
            <div className="jd-next-thumb-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nextProject.posterSrc}
                alt={nextProject.title}
                className="jd-next-thumb-img"
              />
            </div>
            <strong>
              {nextProject.num} · {nextProject.title} →
            </strong>
          </Link>
        </section>
      </div>

      <span className="jd-case-scroll-cue" aria-hidden="true">
        {labels.scrollMore}
      </span>
    </div>
  );
}
