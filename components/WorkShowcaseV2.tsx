"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KineticHeading } from "@/components/KineticHeading";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollInflate } from "@/hooks/useScrollInflate";
import { clamp } from "@/lib/motion";

type FilterId = "all" | "launch" | "code" | "animation";

const HEIGHTS = [0.8, 0.8, 0.8, 0.5, 0.28, 0.14, 0.06, 0.02];
const SPANS = HEIGHTS.map(Math.sqrt);
const TOTAL = SPANS.reduce((a, b) => a + b, 0);
const HIT = (SPANS[0] + SPANS[1] + SPANS[2] * 0.62) / TOTAL;

export function WorkShowcaseV2() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  useScrollInflate("[data-inflate]");

  const [filter, setFilter] = useState<FilterId>("all");
  const [molotovMuted, setMolotovMuted] = useState(true);
  const [filmOpen, setFilmOpen] = useState(false);

  const rootRef = useRef<HTMLElement | null>(null);
  const molotovRef = useRef<HTMLVideoElement | null>(null);
  const ioaRowRef = useRef<HTMLElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const reelRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = t.work.items.filter(
    (item) => filter === "all" || item.category === filter
  );

  // Viewport-gated looping for <video data-clip>
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("video[data-clip]")
    );
    if (reduced) {
      videos.forEach((v) => v.pause());
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [filter, reduced]);

  // Scroll-driven bouncing physics ball for Keys to My Heart
  useEffect(() => {
    const ioa = ioaRowRef.current;
    const ball = ballRef.current;
    const reel = reelRef.current;
    if (!ioa || !ball || !reel) return;

    if (reduced) {
      ball.style.opacity = "0";
      return;
    }

    ball.style.opacity = "1";
    let raf = 0;

    const drawBall = () => {
      raf = 0;
      const h = window.innerHeight || 800;
      const r = ioa.getBoundingClientRect();
      if (r.bottom < -100 || r.top > h + 100) return;
      const progress = clamp((h - r.top) / (h + r.height * 0.25), 0, 1);
      const size = ball.offsetWidth || 30;
      const reelRect = reel.getBoundingClientRect();
      const beside = reelRect.left > r.left + r.width * 0.3;
      const wall = beside
        ? Math.max(80, reelRect.left - r.left - size)
        : Math.max(80, r.width - size);
      const after = (progress - HIT) / (1 - HIT);
      const x =
        progress < HIT
          ? wall * (progress / HIT)
          : wall - wall * 0.34 * (1 - Math.pow(1 - after, 2));

      let walked = 0;
      let i = 0;
      while (i < HEIGHTS.length - 1 && progress * TOTAL > walked + SPANS[i]) {
        walked += SPANS[i++];
      }
      const u = clamp((progress * TOTAL - walked) / SPANS[i], 0, 1);
      const k = HEIGHTS[i];
      const arc = 4 * u * (1 - u);
      const energy = Math.min(1, k / 0.8);
      let sy =
        arc < 0.08
          ? 1 - 0.4 * energy * (1 - arc / 0.08)
          : 1 + 0.28 * energy * (1 - arc);
      let sx = 1 / sy;
      let push = 0;
      const smack = clamp(1 - Math.abs(progress - HIT) / 0.02, 0, 1);
      if (smack > 0) {
        sx = 1 - 0.36 * smack;
        sy = 1 / sx;
        push = size * 0.18 * smack;
      }
      const y = -arc * k * Math.min(r.height * 0.42, 160);
      ball.style.transform = `translate(${(x + push).toFixed(1)}px, ${y.toFixed(1)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(drawBall);
    };

    drawBall();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [filter, reduced]);

  const toggleMolotovAudio = () => {
    const vid = molotovRef.current;
    const nextMuted = !molotovMuted;
    setMolotovMuted(nextMuted);
    if (vid) {
      vid.muted = nextMuted;
      if (!nextMuted) vid.play().catch(() => {});
    }
  };

  return (
    <section ref={rootRef} className="wsv2-sec sec-pad" id="work">
      <div className="wsv2-head">
        <div>
          <span className="eyebrow">{t.work.eyebrow}</span>
          <KineticHeading
            as="h2"
            text={t.work.title}
            maxFontPx={72}
            minFontPx={28}
            className="wsv2-section-title"
          />
        </div>

        <div
          className="wsv2-filters"
          role="group"
          aria-label="Filter case studies"
        >
          {t.work.filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`wsv2-filter-btn${filter === f.id ? " is-active" : ""}`}
              onClick={() => setFilter(f.id as FilterId)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wsv2-list">
        {visibleItems.map((item) => {
          const isIoa = item.id === "keys-to-my-heart";
          return (
            <article
              key={item.id}
              ref={isIoa ? ioaRowRef : undefined}
              className={`wsv2-card wsv2-card-${item.id}`}
            >
              {isIoa && (
                <div
                  ref={ballRef}
                  className="wsv2-bouncer"
                  aria-hidden="true"
                />
              )}

              <div className="wsv2-text">
                <span className="wsv2-meta">{item.meta}</span>
                <h3 data-inflate>{item.title}</h3>
                <p className="wsv2-intro">{item.intro}</p>
                {item.paragraphs.map((p, idx) => (
                  <p key={idx} className="wsv2-p">
                    {p}
                  </p>
                ))}

                <dl className="wsv2-facts">
                  {item.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="wsv2-actions">
                  {"externalPrimary" in item && item.externalPrimary ? (
                    <a
                      href={item.primaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-btn wsv2-cta"
                    >
                      {item.primaryLabel}
                    </a>
                  ) : (
                    <Link href={item.primaryHref} className="cta-btn wsv2-cta">
                      {item.primaryLabel}
                    </Link>
                  )}

                  {"secondaryHref" in item && item.secondaryHref && (
                    <a
                      href={item.secondaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wsv2-sec-link"
                    >
                      {item.secondaryLabel}
                    </a>
                  )}

                  {isIoa && (
                    <button
                      type="button"
                      className="wsv2-sec-link wsv2-watch-btn"
                      onClick={() => setFilmOpen(true)}
                    >
                      ▶ {t.work.watchFilm}
                    </button>
                  )}
                </div>
              </div>

              {/* Media Stage obeying Framing Contract: 100% object-fit: contain inside .cel-frame */}
              <div ref={isIoa ? reelRef : undefined} className="wsv2-media">
                {item.id === "vectra-twin" && (
                  <div className="cel-frame cel-video-16x9">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/v3/vectra-twin-core.png"
                      alt="Vectra Twin key-lime isometric digital twin core and orbital telemetry"
                      loading="lazy"
                    />
                  </div>
                )}

                {item.id === "frame-by-agents" && (
                  <div className="wsv2-fba-grid">
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/fba/02c-1930s-ink.webp"
                        alt="1930s ink model sheet"
                        loading="lazy"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/fba/board.webp"
                        alt="Storyboard panels"
                        loading="lazy"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/fba/lab-guide-strip.png"
                        alt="4-pose mannequin strip"
                        loading="lazy"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/fba/lab-walk-onion.jpg"
                        alt="Onion skin registration overlay"
                        loading="lazy"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/fof/page-fba.webp"
                        alt="Frame by Agents scroll-driven sales page"
                        loading="lazy"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/fba/lab-walk-c.gif"
                        alt="8-drawing walk cycle"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {item.id === "fuelorfool" && (
                  <div className="wsv2-duo-video">
                    <div className="cel-frame cel-video-16x9">
                      <video
                        data-clip
                        src="/media/fof/clip-pump.mp4"
                        poster="/media/fof/snake-poster.webp"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="fuelorfool.ing mascot python with brass nozzle"
                      />
                    </div>
                    <div className="cel-frame cel-video-16x9">
                      <video
                        data-clip
                        src="/media/fof/clip-eye.mp4"
                        poster="/media/fof/eye.webp"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Serpent slit-pupil zoom clip"
                      />
                    </div>
                  </div>
                )}

                {item.id === "gta6-saulbass" && (
                  <div className="wsv2-saulbass-stage">
                    <div className="cel-frame cel-video-9x16">
                      <video
                        data-clip
                        src="/media/saulbass/gta6-saulbass.mp4"
                        poster="/media/saulbass/gta6-poster.png"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="GTA VI Saul Bass 9:16 vertical launch film"
                      />
                    </div>
                    <div className="cel-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/saulbass/gta6-contact-sheet.jpg"
                        alt="9-scene contact sheet from GTA VI Saul Bass HyperFrames build"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {item.id === "club-of-the-dead" && (
                  <div className="wsv2-duo-video">
                    <div className="cel-frame cel-video-16x9">
                      <video
                        data-clip
                        src="/media/fof/cine-moon.mp4"
                        poster="/media/fof/cine-moon.webp"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Synthia: Club of the Dead moon leap cinematic test"
                      />
                    </div>
                    <div className="cel-frame cel-video-16x9">
                      <video
                        data-clip
                        src="/media/fof/combat.mp4"
                        poster="/media/fof/combat-poster.webp"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Synthia: Club of the Dead beat-locked combat test"
                      />
                    </div>
                  </div>
                )}

                {item.id === "keys-to-my-heart" && (
                  <div className="cel-frame cel-video-16x9">
                    <video
                      data-clip
                      src="/media/fof/keys-reel.mp4"
                      poster="/media/fof/keys-reel.webp"
                      muted
                      loop
                      playsInline
                      preload="none"
                      onClick={() => setFilmOpen(true)}
                      aria-label="Keys to My Heart animated reel preview"
                    />
                  </div>
                )}

                {item.id === "molotov-love" && (
                  <div className="cel-frame cel-video-16x9 wsv2-single-video">
                    <video
                      ref={molotovRef}
                      data-clip
                      src="/media/fof/molotov-hey.mp4"
                      poster="/media/fof/molotov-hey-poster.webp"
                      muted={molotovMuted}
                      loop
                      playsInline
                      preload="none"
                      aria-label="Molotov Love kinetic typography motion test"
                    />
                    <button
                      type="button"
                      className="wsv2-sound-btn"
                      aria-pressed={!molotovMuted}
                      onClick={toggleMolotovAudio}
                    >
                      {molotovMuted ? t.work.soundOn : t.work.soundOff}
                    </button>
                  </div>
                )}

                {item.id === "minas-house" && (
                  <div className="cel-frame wsv2-single-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/work/case-minas-house-v1.webp"
                      alt="Mina AI Grow House isometric architectural spread"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* On-page YouTube modal for Keys to My Heart */}
      {filmOpen && (
        <div
          className="wsv2-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Keys to My Heart — Full Film"
          onClick={() => setFilmOpen(false)}
        >
          <div
            className="wsv2-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="wsv2-modal-close"
              onClick={() => setFilmOpen(false)}
            >
              {t.work.closeModal} ✕
            </button>
            <div className="wsv2-modal-iframe-wrap">
              <iframe
                src="https://www.youtube-nocookie.com/embed/vcVf8R0YhA0?autoplay=1&rel=0"
                title="Keys to My Heart — The Illusion of Agency"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
