"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FEATURE_STACK,
  PERRERO_SAUCES,
  STREET_REVIEWS,
  WHY_PILLARS,
  type PerreroSauce,
} from "./catalog";
import { PerreroBottle, PerreroEmblem } from "./PerreroArtwork";

interface CartItem {
  key: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  qty: number;
  accentHex: string;
}

export default function PerreroStoreApp() {
  const [showPromo, setShowPromo] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [bottleTilt, setBottleTilt] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

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
      key: "guasacaca",
      title: "GUASACACA VERDE",
      subtitle: "12 OZ · SINGLE BOTTLE",
      unitPrice: 12,
      qty: 1,
      accentHex: "#4E8A2E",
    },
  ]);
  const [checkedOut, setCheckedOut] = useState(false);

  // Club signup state
  const [clubEmail, setClubEmail] = useState("");
  const [clubJoined, setClubJoined] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 90);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          accentHex: "#D97E1A",
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
          <div role="navigation" className="pr-topnav" aria-label="Store navigation">
            <a href="#pr-shop" onClick={(e) => { e.preventDefault(); scrollToSection("pr-shop"); }}>
              SHOP
            </a>
            <a href="#pr-bundle" onClick={(e) => { e.preventDefault(); scrollToSection("pr-bundle"); }}>
              3-PACK
            </a>
            <a href="#pr-why" onClick={(e) => { e.preventDefault(); scrollToSection("pr-why"); }}>
              ABOUT
            </a>
            <a href="#pr-reviews" onClick={(e) => { e.preventDefault(); scrollToSection("pr-reviews"); }}>
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
              🛒
              {totalItems > 0 && <span className="pr-cart-badge">{totalItems}</span>}
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
          <span>PRODUCT NO.{heroSauce.num}</span>
          <span style={{ marginLeft: "auto" }}>{heroSauce.name}</span>
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
              transform: `translate(${bottleTilt.x * -10}px, ${bottleTilt.y * -10}px) scale(1.02)`,
            }}
          />
          <div
            className="pr-hero-bottle-wrap"
            style={{
              transform: `translate(${bottleTilt.x * 12}px, ${bottleTilt.y * 8}px) rotate(${
                bottleTilt.x * 5.5
              }deg)`,
            }}
          >
            <PerreroBottle sauce={heroSauce} />
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
      </section>

      {/* ── SCROLL-TILTED FEATURE STACK ────────────────────────── */}
      <section className="pr-stack-section" aria-label="Sauce standards">
        <div className="pr-float-layer" aria-hidden="true">
          <span
            className="pr-float-item"
            style={{
              left: "8%",
              top: "14%",
              transform: `translateY(${(scrollY * 0.06) % 40}px) rotate(-14deg)`,
            }}
          >
            🥑
          </span>
          <span
            className="pr-float-item"
            style={{
              right: "10%",
              top: "20%",
              transform: `translateY(${(-scrollY * 0.05) % 40}px) rotate(18deg)`,
            }}
          >
            🌶️
          </span>
          <span
            className="pr-float-item"
            style={{
              left: "12%",
              bottom: "16%",
              transform: `translateY(${(-scrollY * 0.04) % 35}px) rotate(12deg)`,
            }}
          >
            🧄
          </span>
          <span
            className="pr-float-item"
            style={{
              right: "11%",
              bottom: "14%",
              transform: `translateY(${(scrollY * 0.05) % 35}px) rotate(-18deg)`,
            }}
          >
            🌽
          </span>
        </div>

        <div className="pr-stack-list">
          {FEATURE_STACK.map((feat) => (
            <article key={feat.id} className="pr-feature-card">
              <div className="pr-feature-head">
                <i />
                <span>{feat.title}</span>
                <i />
              </div>
              <div className="pr-feature-body">
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="27"
                    cy="27"
                    r="23"
                    stroke="#F5E4C7"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="11"
                    y1="43"
                    x2="43"
                    y2="11"
                    stroke="#F5E4C7"
                    strokeWidth="1.5"
                  />
                </svg>
                <p>{feat.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CHOOSE YOUR WEAPON (5 PERRERO SAUCES) ──────────────── */}
      <section id="pr-shop" className="pr-weapon-section">
        <div className="pr-weapon-heading">
          <span className="pr-weapon-top">CHOOSE YOUR</span>
          <span className="pr-weapon-big">WEAPON</span>
        </div>

        <div className="pr-weapon-grid">
          {PERRERO_SAUCES.map((sauce) => (
            <article
              key={sauce.id}
              className="pr-weapon-card"
              style={{ backgroundColor: sauce.accentHex }}
            >
              <h3 className="pr-weapon-title">{sauce.name}</h3>

              <div
                className="pr-weapon-img"
                onClick={() => {
                  setModalTab("story");
                  setModalSauce(sauce);
                }}
              >
                <PerreroBottle sauce={sauce} />
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
                    className="pr-btn-dark"
                    onClick={() => addBottleToCart(sauce)}
                  >
                    + ADD
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
          <div className="pr-bundle-top">
            <div>
              <h2>BUILD YOUR 3-PACK &amp; SAVE $4.00</h2>
              <p style={{ margin: "8px 0 0", color: "var(--pr-dim)", fontSize: 14 }}>
                Pick any 3 Caracas street sauces below. Mix duplicates or go full lineup.
              </p>
            </div>
            <div className="pr-bundle-price">
              <del>$36.00</del>
              <strong>$32.00</strong>
            </div>
          </div>

          <div className="pr-bundle-slots">
            {packSlots.map((slot, idx) => (
              <div key={idx} className="pr-slot">
                {slot ? (
                  <>
                    <button
                      type="button"
                      className="pr-slot-clear"
                      aria-label={`Clear slot ${idx + 1}`}
                      onClick={() =>
                        setPackSlots((prev) =>
                          prev.map((s, i) => (i === idx ? null : s))
                        )
                      }
                    >
                      ✕ REMOVE
                    </button>
                    <PerreroBottle sauce={slot} />
                    <span className="pr-slot-label">{slot.shortName}</span>
                  </>
                ) : (
                  <span style={{ color: "var(--pr-dim)", fontSize: 12, letterSpacing: "0.1em" }}>
                    SLOT 0{idx + 1} · PICK A SAUCE BELOW
                  </span>
                )}
              </div>
            ))}
          </div>

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

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="pr-pill-cta"
              disabled={!packFull}
              style={{ opacity: packFull ? 1 : 0.45 }}
              onClick={addPackToCart}
            >
              {packFull
                ? "ADD CUSTOM 3-PACK TO CART · $32.00"
                : "FILL ALL 3 SLOTS TO UNLOCK $4 OFF"}
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY PERRERO (ARCHED SVG + ORBITAL 01 / 02 / 03) ────── */}
      <section id="pr-why" className="pr-why-section">
        <svg viewBox="0 0 800 180" className="pr-arch-svg" aria-hidden="true">
          <defs>
            <path id="pr-why-arch" d="M 55,160 Q 400,20 745,160" />
          </defs>
          <text
            fill="#F5E4C7"
            fontSize="68"
            letterSpacing="2"
            fontFamily="var(--font-pr-disp), Impact, sans-serif"
          >
            <textPath href="#pr-why-arch" startOffset="50%" textAnchor="middle">
              WHY PERRERO SAUCE
            </textPath>
          </text>
        </svg>

        <p className="pr-why-lede">
          WE MAKE SMALL-BATCH STREET SAUCE BECAUSE SUPERMARKET SQUEEZE BOTTLES
          TASTE LIKE SADNESS.{" "}
          <strong>WE&apos;RE ENDING BORING CONDIMENTS.</strong>
        </p>

        <div className="pr-orbit-grid">
          {WHY_PILLARS.map((pillar) => (
            <div key={pillar.num} className="pr-orbit-item">
              <span className="pr-orbit-num">{pillar.num}</span>
              <span className="pr-orbit-pill">• {pillar.badge} •</span>
              <p>{pillar.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STREET REVIEWS ─────────────────────────────────────── */}
      <section id="pr-reviews" className="pr-reviews-section">
        <h2 className="pr-reviews-title">STREET REVIEWS</h2>
        <div className="pr-reviews-grid">
          {STREET_REVIEWS.map((rev) => (
            <article key={rev.author} className="pr-review-card">
              <div>
                <div style={{ marginBottom: 10, fontSize: 13 }}>★★★★★</div>
                <p>&ldquo;{rev.quote}&rdquo;</p>
              </div>
              <div className="pr-review-meta">
                {rev.author} · {rev.city}
                <br />
                {rev.sauce}
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
                <a href="#pr-shop" onClick={(e) => { e.preventDefault(); scrollToSection("pr-shop"); }}>
                  SHOP SAUCES
                </a>
              </li>
              <li>
                <a href="#pr-bundle" onClick={(e) => { e.preventDefault(); scrollToSection("pr-bundle"); }}>
                  BUILD A 3-PACK
                </a>
              </li>
              <li>
                <a href="#pr-why" onClick={(e) => { e.preventDefault(); scrollToSection("pr-why"); }}>
                  CARACAS STORY
                </a>
              </li>
              <li>
                <a href="#pr-reviews" onClick={(e) => { e.preventDefault(); scrollToSection("pr-reviews"); }}>
                  REVIEWS
                </a>
              </li>
            </ul>
          </div>

          <div className="pr-footer-box pr-footer-club">
            <h3>JOIN THE PERRERO CLUB</h3>
            <p>New flavors. Restocks. Midnight cart recipes. Merch drops.</p>
            {clubJoined ? (
              <p style={{ color: "#82C341", fontWeight: 700, margin: 0 }}>
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
            <a
              href="mailto:juan@fuelorfool.ing"
              className="pr-social-btn"
            >
              MAIL
            </a>
          </div>
        </div>

        <div className="pr-footer-bottom">
          <span>© 2026 Perrero Sauce Co. · E-Commerce Study by The Juanimal Studio</span>
          <span>Inspired by Bucks Sauce (Buzzworthy)</span>
        </div>
      </footer>

      {/* ── QUICK-VIEW PDP MODAL WITH CURSOR-REACTIVE INGREDIENT ORBIT ── */}
      {modalSauce && (
        <div
          className="pr-backdrop"
          onClick={() => setModalSauce(null)}
        >
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
                    }px, ${orb.y + modalOrbit.y * (idx % 2 === 0 ? 1 : -1)}px)`,
                  }}
                >
                  {orb.emoji} {orb.label}
                </span>
              ))}
              <PerreroBottle sauce={modalSauce} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--pr-dim)", marginBottom: 6 }}>
                  PRODUCT NO.{modalSauce.num} · {modalSauce.size}
                </div>
                <h2 style={{ fontFamily: "var(--pr-disp)", fontSize: 38, fontWeight: 400, margin: "0 0 8px", lineHeight: 0.96 }}>
                  {modalSauce.name}
                </h2>
                <div style={{ fontFamily: "var(--pr-disp)", fontSize: 24, marginBottom: 14 }}>
                  ${modalSauce.price}.00
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <button
                    type="button"
                    className="pr-step-btn"
                    style={{
                      background: modalTab === "story" ? "var(--pr-cream)" : "transparent",
                      color: modalTab === "story" ? "var(--pr-bg)" : "var(--pr-cream)",
                    }}
                    onClick={() => setModalTab("story")}
                  >
                    FLAVOR &amp; PAIRINGS
                  </button>
                  <button
                    type="button"
                    className="pr-step-btn"
                    style={{
                      background: modalTab === "ingredients" ? "var(--pr-cream)" : "transparent",
                      color: modalTab === "ingredients" ? "var(--pr-bg)" : "var(--pr-cream)",
                    }}
                    onClick={() => setModalTab("ingredients")}
                  >
                    INGREDIENTS
                  </button>
                </div>

                {modalTab === "story" ? (
                  <>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--pr-dim)", margin: "0 0 14px" }}>
                      {modalSauce.description}
                    </p>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>
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
                            fontSize: 11,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--pr-dim)", margin: 0 }}>
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
            <div className="pr-drawer-head">
              <h2>YOUR STASH ({totalItems})</h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="pr-ship-bar">
              <span>
                {subtotal >= 35
                  ? "✓ Free US & EU express shipping unlocked!"
                  : `Add $${(35 - subtotal).toFixed(2)} more for free shipping`}
              </span>
              <div className="pr-ship-track">
                <div
                  className="pr-ship-fill"
                  style={{ width: `${shipProgress}%` }}
                />
              </div>
            </div>

            <div className="pr-drawer-items">
              {cart.length === 0 ? (
                <p style={{ color: "var(--pr-dim)", fontSize: 14 }}>
                  Your cart is empty. Add a bottle or build a 3-pack!
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.key} className="pr-cart-row">
                    <div>
                      <div style={{ fontFamily: "var(--pr-disp)", fontSize: 17 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--pr-dim)", marginTop: 2 }}>
                        {item.subtitle}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                        ${(item.unitPrice * item.qty).toFixed(2)}
                      </div>
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
                ))
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--pr-line)", paddingTop: 16, marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {checkedOut ? (
                <div style={{ padding: 12, borderRadius: 8, background: "#244714", fontSize: 13, textAlign: "center" }}>
                  ✓ Demo order queued! Ready to wire to Stripe / Shopify Storefront API.
                </div>
              ) : (
                <button
                  type="button"
                  className="pr-pill-cta"
                  disabled={cart.length === 0}
                  style={{ width: "100%", padding: "14px 20px", opacity: cart.length ? 1 : 0.4 }}
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
