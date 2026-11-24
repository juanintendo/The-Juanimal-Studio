"use client";

import Link from "next/link";
import { useState } from "react";
import { AREPA_MENU, MUSEUM_CHAPTERS } from "./catalog";
import { useArepa2GoTray } from "./Arepa2GoShell";

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

const HERO_SLIDES = [
  {
    id: 0,
    caption1: "Anytime, anywhere —",
    caption2: "Venezuela in a bite.",
    thumb: "/images/studies/arepa2go/hero-triptych-arepa.png",
  },
  {
    id: 1,
    caption1: "Hand-patted corn,",
    caption2: "100% gluten-free craft.",
    thumb: "/images/studies/arepa2go/hero-triptych-tequenos.png",
  },
  {
    id: 2,
    caption1: "Southsea seaside,",
    caption2: "no passport needed.",
    thumb: "/images/studies/arepa2go/hero-triptych-drink.png",
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
  const { addToTray } = useArepa2GoTray();
  const [slideIdx, setSlideIdx] = useState(0);
  const currentSlide = HERO_SLIDES[slideIdx] ?? HERO_SLIDES[0];

  const caracasArepa = AREPA_MENU[2];
  const tequenos = AREPA_MENU[7];
  const cocoLoco = AREPA_MENU[11];

  return (
    <>
      {/* ── 1. HERO KEY VISUAL (CALORIEMATE STUDIO FLOOR) ────────── */}
      <section className="a2g-cmt-hero">
        <div className="a2g-cmt-hero-inner">
          <p className="a2g-cmt-hero-copy">
            {currentSlide.caption1}
            <br />
            {currentSlide.caption2}
          </p>

          <div className="a2g-cmt-triptych">
            <img
              src="/images/studies/arepa2go/hero-triptych-arepa.png"
              alt="Caracas Arepa"
              className={`a2g-cmt-hero-item ${slideIdx === 0 ? "is-focus" : ""}`}
              onClick={() => addToTray(caracasArepa)}
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-tequenos.png"
              alt="Crispy Tequeños"
              className={`a2g-cmt-hero-item ${slideIdx === 1 ? "is-focus" : ""}`}
              onClick={() => addToTray(tequenos)}
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-drink.png"
              alt="Coco Loco Cocktail"
              className={`a2g-cmt-hero-item is-tall ${
                slideIdx === 2 ? "is-focus" : ""
              }`}
              onClick={() => addToTray(cocoLoco)}
            />
          </div>

          <div className="a2g-cmt-dots-pill" role="group" aria-label="Hero slides">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={`a2g-cmt-dot ${slideIdx === i ? "active" : ""}`}
                onClick={() => setSlideIdx(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Thumbnails bar directly beneath hero like CalorieMate */}
      <div className="a2g-cmt-thumb-strip">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`a2g-cmt-thumb ${slideIdx === i ? "active" : ""}`}
            onClick={() => setSlideIdx(i)}
          >
            <img src={s.thumb} alt="" />
          </button>
        ))}
      </div>

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
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-tequenos.png"
              alt=""
              className="a2g-banner-mini"
            />
            <img
              src="/images/studies/arepa2go/hero-triptych-drink.png"
              alt=""
              className="a2g-banner-mini"
            />
            <Link href="/studies/arepa2go/menu" className="a2g-white-pill-btn">
              <span>FULL MENU</span>
              <DottedArrow />
            </Link>
          </div>
        </div>

        {/* Row 1: AREPAS */}
        <div className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>AREPAS</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>AREPAS TOP</span>
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
                <span>100% CORN MASA</span>
              </div>
              <div className="a2g-mini-circle">
                <span>6 SIGNATURE FILLINGS</span>
              </div>
              <div className="a2g-mini-circle">
                <span>GRAB &amp; GO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: SIDES */}
        <div className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>SIDES</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>SIDES TOP</span>
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
                <span>MELTED QUESO</span>
              </div>
              <div className="a2g-mini-circle">
                <span>CRISPY PLANTAIN</span>
              </div>
              <div className="a2g-mini-circle">
                <span>DULCE DE LECHE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: DRINKS */}
        <div className="a2g-cmt-row">
          <div className="a2g-cmt-row-left">
            <h3>DRINKS</h3>
            <Link href="/studies/arepa2go/menu" className="a2g-black-pill-btn">
              <span>DRINKS TOP</span>
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
                <span>COCO LOCO</span>
              </div>
              <div className="a2g-mini-circle">
                <span>TROPICAL JUICES</span>
              </div>
              <div className="a2g-mini-circle">
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
            Every Arepa 2GO bite balances crisp white cornmasa, slow-cooked
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
                <span className="a2g-circle-pill">{c.tag}</span>
                <strong>{c.label}</strong>
              </div>
            ))}
          </div>
          <div className="a2g-five-circles-bot">
            {FIVE_CIRCLES.slice(3, 5).map((c) => (
              <div key={c.label} className="a2g-big-circle">
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
