"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
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
  const trackRef = useRef<HTMLDivElement>(null);

  const nextProject = getNextGalleryProject(project.slug);

  const labels = {
    en: {
      backGallery: "← All Posters",
      role: "Role",
      stack: "Stack",
      year: "Year",
      scrollMore: "SCROLL TO SEE MORE >>>",
      nextLabel: "NEXT PROJECT",
    },
    es: {
      backGallery: "← Todos los Pósters",
      role: "Rol",
      stack: "Motor / Stack",
      year: "Año",
      scrollMore: "HAZ SCROLL PARA VER MÁS >>>",
      nextLabel: "SIGUIENTE PROYECTO",
    },
  }[lang];

  // Translate vertical mouse wheel into smooth horizontal editorial scrolling on desktop
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 860) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.15;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth <= 860) return;
      if (e.key === "ArrowRight") {
        el.scrollBy({ left: 420, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        el.scrollBy({ left: -420, behavior: "smooth" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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
