"use client";

import Link from "next/link";
import { MUSEUM_CHAPTERS } from "./catalog";

function DottedArrow({ darkBg = false }: { darkBg?: boolean }) {
  return (
    <span className={`a2g-arrow-badge ${darkBg ? "on-dark" : "on-light"}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="4" cy="3" r="1.3" fill="currentColor" />
        <circle cx="7" cy="5" r="1.3" fill="currentColor" />
        <circle cx="10" cy="7" r="1.3" fill="currentColor" />
        <circle cx="7" cy="9" r="1.3" fill="currentColor" />
        <circle cx="4" cy="11" r="1.3" fill="currentColor" />
      </svg>
    </span>
  );
}

function MiniBadgeIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "corn":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <ellipse cx="14" cy="13" rx="6.5" ry="9" fill="#F7C311" stroke="#000" strokeWidth="1.8" />
          <path d="M9 10h10M9 14h10M10 18h8" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 18c-2 2-2 5 0 6h12c2-1 2-4 0-6" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "fillings":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="9" stroke="#000" strokeWidth="1.8" />
          <path d="M6.5 14h15" stroke="#000" strokeWidth="1.8" />
          <circle cx="11" cy="11" r="1.7" fill="#F7C311" />
          <circle cx="16.5" cy="11" r="1.7" fill="#F7C311" />
          <circle cx="14" cy="17.5" r="1.7" fill="#000" />
        </svg>
      );
    case "grab":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="6" y="9" width="16" height="13" rx="2.5" fill="#F7C311" stroke="#000" strokeWidth="1.8" />
          <path d="M10.5 9V7.5a3.5 3.5 0 0 1 7 0V9" stroke="#000" strokeWidth="1.8" />
          <path d="M11 15.5l2 2 4-4" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cheese":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M5 18l11-9 7 4v7H5v-2z" fill="#F7C311" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="1.5" fill="#000" />
          <circle cx="18" cy="16.5" r="1.3" fill="#000" />
        </svg>
      );
    case "plantain":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 20c5 1 11-3 14-12 1 6-2 14-10 15-2.5.3-4-1-4-3z" fill="#F7C311" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "sweet":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 20L19 8" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10 21L21 10" stroke="#F7C311" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="9" cy="9" r="2" fill="#F7C311" stroke="#000" strokeWidth="1.4" />
        </svg>
      );
    case "cocktail":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="9" y="8" width="10" height="14" rx="2" fill="#F7C311" stroke="#000" strokeWidth="1.8" />
          <path d="M14 8V4l4-1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="19" cy="8" r="2.5" stroke="#000" strokeWidth="1.5" fill="#fff" />
        </svg>
      );
    case "juice":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="15" r="7.5" fill="#F7C311" stroke="#000" strokeWidth="1.8" />
          <path d="M14 7.5c1-2.5 3.5-3 5-2-1 2-2.5 3-5 2z" fill="#000" />
          <path d="M10.5 14.5h7" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="9" cy="16" r="3.5" fill="#F7C311" stroke="#000" strokeWidth="1.6" />
          <circle cx="14" cy="11" r="3.5" fill="#fff" stroke="#000" strokeWidth="1.6" />
          <circle cx="19" cy="16" r="3.5" fill="#F7C311" stroke="#000" strokeWidth="1.6" />
        </svg>
      );
  }
}

function NutritionCircleIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "corn":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <ellipse cx="22" cy="20" rx="8.5" ry="12" fill="#F7C311" stroke="#000" strokeWidth="2.2" />
          <path d="M15.5 15h13M14.5 20h15M16 25h12M22 9v22" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 27c-2.5 3.5-2 7.5 2 9h16c4-1.5 4.5-5.5 2-9" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "protein":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <rect x="9" y="14" width="26" height="17" rx="8.5" fill="#F7C311" stroke="#000" strokeWidth="2.2" />
          <path d="M15 20c3-2 6 2 9 0s5-2 6 0M15 25c3-2 6 2 9 0s5-2 6 0" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "avocado":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M22 7c6 0 11 10 11 18a11 11 0 0 1-22 0c0-8 5-18 11-18z" fill="#F7C311" stroke="#000" strokeWidth="2.2" />
          <circle cx="22" cy="26" r="5" fill="#fff" stroke="#000" strokeWidth="2.2" />
        </svg>
      );
    case "plantain":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M10 31c8 2 18-4 22-19 2 10-3 22-16 24-4 .5-6.5-1.5-6-5z" fill="#F7C311" stroke="#000" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="22" cy="23" r="11.5" fill="#F7C311" stroke="#000" strokeWidth="2.2" />
          <path d="M22 11.5V34.5M10.5 23h23M14 15l16 16M30 15L14 31" stroke="#000" strokeWidth="1.6" />
        </svg>
      );
  }
}

const HERO_ITEMS = [
  {
    href: "#arepas",
    src: "/images/studies/arepa2go/hero-triptych-arepa.png",
    alt: "Caracas Signature Arepa — explore Arepa pockets",
    label: "01 · AREPAS ↓",
    tall: false,
  },
  {
    href: "#sides",
    src: "/images/studies/arepa2go/hero-triptych-tequenos.png",
    alt: "Crispy Golden Tequeños — explore sides & sweets",
    label: "02 · SIDES ↓",
    tall: false,
  },
  {
    href: "#drinks",
    src: "/images/studies/arepa2go/hero-triptych-drink.png",
    alt: "Coco Loco Tropical Cocktail — explore drinks & dips",
    label: "03 · DRINKS ↓",
    tall: true,
  },
];

const FIVE_CIRCLES = [
  { label: "CARBOHYDRATE", tag: "WHITE CORN", icon: "corn" },
  { label: "PROTEIN", tag: "SLOW-COOKED", icon: "protein" },
  { label: "HEALTHY FAT", tag: "GUASACACA", icon: "avocado" },
  { label: "VITAMINS", tag: "SWEET PLANTAIN", icon: "plantain" },
  { label: "MINERALS", tag: "FRESH FRUIT", icon: "citrus" },
];

export default function Arepa2GoHomeView() {
  return (
    <>
      {/* ── 1. HERO KEY VISUAL (CALORIEMATE STUDIO FLOOR) ────────── */}
      <section className="a2g-cmt-hero" aria-label="Arepa 2GO signature lineup">
        <div className="a2g-cmt-hero-inner">
          <div className="a2g-cmt-hero-head">
            <h1 className="a2g-cmt-hero-copy">
              Anytime, anywhere —
              <br />
              Venezuela in a bite.
            </h1>

            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>VIEW FULL MENU</span>
              <DottedArrow darkBg />
            </Link>
          </div>

          <div className="a2g-cmt-triptych">
            {HERO_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="a2g-cmt-hero-card">
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`a2g-cmt-hero-item ${item.tall ? "is-tall" : ""}`}
                />
                <span className="a2g-cmt-hero-label">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. POETIC STATEMENT + EDGE-BLEEDING PRODUCTS ─────────── */}
      <section className="a2g-cmt-statement">
        <img
          src="/images/studies/arepa2go/arepa-sifrina.png"
          alt=""
          className="a2g-bleed-left-top"
          aria-hidden="true"
        />
        <img
          src="/images/studies/arepa2go/side-tequenos.png"
          alt=""
          className="a2g-bleed-left-bot"
          aria-hidden="true"
        />
        <img
          src="/images/studies/arepa2go/museum-box-packaging.jpg"
          alt="Arepa 2GO Yellow Takeaway Box"
          className="a2g-bleed-right-box"
        />

        <div className="a2g-cmt-poetic">
          <p>
            Real Venezuelan flavor starts with hand-patted white corn,
            <br />
            griddled crisp every morning from scratch.
          </p>
          <p>
            On busy coastal days, or sunny walks five minutes from Southsea beach,
            <br />
            you still crave food made with soul and zero shortcuts.
          </p>
          <p>
            Gluten-free pockets, slow-cooked beef, sweet plantain &amp; fresh
            guasacaca
            <br />
            built to fuel every craving cleanly.
          </p>
          <p>
            A warm bite that brings the Caribbean coast
            <br />
            straight to your hands.
          </p>
          <p className="a2g-poetic-last">
            Venezuela in a bite — anytime, anywhere, for everyone.
          </p>

          <img
            src="/images/studies/arepa2go/logo-arepa2go.png"
            alt="Arepa 2GO"
            className="a2g-statement-logo"
          />
        </div>
      </section>

      {/* ── 3. PRODUCT HEADER + 3 FULL-WIDTH HORIZONTAL ROWS ─────── */}
      <section className="a2g-cmt-product-band">
        <div className="a2g-cmt-prod-header">
          <div>
            <h2 className="a2g-cmt-section-h2">PRODUCT</h2>
            <span className="a2g-cmt-outline-pill">MENU LINEUP</span>
            <p className="a2g-cmt-intro-p">
              Arepa 2GO comes in three signature formats — pick your pocket,
              crispy side, or tropical sip for any moment.
            </p>
          </div>

          <div className="a2g-cmt-banner-box">
            <img
              src="/images/studies/arepa2go/hero-triptych-arepa.png"
              alt=""
              className="a2g-banner-mini"
              aria-hidden="true"
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-tequenos.png"
              alt=""
              className="a2g-banner-mini"
              aria-hidden="true"
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-drink.png"
              alt=""
              className="a2g-banner-mini"
              aria-hidden="true"
            />
            <Link href="/studies/arepa2go/menu" className="a2g-white-pill-btn">
              <span>FULL MENU</span>
              <DottedArrow />
            </Link>
          </div>
        </div>

        {/* Row 1: AREPAS */}
        <div id="arepas" className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>AREPAS</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>VIEW AREPAS</span>
              <DottedArrow darkBg />
            </Link>
          </div>

          <div className="a2g-cmt-row-media">
            <img
              src="/images/studies/arepa2go/hero-triptych-arepa.png"
              alt="Caracas Arepa"
              className="a2g-row-img-main"
            />
            <img
              src="/images/studies/arepa2go/arepa-domino.png"
              alt="Dominó Arepa"
              className="a2g-row-img-sub"
            />
          </div>

          <div className="a2g-cmt-row-right">
            <span className="a2g-cmt-outline-pill">GLUTEN-FREE POCKET</span>
            <p className="a2g-cmt-row-copy">
              Sifrina, Dominó, Caracas, Pelúa, Platanera &amp; Ávila — crisp
              white corn pockets packed hot to order.
            </p>
            <div className="a2g-mini-circles">
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="corn" />
                <span>100% CORN MASA</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="fillings" />
                <span>6 SIGNATURE FILLINGS</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="grab" />
                <span>GRAB &amp; GO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: SIDES */}
        <div id="sides" className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>SIDES</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>VIEW SIDES</span>
              <DottedArrow darkBg />
            </Link>
          </div>

          <div className="a2g-cmt-row-media">
            <img
              src="/images/studies/arepa2go/hero-triptych-tequenos.png"
              alt="Tequeños"
              className="a2g-row-img-main"
            />
            <img
              src="/images/studies/arepa2go/side-empanadas.png"
              alt="Empanadas"
              className="a2g-row-img-sub"
            />
          </div>

          <div className="a2g-cmt-row-right">
            <span className="a2g-cmt-outline-pill">CRISPY ANTOJITOS</span>
            <p className="a2g-cmt-row-copy">
              Golden Tequeños, gluten-free Empanadas, Tostones, Yuca Frita &amp;
              warm sugar-dusted Churros.
            </p>
            <div className="a2g-mini-circles">
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="cheese" />
                <span>MELTED QUESO</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="plantain" />
                <span>CRISPY PLANTAIN</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="sweet" />
                <span>DULCE DE LECHE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: DRINKS */}
        <div id="drinks" className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>DRINKS</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>VIEW DRINKS</span>
              <DottedArrow darkBg />
            </Link>
          </div>

          <div className="a2g-cmt-row-media">
            <img
              src="/images/studies/arepa2go/hero-triptych-drink.png"
              alt="Coco Loco"
              className="a2g-row-img-main is-drink"
            />
            <img
              src="/images/studies/arepa2go/dips-trio.png"
              alt="House Dips"
              className="a2g-row-img-sub"
            />
          </div>

          <div className="a2g-cmt-row-right">
            <span className="a2g-cmt-outline-pill">TROPICAL SIPS &amp; DIPS</span>
            <p className="a2g-cmt-row-copy">
              Chilled Coco Loco cocktails, passion fruit &amp; guava juices,
              plus our three daily house dipping sauces.
            </p>
            <div className="a2g-mini-circles">
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="cocktail" />
                <span>COCO LOCO</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="juice" />
                <span>TROPICAL JUICES</span>
              </div>
              <div className="a2g-mini-circle">
                <MiniBadgeIcon kind="dips" />
                <span>3 HOUSE DIPS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. NUTRITION / INGREDIENTS (YELLOW SIDE RAILS + 5 CIRCLES) ─ */}
      <section className="a2g-cmt-nutrition">
        <div className="a2g-rail-left" aria-hidden="true" />
        <div className="a2g-rail-right" aria-hidden="true" />

        <img
          src="/images/studies/arepa2go/arepa-pelua.png"
          alt=""
          className="a2g-nutr-bleed-1"
          aria-hidden="true"
        />
        <img
          src="/images/studies/arepa2go/side-tostones.png"
          alt=""
          className="a2g-nutr-bleed-2"
          aria-hidden="true"
        />
        <img
          src="/images/studies/arepa2go/arepa-platanera.png"
          alt=""
          className="a2g-nutr-bleed-3"
          aria-hidden="true"
        />
        <img
          src="/images/studies/arepa2go/arepa-avila.png"
          alt=""
          className="a2g-nutr-bleed-4"
          aria-hidden="true"
        />

        <div className="a2g-cmt-nutr-inner">
          <h2 className="a2g-cmt-section-h2">INGREDIENTS</h2>
          <span className="a2g-cmt-outline-pill">100% GLUTEN-FREE CRAFT</span>
          <p className="a2g-cmt-nutr-copy">
            Every Arepa 2GO bite balances crisp white corn masa, slow-cooked
            proteins, fresh avocado &amp; tropical fruit.
          </p>

          <Link
            href="/studies/arepa2go/ingredients"
            className="a2g-black-pill-btn"
            style={{ margin: "0 auto 44px" }}
          >
            <span>MORE</span>
            <DottedArrow darkBg />
          </Link>

          <div className="a2g-five-circles-top">
            {FIVE_CIRCLES.slice(0, 3).map((c) => (
              <div key={c.label} className="a2g-big-circle">
                <NutritionCircleIcon kind={c.icon} />
                <span className="a2g-circle-pill">{c.tag}</span>
                <strong>{c.label}</strong>
              </div>
            ))}
          </div>
          <div className="a2g-five-circles-bot">
            {FIVE_CIRCLES.slice(3, 5).map((c) => (
              <div key={c.label} className="a2g-big-circle">
                <NutritionCircleIcon kind={c.icon} />
                <span className="a2g-circle-pill">{c.tag}</span>
                <strong>{c.label}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MUSEUM STAGGERED 2-COLUMN MASONRY ─────────────────── */}
      <section className="a2g-cmt-museum">
        <div className="a2g-cmt-museum-grid">
          <div className="a2g-cmt-museum-col">
            <div style={{ marginBottom: 42 }}>
              <h2 className="a2g-cmt-section-h2">MUSEUM</h2>
              <span className="a2g-cmt-outline-pill">AREPA 2GO ARCHIVE</span>
              <p className="a2g-cmt-intro-p">
                Behind every golden crust is a Caracas tradition — explore the
                stories behind our kitchen.
              </p>
            </div>

            <Link href="/studies/arepa2go/museum" className="a2g-cmt-mcard">
              <div className="a2g-cmt-mcard-img-wrap">
                <img src={MUSEUM_CHAPTERS[0].img} alt={MUSEUM_CHAPTERS[0].title} />
              </div>
              <div className="a2g-cmt-mcard-foot">
                <div>
                  <h3>{MUSEUM_CHAPTERS[0].title}</h3>
                  <p>{MUSEUM_CHAPTERS[0].subtitle}</p>
                </div>
                <DottedArrow darkBg />
              </div>
            </Link>
          </div>

          <div className="a2g-cmt-museum-col is-offset">
            <Link href="/studies/arepa2go/museum" className="a2g-cmt-mcard">
              <div className="a2g-cmt-mcard-img-wrap">
                <img src={MUSEUM_CHAPTERS[1].img} alt={MUSEUM_CHAPTERS[1].title} />
              </div>
              <div className="a2g-cmt-mcard-foot">
                <div>
                  <h3>{MUSEUM_CHAPTERS[1].title}</h3>
                  <p>{MUSEUM_CHAPTERS[1].subtitle}</p>
                </div>
                <DottedArrow darkBg />
              </div>
            </Link>

            <Link href="/studies/arepa2go/museum" className="a2g-cmt-mcard">
              <div className="a2g-cmt-mcard-img-wrap">
                <img src={MUSEUM_CHAPTERS[2].img} alt={MUSEUM_CHAPTERS[2].title} />
              </div>
              <div className="a2g-cmt-mcard-foot">
                <div>
                  <h3>{MUSEUM_CHAPTERS[2].title}</h3>
                  <p>{MUSEUM_CHAPTERS[2].subtitle}</p>
                </div>
                <DottedArrow darkBg />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. SPECIAL / SOUTHSEA HIGHLIGHTS ─────────────────────── */}
      <section className="a2g-cmt-special">
        <div className="a2g-cmt-special-inner">
          <h2 className="a2g-cmt-section-h2">SPECIAL</h2>
          <span className="a2g-cmt-outline-pill">SOUTHSEA HIGHLIGHTS</span>

          <div className="a2g-cmt-special-grid">
            {[
              {
                img: "/images/studies/arepa2go/side-churros.png",
                title: "CHURROS & DULCE DE LECHE",
                sub: "Five warm sugar-dusted churros made fresh to dip.",
                href: "/studies/arepa2go/menu",
              },
              {
                img: "/images/studies/arepa2go/drink-tropical-juices.png",
                title: "PASSION FRUIT, MANGO & GUAVA",
                sub: "Chilled Latin fruit juices blended daily.",
                href: "/studies/arepa2go/menu",
              },
              {
                img: "/images/studies/arepa2go/side-yuca-fries.png",
                title: "YUCA FRITA & GUASACACA",
                sub: "Crispy golden cassava fries with emerald dip.",
                href: "/studies/arepa2go/visit",
              },
            ].map((sp) => (
              <Link key={sp.title} href={sp.href} className="a2g-cmt-scard">
                <div className="a2g-cmt-scard-img">
                  <img src={sp.img} alt={sp.title} />
                </div>
                <div className="a2g-cmt-mcard-foot">
                  <div>
                    <h4>{sp.title}</h4>
                    <p>{sp.sub}</p>
                  </div>
                  <DottedArrow darkBg />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>MORE</span>
              <DottedArrow darkBg />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
