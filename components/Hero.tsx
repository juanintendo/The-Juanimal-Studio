"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function rayPath(i: number): { d: string; opacity: number } {
  const a = i * 15;
  const x1 = 100 + 96 * Math.cos(((a - 3.4) * Math.PI) / 180);
  const y1 = 100 + 96 * Math.sin(((a - 3.4) * Math.PI) / 180);
  const x2 = 100 + 96 * Math.cos(((a + 3.4) * Math.PI) / 180);
  const y2 = 100 + 96 * Math.sin(((a + 3.4) * Math.PI) / 180);
  return {
    d: `M100 100 L${x1} ${y1} L${x2} ${y2} Z`,
    opacity: i % 2 ? 0.9 : 0.5,
  };
}

const STAR_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
  filter: "drop-shadow(3px 4px 0 rgba(23,16,9,.4))",
};

const STARS = ["star-1", "star-2", "star-3", "star-4"] as const;

export function Hero() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const rays = useMemo(
    () => Array.from({ length: 24 }, (_, i) => rayPath(i)),
    []
  );

  const [logoTransform, setLogoTransform] = useState(
    "translateY(0px) scale(1) rotateX(0deg) rotateY(0deg) translateZ(40px)"
  );
  const [burstTransform, setBurstTransform] = useState(
    "translate(-50%,-50%) translateZ(-110px)"
  );

  const targetRef = useRef({ x: 0, y: 0, scroll: 0 });
  const easeRef = useRef({ mx: 0, my: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) return;

    const queue = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const { x: tx, y: ty, scroll: y } = targetRef.current;
        let { mx, my } = easeRef.current;
        mx += (tx - mx) * 0.08;
        my += (ty - my) * 0.08;
        easeRef.current = { mx, my };

        const rotX = Math.min(28, y * 0.04) + my * -6;
        const rotY = Math.sin(y * 0.0022) * 7 + mx * 9;
        const sc = Math.max(0.82, 1 - y / 2800);

        setLogoTransform(
          `translateY(${y * 0.04}px) scale(${sc}) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(40px)`
        );
        setBurstTransform(
          `translate(-50%,-50%) translateZ(-110px) rotate(${y * 0.12}deg)`
        );

        if (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001) {
          queue();
        }
      });
    };

    const onScroll = () => {
      targetRef.current.scroll = window.scrollY;
      queue();
    };
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (finePointer) {
        window.removeEventListener("mousemove", onMove);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <header className="hero hero-editorial" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-eyebrow">{t.hero.eyebrow}</span>
          <h1 className="hero-h1">{t.hero.h1}</h1>
          <p className="hero-subhead">{t.hero.subhead}</p>
          <div className="hero-actions">
            <a className="cta-btn hero-cta-primary" href="#launch-kit">
              {t.hero.ctaPrimary}
            </a>
            <Link className="hero-cta-secondary" href="/contact">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="center-wrap hero-emblem-wrap">
          <div className="depth-ring" aria-hidden="true" />
          <svg
            className="sunburst"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={{ transform: burstTransform }}
          >
            <g fill="#F3E9CE" opacity=".85">
              {rays.map((ray, i) => (
                <path key={i} d={ray.d} opacity={ray.opacity} />
              ))}
            </g>
          </svg>

          <div className="logo-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-logo"
              src="/images/hero-logo.png"
              alt="The Juanimal Studio emblem"
              style={{ transform: logoTransform }}
            />

            {STARS.map((name, i) => (
              <div
                key={name}
                className={`star-anchor sa${i + 1}`}
                aria-hidden="true"
              >
                <div className={`star st${i + 1} star-img`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/${name}.png`} alt="" style={STAR_STYLE} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        {t.hero.scrollCue}
      </div>
    </header>
  );
}
