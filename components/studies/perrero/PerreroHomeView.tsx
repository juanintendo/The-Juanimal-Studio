"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FEATURE_STACK, PERRERO_SAUCES, WHY_PILLARS } from "./catalog";
import {
  PerreroReviewsStrip,
  PerreroThreePackBuilder,
  PerreroWeaponGrid,
} from "./PerreroSections";
import { usePerreroCart } from "./PerreroShell";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function PerreroHomeView() {
  const { addBottleToCart } = usePerreroCart();
  const [heroIdx, setHeroIdx] = useState(0);
  const [bottleTilt, setBottleTilt] = useState({ x: 0, y: 0 });
  const [activePillar, setActivePillar] = useState(0);

  const stackRunwayRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLElement>(null);
  const card2Ref = useRef<HTMLElement>(null);
  const card3Ref = useRef<HTMLElement>(null);
  const floatRefs = useRef<Array<HTMLImageElement | null>>([]);
  const whyRunwayRef = useRef<HTMLElement>(null);
  const whyWheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let lastPillar = 0;

    const updateScrollMotion = () => {
      rafId = 0;
      const vh = window.innerHeight || 900;

      if (stackRunwayRef.current) {
        const rect = stackRunwayRef.current.getBoundingClientRect();
        const span = Math.max(1, rect.height - vh);
        const p = clamp(-rect.top / span, 0, 1);

        const t2 = easeOutCubic(clamp(p / 0.48, 0, 1));
        const t3 = easeOutCubic(clamp((p - 0.5) / 0.48, 0, 1));

        if (card1Ref.current) {
          const s1 = 1 - t2 * 0.045 - t3 * 0.035;
          card1Ref.current.style.transform = `translate3d(0, ${-t2 * 8}px, 0) rotate(${-1.8 - t2 * 0.8}deg) scale(${s1})`;
        }
        if (card2Ref.current) {
          const y2 = (1 - t2) * vh * 0.95 + 10;
          const s2 = 1 - t3 * 0.04;
          card2Ref.current.style.transform = `translate3d(0, ${y2}px, 0) rotate(${2.2 + t3 * 0.6}deg) scale(${s2})`;
        }
        if (card3Ref.current) {
          const y3 = (1 - t3) * vh * 1.05 + 20;
          card3Ref.current.style.transform = `translate3d(0, ${y3}px, 0) rotate(-1.5deg) scale(1)`;
        }

        const speeds = [-75, 90, 70, -95, -60, 80];
        floatRefs.current.forEach((el, idx) => {
          if (!el) return;
          const dir = idx % 2 === 0 ? -1 : 1;
          const dy = (p - 0.5) * speeds[idx % speeds.length];
          const rot = dir * (10 + p * 18);
          el.style.transform = `translate3d(0, ${dy}px, 0) rotate(${rot}deg)`;
        });
      }

      if (whyRunwayRef.current && whyWheelRef.current) {
        const rect = whyRunwayRef.current.getBoundingClientRect();
        const span = Math.max(1, rect.height - vh);
        const w = clamp(-rect.top / span, 0, 1);
        const rotDeg = 31 - w * 62;
        whyWheelRef.current.style.transform = `rotate(${rotDeg}deg)`;

        const nextPillar = w < 0.33 ? 0 : w < 0.67 ? 1 : 2;
        if (nextPillar !== lastPillar) {
          lastPillar = nextPillar;
          setActivePillar(nextPillar);
        }
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateScrollMotion);
    };

    updateScrollMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const heroSauce = PERRERO_SAUCES[heroIdx] ?? PERRERO_SAUCES[0];

  const jumpToPillar = (idx: number) => {
    if (!whyRunwayRef.current) return;
    const top =
      whyRunwayRef.current.getBoundingClientRect().top + window.scrollY;
    const span = Math.max(
      1,
      whyRunwayRef.current.offsetHeight - window.innerHeight
    );
    const ratio = idx === 0 ? 0.02 : idx === 1 ? 0.5 : 0.98;
    window.scrollTo({ top: top + span * ratio, behavior: "smooth" });
  };

  return (
    <>
      {/* ── HERO SECTION ───────────────────────────────────────── */}
      <section id="pr-top" className="pr-hero">
        <h1 className="pr-hero-h1">
          <span className="pr-outline">THE STREET SAUCE</span> THAT
          <br />
          MAKES OTHER SAUCES
          <br />
          INSEC
          <span className="pr-fade-word">
            <span className="pr-fade-1">U</span>
            <span className="pr-fade-2">R</span>
            <span className="pr-fade-3">E</span>
          </span>
        </h1>

        <div className="pr-hero-rule">
          <span className="pr-odometer">
            PRODUCT NO.0
            <span className="pr-odo-window" aria-live="polite">
              <span
                className="pr-odo-reel"
                style={{ transform: `translateY(${-heroIdx * 1.15}em)` }}
              >
                {PERRERO_SAUCES.map((s, i) => (
                  <span key={s.id}>{i + 1}</span>
                ))}
              </span>
            </span>
          </span>
          <span style={{ marginLeft: "auto", color: heroSauce.accentHex }}>
            {heroSauce.name}
          </span>
        </div>

        <div
          className="pr-hero-stage"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
            setBottleTilt({ x: nx, y: ny });
          }}
          onPointerLeave={() => setBottleTilt({ x: 0, y: 0 })}
        >
          <div
            className="pr-hero-halo"
            style={{
              backgroundColor: heroSauce.accentHex,
              transform: `translate(${bottleTilt.x * -10}px, ${
                bottleTilt.y * -10
              }px) scale(1.02)`,
            }}
          />
          <img
            src={heroSauce.ingredientImg}
            alt=""
            className="pr-hero-ing-peek"
            style={{
              transform: `translate(${bottleTilt.x * -18}px, ${
                bottleTilt.y * -14
              }px) rotate(${12 + bottleTilt.x * 6}deg)`,
            }}
          />
          <Link
            href={`/studies/perrero/shop/${heroSauce.slug}`}
            className="pr-hero-bottle-wrap"
            aria-label={`Explore ${heroSauce.name}`}
            style={{
              transform: `translate(${bottleTilt.x * 12}px, ${
                bottleTilt.y * 8
              }px) rotate(${bottleTilt.x * 5.5}deg)`,
            }}
          >
            <img
              src={heroSauce.bottleImg}
              alt={heroSauce.name}
              className="pr-hero-bottle-img"
            />
          </Link>
        </div>

        <div className="pr-hero-controls">
          <button
            type="button"
            className="pr-step-btn"
            onClick={() =>
              setHeroIdx(
                (i) => (i - 1 + PERRERO_SAUCES.length) % PERRERO_SAUCES.length
              )
            }
          >
            ← PREV FLAVOR
          </button>
          <button
            type="button"
            className="pr-pill-cta"
            onClick={() => addBottleToCart(heroSauce)}
          >
            ADD {heroSauce.shortName} · ${heroSauce.price}
          </button>
          <Link
            href={`/studies/perrero/shop/${heroSauce.slug}`}
            className="pr-step-btn"
          >
            EXPLORE BOTTLE →
          </Link>
          <button
            type="button"
            className="pr-step-btn"
            onClick={() =>
              setHeroIdx((i) => (i + 1) % PERRERO_SAUCES.length)
            }
          >
            NEXT →
          </button>
        </div>

        <div className="pr-hero-dots" aria-label="Select hero sauce">
          {PERRERO_SAUCES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show ${s.name}`}
              className={`pr-hero-dot ${idx === heroIdx ? "active" : ""}`}
              style={{ backgroundColor: s.accentHex }}
              onClick={() => setHeroIdx(idx)}
            />
          ))}
        </div>
      </section>

      {/* ── STICKY-STACKING FEATURE CARDS + FLOATING INGREDIENTS ── */}
      <section
        ref={stackRunwayRef}
        className="pr-stack-runway"
        aria-label="Sauce standards"
      >
        <div className="pr-stack-sticky">
          <div className="pr-float-layer" aria-hidden="true">
            <img
              ref={(el) => {
                floatRefs.current[0] = el;
              }}
              src="/images/studies/perrero/ing-avocado.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ left: "5%", top: "12%", width: 175, height: 175 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[1] = el;
              }}
              src="/images/studies/perrero/ing-garlic.png"
              alt=""
              className="pr-float-3d pr-float-far"
              style={{ right: "7%", top: "14%", width: 155, height: 155 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[2] = el;
              }}
              src="/images/studies/perrero/ing-chili.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ right: "5%", top: "48%", width: 165, height: 165 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[3] = el;
              }}
              src="/images/studies/perrero/ing-corn.png"
              alt=""
              className="pr-float-3d pr-float-far"
              style={{ left: "6%", bottom: "12%", width: 165, height: 165 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[4] = el;
              }}
              src="/images/studies/perrero/ing-bacon.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ left: "14%", top: "46%", width: 150, height: 150 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[5] = el;
              }}
              src="/images/studies/perrero/ing-lime.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ right: "12%", bottom: "10%", width: 155, height: 155 }}
            />
          </div>

          <div className="pr-stack-deck">
            {FEATURE_STACK.map((feat, idx) => {
              const cardRef =
                idx === 0 ? card1Ref : idx === 1 ? card2Ref : card3Ref;
              return (
                <article
                  key={feat.id}
                  ref={cardRef}
                  className="pr-feature-card"
                  style={{ zIndex: idx + 1 }}
                >
                  <div className="pr-feature-head">
                    <i />
                    <span>{feat.title}</span>
                    <i />
                  </div>
                  <div className="pr-feature-body">
                    <svg
                      width="62"
                      height="62"
                      viewBox="0 0 54 54"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="27"
                        cy="27"
                        r="23"
                        stroke="#F8F2E2"
                        strokeWidth="1.6"
                      />
                      <line
                        x1="11"
                        y1="43"
                        x2="43"
                        y2="11"
                        stroke="#F4B942"
                        strokeWidth="1.8"
                      />
                    </svg>
                    <p>{feat.copy}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PerreroWeaponGrid />
      <PerreroThreePackBuilder />

      {/* ── WHY PERRERO (SCROLL-DRIVEN ROTATING ORBITAL ARC) ────── */}
      <section
        id="pr-why"
        ref={whyRunwayRef}
        className="pr-why-runway"
        aria-label="Why Perrero Sauce"
      >
        <div className="pr-why-sticky">
          <svg viewBox="0 0 800 175" className="pr-arch-svg" aria-hidden="true">
            <defs>
              <path id="pr-why-arch" d="M 55,156 Q 400,18 745,156" />
            </defs>
            <text
              fill="#F8F2E2"
              fontSize="68"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="var(--font-pr-disp), Impact, sans-serif"
            >
              <textPath
                href="#pr-why-arch"
                startOffset="50%"
                textAnchor="middle"
              >
                WHY PERRERO SAUCE
              </textPath>
            </text>
          </svg>

          <p className="pr-why-lede">
            WE MAKE SMALL-BATCH CARACAS STREET SAUCE BECAUSE SUPERMARKET SQUEEZE
            BOTTLES TASTE LIKE SADNESS.{" "}
            <strong>WE&apos;RE ENDING BORING CONDIMENTS.</strong>
          </p>

          <img
            src="/images/studies/perrero/ing-mascot-garlic.png"
            alt="Perrero Garlic Mascot"
            className="pr-why-mascot"
          />

          <div ref={whyWheelRef} className="pr-why-wheel">
            {WHY_PILLARS.map((pillar, idx) => {
              const angle = (idx - 1) * 31;
              const isCurrent = activePillar === idx;
              return (
                <div
                  key={pillar.num}
                  className="pr-wheel-node"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    opacity: isCurrent ? 1 : 0.56,
                  }}
                >
                  <span className="pr-orbit-num">{pillar.num}</span>
                  <span className="pr-orbit-pill">• {pillar.badge} •</span>
                  <p>{pillar.copy}</p>
                </div>
              );
            })}
          </div>

          <div className="pr-why-dots">
            {WHY_PILLARS.map((p, idx) => (
              <button
                key={p.num}
                type="button"
                className={`pr-why-dot-btn ${
                  activePillar === idx ? "active" : ""
                }`}
                onClick={() => jumpToPillar(idx)}
              >
                {p.num}
              </button>
            ))}
          </div>
        </div>
      </section>

      <PerreroReviewsStrip />
    </>
  );
}
