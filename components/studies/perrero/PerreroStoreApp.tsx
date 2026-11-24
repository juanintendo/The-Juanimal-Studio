"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FEATURE_STACK,
  PERRERO_SAUCES,
  STREET_REVIEWS,
  WHY_PILLARS,
  type PerreroSauce,
} from "./catalog";
import { PerreroBottleSilhouette, PerreroEmblem } from "./PerreroArtwork";

interface CartItem {
  key: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  qty: number;
  accentHex: string;
  img: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function PerreroStoreApp() {
  const [showPromo, setShowPromo] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [bottleTilt, setBottleTilt] = useState({ x: 0, y: 0 });
  const [activePillar, setActivePillar] = useState(0);

  // Scroll-driven DOM refs (zero React re-renders during scroll)
  const stackRunwayRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLElement>(null);
  const card2Ref = useRef<HTMLElement>(null);
  const card3Ref = useRef<HTMLElement>(null);
  const floatRefs = useRef<Array<HTMLImageElement | null>>([]);
  const whyRunwayRef = useRef<HTMLElement>(null);
  const whyWheelRef = useRef<HTMLDivElement>(null);

  // 3-Pack builder state
  const [packSlots, setPackSlots] = useState<Array<PerreroSauce | null>>([
    PERRERO_SAUCES[0],
    PERRERO_SAUCES[1],
    null,
  ]);

  // Quick-view PDP modal state
  const [modalSauce, setModalSauce] = useState<PerreroSauce | null>(null);
  const [modalOrbit, setModalOrbit] = useState({ x: 0, y: 0 });
  const [modalTab, setModalTab] = useState<"story" | "ingredients">("story");

  // Slide-over Cart Drawer
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      key: "guasacaca-seria",
      title: "GUASACACA SERIA",
      subtitle: "12 OZ · SINGLE BOTTLE",
      unitPrice: 12,
      qty: 1,
      accentHex: "#58C446",
      img: "/images/studies/perrero/bottle-guasacaca.png",
    },
  ]);
  const [checkedOut, setCheckedOut] = useState(false);

  // Club signup state
  const [clubEmail, setClubEmail] = useState("");
  const [clubJoined, setClubJoined] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let lastScrolled = window.scrollY > 90;
    let lastPillar = 0;

    const updateScrollMotion = () => {
      rafId = 0;
      const y = window.scrollY;
      const isScrolled = y > 90;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }

      const vh = window.innerHeight || 900;

      // 1. Sticky Feature Card Stack + Parallax 3D Ingredients
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

        const speeds = [-70, 85, 65, -90, -55, 75];
        floatRefs.current.forEach((el, idx) => {
          if (!el) return;
          const dir = idx % 2 === 0 ? -1 : 1;
          const dy = (p - 0.5) * speeds[idx % speeds.length];
          const rot = dir * (10 + p * 18);
          el.style.transform = `translate3d(0, ${dy}px, 0) rotate(${rot}deg)`;
        });
      }

      // 2. WHY PERRERO Scroll-Driven Rotating Orbital Arc
      if (whyRunwayRef.current && whyWheelRef.current) {
        const rect = whyRunwayRef.current.getBoundingClientRect();
        const span = Math.max(1, rect.height - vh);
        const w = clamp(-rect.top / span, 0, 1);
        const rotDeg = 31 - w * 62; // +31deg (01) -> 0deg (02) -> -31deg (03)
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

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [cart]
  );

  const addBottleToCart = useCallback((sauce: PerreroSauce) => {
    setCheckedOut(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === sauce.id);
      if (existing) {
        return prev.map((i) =>
          i.key === sauce.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          key: sauce.id,
          title: sauce.name,
          subtitle: `${sauce.size} · SINGLE BOTTLE`,
          unitPrice: sauce.price,
          qty: 1,
          accentHex: sauce.accentHex,
          img: sauce.bottleImg,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const assignPackSlot = (sauce: PerreroSauce) => {
    setPackSlots((prev) => {
      const emptyIdx = prev.findIndex((s) => s === null);
      const next = [...prev];
      if (emptyIdx >= 0) {
        next[emptyIdx] = sauce;
      } else {
        next[0] = prev[1];
        next[1] = prev[2];
        next[2] = sauce;
      }
      return next;
    });
  };

  const addPackToCart = () => {
    if (packSlots.some((s) => s === null)) return;
    const chosen = packSlots as PerreroSauce[];
    const key = `3pack-${chosen.map((s) => s.id).join("-")}`;
    const subtitle = chosen.map((s) => s.shortName).join(" + ");
    setCheckedOut(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          title: "CUSTOM 3-PACK BUNDLE",
          subtitle,
          unitPrice: 32,
          qty: 1,
          accentHex: "#F5841F",
          img: chosen[0].bottleImg,
        },
      ];
    });
    setCartOpen(true);
  };

  const updateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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

  const packFull = packSlots.every((s) => s !== null);
  const shipProgress = Math.min(100, (subtotal / 35) * 100);

  return (
    <div>
      {/* ── PROMO BAR ──────────────────────────────────────────── */}
      {showPromo && (
        <div className="pr-promo">
          <button
            type="button"
            onClick={() => scrollToSection("pr-bundle")}
          >
            BUILD YOUR OWN 3-PACK &amp; SAVE $4.00 →
          </button>
          <button
            type="button"
            className="pr-promo-close"
            aria-label="Dismiss promo"
            onClick={() => setShowPromo(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── STICKY MORPHING HEADER ─────────────────────────────── */}
      <header className="pr-header">
        <a
          href="#pr-top"
          className="pr-header-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <PerreroEmblem compact={scrolled} />
        </a>

        {!scrolled ? (
          <div
            role="navigation"
            className="pr-topnav"
            aria-label="Store navigation"
          >
            <a
              href="#pr-shop"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pr-shop");
              }}
            >
              SHOP
            </a>
            <a
              href="#pr-bundle"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pr-bundle");
              }}
            >
              3-PACK
            </a>
            <a
              href="#pr-why"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pr-why");
              }}
            >
              ABOUT
            </a>
            <a
              href="#pr-reviews"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pr-reviews");
              }}
            >
              REVIEWS
            </a>
            <button type="button" onClick={() => setCartOpen(true)}>
              CART({totalItems})
            </button>
          </div>
        ) : (
          <div className="pr-scrolled-actions">
            <button
              type="button"
              className="pr-pill-cta"
              onClick={() => scrollToSection("pr-shop")}
            >
              GET SAUCE
            </button>
            <button
              type="button"
              className="pr-icon-btn"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 7h12l-1.5 11h-9L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {totalItems > 0 && (
                <span className="pr-cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        )}
      </header>

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
          onClick={() => setModalSauce(heroSauce)}
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
          <div
            className="pr-hero-bottle-wrap"
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
          </div>
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
          <button
            type="button"
            className="pr-step-btn"
            onClick={() =>
              setHeroIdx((i) => (i + 1) % PERRERO_SAUCES.length)
            }
          >
            NEXT FLAVOR →
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

      {/* ── STICKY-STACKING FEATURE CARDS + 3D PARALLAX INGREDIENTS ── */}
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
              style={{ left: "6%", top: "14%", width: 138, height: 138 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[1] = el;
              }}
              src="/images/studies/perrero/ing-garlic.png"
              alt=""
              className="pr-float-3d pr-float-far"
              style={{ right: "8%", top: "16%", width: 118, height: 118 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[2] = el;
              }}
              src="/images/studies/perrero/ing-chili.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ right: "6%", top: "48%", width: 132, height: 132 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[3] = el;
              }}
              src="/images/studies/perrero/ing-corn.png"
              alt=""
              className="pr-float-3d pr-float-far"
              style={{ left: "7%", bottom: "14%", width: 126, height: 126 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[4] = el;
              }}
              src="/images/studies/perrero/ing-bacon.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ left: "16%", top: "48%", width: 112, height: 112 }}
            />
            <img
              ref={(el) => {
                floatRefs.current[5] = el;
              }}
              src="/images/studies/perrero/ing-lime.png"
              alt=""
              className="pr-float-3d pr-float-near"
              style={{ right: "14%", bottom: "12%", width: 120, height: 120 }}
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

      {/* ── CHOOSE YOUR WEAPON (5 PERRERO SAUCES) ──────────────── */}
      <section id="pr-shop" className="pr-weapon-section">
        <svg viewBox="0 0 80 30" className="pr-flourish" aria-hidden="true">
          <path
            d="M 8,15 C 20,4 32,26 40,15 C 48,4 60,26 72,15"
            fill="none"
            stroke="#F8F2E2"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="pr-weapon-heading">
          <span className="pr-weapon-top">CHOOSE YOUR</span>
          <span className="pr-weapon-big">WEAPON</span>
        </div>

        <div className="pr-weapon-grid">
          {PERRERO_SAUCES.map((sauce) => (
            <article
              key={sauce.id}
              className="pr-weapon-card"
              style={{ backgroundColor: sauce.cardBgHex }}
            >
              <h3 className="pr-weapon-title">{sauce.name}</h3>

              <div
                className="pr-weapon-img-stage"
                onClick={() => {
                  setModalTab("story");
                  setModalSauce(sauce);
                }}
              >
                <img
                  src={sauce.ingredientImg}
                  alt=""
                  className="pr-weapon-ing-primary"
                />
                <img
                  src={sauce.secondaryIngImg}
                  alt=""
                  className="pr-weapon-ing-secondary"
                />
                <img
                  src={sauce.bottleImg}
                  alt={sauce.name}
                  className="pr-weapon-bottle-img"
                />
              </div>

              <div>
                <div className="pr-weapon-meta">
                  <span>
                    {sauce.heat === 0
                      ? "ZERO HEAT"
                      : `HEAT ${"🔥".repeat(sauce.heat)}`}
                  </span>
                  <span>${sauce.price}.00</span>
                </div>
                <div className="pr-weapon-actions">
                  <button
                    type="button"
                    className="pr-btn-roll"
                    onClick={() => addBottleToCart(sauce)}
                  >
                    <span className="pr-btn-roll-track">
                      <span>+ ADD · ${sauce.price}</span>
                      <span className="pr-btn-roll-alt">SQUEEZE IT →</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="pr-btn-ghost"
                    onClick={() => {
                      setModalTab("story");
                      setModalSauce(sauce);
                    }}
                  >
                    PEEK
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── BUILD YOUR 3-PACK & SAVE $4.00 ─────────────────────── */}
      <section id="pr-bundle" className="pr-bundle-section">
        <div className="pr-bundle-box">
          <div className="pr-bundle-copy">
            <h2>
              BUILD YOUR
              <br />
              <span className="pr-num-box">3</span>PACK &amp;
              <br />
              <span className="pr-outline">SAVE $4.00</span>
            </h2>
            <p className="pr-bundle-sub">
              Pick any 3 Caracas street sauces below. Mix duplicates or stack a
              custom midnight lineup.
            </p>

            <div className="pr-bundle-picker">
              {PERRERO_SAUCES.map((sauce) => (
                <button
                  key={sauce.id}
                  type="button"
                  className="pr-pick-chip"
                  onClick={() => assignPackSlot(sauce)}
                >
                  <span
                    className="pr-pick-dot"
                    style={{ backgroundColor: sauce.accentHex }}
                  />
                  + {sauce.shortName}
                </button>
              ))}
            </div>

            <div className="pr-bundle-cta-row">
              <button
                type="button"
                className="pr-pill-cta"
                disabled={!packFull}
                style={{ opacity: packFull ? 1 : 0.48 }}
                onClick={addPackToCart}
              >
                {packFull
                  ? "ADD 3-PACK TO CART · $32"
                  : "FILL 3 SLOTS TO UNLOCK $4 OFF"}
              </button>
              <div className="pr-bundle-price">
                <del>$36.00</del>
                <strong>$32.00</strong>
              </div>
            </div>
          </div>

          <div className="pr-bundle-halo-stage">
            <div className="pr-bundle-halo-circle" aria-hidden="true" />
            <div className="pr-bundle-trio">
              {packSlots.map((slot, idx) => (
                <div key={idx} className="pr-trio-slot">
                  {slot ? (
                    <>
                      <button
                        type="button"
                        className="pr-trio-remove"
                        aria-label={`Clear slot ${idx + 1}`}
                        onClick={() =>
                          setPackSlots((prev) =>
                            prev.map((s, i) => (i === idx ? null : s))
                          )
                        }
                      >
                        ✕
                      </button>
                      <img
                        src={slot.bottleImg}
                        alt={slot.name}
                        className="pr-trio-bottle-img"
                        onClick={() =>
                          setPackSlots((prev) =>
                            prev.map((s, i) => (i === idx ? null : s))
                          )
                        }
                      />
                    </>
                  ) : (
                    <PerreroBottleSilhouette />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
            alt="Perrero Mascot"
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

      {/* ── REVIEWS (MONUMENTAL LETTERS + 9:16 PLACEHOLDER CARDS) ─ */}
      <section id="pr-reviews" className="pr-reviews-section">
        <h2 className="pr-reviews-giant">REVIEWS</h2>
        <div className="pr-reviews-strip">
          {STREET_REVIEWS.map((rev) => (
            <article key={rev.handle} className="pr-reel-card">
              <div className="pr-reel-handle">
                <i />
                <span>{rev.handle}</span>
                <i />
              </div>

              <div className="pr-reel-frame">
                <div
                  className="pr-reel-glow"
                  style={{
                    background: `radial-gradient(circle at 50% 35%, ${rev.accentHex}, transparent 72%)`,
                  }}
                />
                <img
                  src={rev.bottleImg}
                  alt=""
                  className="pr-reel-bg-bottle"
                />

                <div className="pr-reel-top">
                  <span className="pr-reel-badge">REEL PLACEHOLDER</span>
                  <span className="pr-reel-badge">{rev.duration}</span>
                </div>

                <div className="pr-reel-play" aria-hidden="true">
                  ▶
                </div>

                <div className="pr-reel-bottom">
                  <div className="pr-reel-stars">★★★★★</div>
                  <p className="pr-reel-quote">&ldquo;{rev.quote}&rdquo;</p>
                  <div className="pr-reel-sauce">
                    {rev.sauceName} · {rev.city}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── BOXED CLUB FOOTER ──────────────────────────────────── */}
      <footer className="pr-footer">
        <div className="pr-footer-grid">
          <div className="pr-footer-box" style={{ alignItems: "center" }}>
            <PerreroEmblem />
          </div>

          <div className="pr-footer-box">
            <ul className="pr-footer-links">
              <li>
                <a
                  href="#pr-shop"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pr-shop");
                  }}
                >
                  SHOP SAUCES
                </a>
              </li>
              <li>
                <a
                  href="#pr-bundle"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pr-bundle");
                  }}
                >
                  BUILD A 3-PACK
                </a>
              </li>
              <li>
                <a
                  href="#pr-why"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pr-why");
                  }}
                >
                  CARACAS STORY
                </a>
              </li>
              <li>
                <a
                  href="#pr-reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pr-reviews");
                  }}
                >
                  REVIEWS
                </a>
              </li>
            </ul>
          </div>

          <div className="pr-footer-box pr-footer-club">
            <h3>JOIN THE PERRERO CLUB</h3>
            <p>New flavors. Restocks. Midnight cart recipes. Merch drops.</p>
            {clubJoined ? (
              <p style={{ color: "#58C446", fontWeight: 700, margin: 0 }}>
                ✓ You&apos;re in the midnight club. Watch your inbox.
              </p>
            ) : (
              <form
                className="pr-club-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (clubEmail.trim()) setClubJoined(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email..."
                  value={clubEmail}
                  onChange={(e) => setClubEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>
            )}
          </div>

          <div className="pr-footer-social">
            <a
              href="https://instagram.com/juanintendo"
              target="_blank"
              rel="noreferrer"
              className="pr-social-btn"
            >
              IG
            </a>
            <a href="mailto:juan@fuelorfool.ing" className="pr-social-btn">
              MAIL
            </a>
          </div>
        </div>

        <div className="pr-footer-bottom">
          <span>
            © 2026 Perrero Sauce Co. · E-Commerce Study by The Juanimal Studio
          </span>
          <span>Inspired by Bucks Sauce (Buzzworthy)</span>
        </div>
      </footer>

      {/* ── QUICK-VIEW PDP MODAL WITH CURSOR-REACTIVE 3D INGREDIENT ORBIT ── */}
      {modalSauce && (
        <div className="pr-backdrop" onClick={() => setModalSauce(null)}>
          <div
            className="pr-modal"
            onClick={(e) => e.stopPropagation()}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setModalOrbit({
                x: ((e.clientX - r.left) / r.width - 0.5) * 28,
                y: ((e.clientY - r.top) / r.height - 0.5) * 28,
              });
            }}
          >
            <button
              type="button"
              className="pr-modal-close"
              aria-label="Close product details"
              onClick={() => setModalSauce(null)}
            >
              ✕
            </button>

            <div className="pr-modal-stage">
              {modalSauce.orbitItems.map((orb, idx) => (
                <span
                  key={orb.label}
                  className="pr-orbit-badge"
                  style={{
                    transform: `translate(${
                      orb.x + modalOrbit.x * (idx % 2 === 0 ? 1 : -1)
                    }px, ${
                      orb.y + modalOrbit.y * (idx % 2 === 0 ? 1 : -1)
                    }px)`,
                  }}
                >
                  <img src={orb.img} alt="" />
                  {orb.label}
                </span>
              ))}
              <img
                src={modalSauce.bottleImg}
                alt={modalSauce.name}
                className="pr-modal-bottle-img"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--pr-ui)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--pr-dim)",
                    marginBottom: 6,
                  }}
                >
                  PRODUCT NO.{modalSauce.num} · {modalSauce.size}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--pr-disp)",
                    fontSize: 42,
                    fontWeight: 900,
                    margin: "0 0 6px",
                    lineHeight: 0.94,
                  }}
                >
                  {modalSauce.name}
                </h2>
                <div
                  style={{
                    fontFamily: "var(--pr-ui)",
                    fontWeight: 800,
                    fontSize: 24,
                    color: modalSauce.accentHex,
                    marginBottom: 14,
                  }}
                >
                  ${modalSauce.price}.00
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <button
                    type="button"
                    className="pr-step-btn"
                    style={{
                      background:
                        modalTab === "story" ? "var(--pr-ink)" : "transparent",
                      color:
                        modalTab === "story" ? "var(--pr-bg)" : "var(--pr-ink)",
                    }}
                    onClick={() => setModalTab("story")}
                  >
                    FLAVOR &amp; PAIRINGS
                  </button>
                  <button
                    type="button"
                    className="pr-step-btn"
                    style={{
                      background:
                        modalTab === "ingredients"
                          ? "var(--pr-ink)"
                          : "transparent",
                      color:
                        modalTab === "ingredients"
                          ? "var(--pr-bg)"
                          : "var(--pr-ink)",
                    }}
                    onClick={() => setModalTab("ingredients")}
                  >
                    INGREDIENTS
                  </button>
                </div>

                {modalTab === "story" ? (
                  <>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--pr-dim)",
                        margin: "0 0 14px",
                      }}
                    >
                      {modalSauce.description}
                    </p>
                    <div
                      style={{
                        fontFamily: "var(--pr-ui)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                      }}
                    >
                      BEST ON:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {modalSauce.pairing.map((p) => (
                        <span
                          key={p}
                          style={{
                            border: "1px solid var(--pr-line)",
                            borderRadius: 999,
                            padding: "4px 10px",
                            fontSize: 12,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--pr-dim)",
                      margin: 0,
                    }}
                  >
                    {modalSauce.ingredients}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="pr-pill-cta"
                style={{ width: "100%", padding: "14px 20px" }}
                onClick={() => {
                  const s = modalSauce;
                  setModalSauce(null);
                  addBottleToCart(s);
                }}
              >
                ADD TO CART · ${modalSauce.price}.00
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE-OVER CART DRAWER ─────────────────────────────── */}
      {cartOpen && (
        <div
          className="pr-drawer-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="pr-drawer"
            aria-label="Shopping cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 0,
                flex: 1,
              }}
            >
              <div className="pr-drawer-head">
                <h2>YOUR CART ({totalItems})</h2>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setCartOpen(false)}
                  style={{ fontSize: 18, padding: 6 }}
                >
                  ✕
                </button>
              </div>

              <div className="pr-ship-bar">
                {subtotal >= 35 ? (
                  <span>✓ FREE EXPRESS SHIPPING UNLOCKED!</span>
                ) : (
                  <span>
                    Add <strong>${(35 - subtotal).toFixed(2)}</strong> more for
                    free Caracas Express Shipping
                  </span>
                )}
                <div className="pr-ship-track">
                  <div
                    className="pr-ship-fill"
                    style={{ width: `${shipProgress}%` }}
                  />
                </div>
              </div>

              {cart.length === 0 ? (
                <p
                  style={{
                    color: "var(--pr-dim)",
                    fontSize: 14,
                    marginTop: 20,
                  }}
                >
                  Your cart is empty. Pick a weapon from the Caracas lineup.
                </p>
              ) : (
                <div className="pr-cart-list">
                  {cart.map((item) => (
                    <div key={item.key} className="pr-cart-item">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="pr-cart-thumb"
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--pr-ui)",
                            fontWeight: 800,
                            fontSize: 17,
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--pr-dim)",
                            marginBottom: 6,
                          }}
                        >
                          {item.subtitle}
                        </div>
                        <div className="pr-qty">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.key, -1)}
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.key, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--pr-ui)",
                          fontWeight: 800,
                          fontSize: 18,
                        }}
                      >
                        ${(item.unitPrice * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px dashed var(--pr-line)",
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontFamily: "var(--pr-ui)",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {checkedOut ? (
                <div
                  style={{
                    border: "1px solid #58C446",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 13,
                    color: "#58C446",
                    textAlign: "center",
                  }}
                >
                  ✓ Demo order locked in! No real card charged — e-commerce study
                  verified.
                </div>
              ) : (
                <button
                  type="button"
                  className="pr-pill-cta"
                  style={{ width: "100%", padding: "14px 20px" }}
                  disabled={cart.length === 0}
                  onClick={() => setCheckedOut(true)}
                >
                  CHECKOUT · ${subtotal.toFixed(2)}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
