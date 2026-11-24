"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AREPA_MENU,
  CRAFT_PILLARS,
  MUSEUM_CHAPTERS,
  type ArepaCategory,
} from "./catalog";
import { useArepa2GoTray } from "./Arepa2GoShell";

export default function Arepa2GoHomeView() {
  const { addToTray } = useArepa2GoTray();
  const [focusTab, setFocusTab] = useState<"all" | ArepaCategory>("all");

  const arepas = AREPA_MENU.filter((i) => i.category === "arepas");
  const sides = AREPA_MENU.filter((i) => i.category === "sides");
  const drinks = AREPA_MENU.filter((i) => i.category === "drinks");

  return (
    <>
      {/* ── HERO KEY VISUAL (CALORIEMATE TRIPTYCH) ───────────────── */}
      <section className="a2g-hero">
        <div className="a2g-hero-yellow-bar" aria-hidden="true" />
        <div className="a2g-hero-inner">
          <div className="a2g-hero-top">
            <div>
              <div className="a2g-kicker">
                SOUTHSEA COAST · AUTHENTIC VENEZUELAN KITCHEN
              </div>
              <h1 className="a2g-hero-h1">
                Anytime, anywhere — Venezuela in a bite.
              </h1>
            </div>
            <p className="a2g-hero-sub">
              Hand-patted gluten-free white corn arepas, crispy golden tequeños,
              and tropical cocktails served five minutes from the sea.
            </p>
          </div>

          <div className="a2g-triptych">
            <div
              className={`a2g-triptych-item ${
                focusTab === "arepas" ? "focused" : ""
              }`}
            >
              <img
                src="/images/studies/arepa2go/hero-triptych-arepa.png"
                alt="Caracas Signature Arepa"
                className="a2g-triptych-img"
              />
              <span className="a2g-triptych-tag">01 · GLUTEN-FREE POCKET</span>
              <h2 className="a2g-triptych-name">CARACAS AREPAS</h2>
            </div>

            <div
              className={`a2g-triptych-item ${
                focusTab === "sides" ? "focused" : ""
              }`}
            >
              <img
                src="/images/studies/arepa2go/hero-triptych-tequenos.png"
                alt="Crispy Venezuelan Tequeños"
                className="a2g-triptych-img"
              />
              <span className="a2g-triptych-tag">02 · CRISPY SIDES</span>
              <h2 className="a2g-triptych-name">TEQUEÑOS &amp; EMPANADAS</h2>
            </div>

            <div
              className={`a2g-triptych-item ${
                focusTab === "drinks" ? "focused" : ""
              }`}
            >
              <img
                src="/images/studies/arepa2go/hero-triptych-drink.png"
                alt="Coco Loco Tropical Cocktail"
                className="a2g-triptych-img"
              />
              <span className="a2g-triptych-tag">03 · TROPICAL SIP</span>
              <h2 className="a2g-triptych-name">COCO LOCO &amp; JUICES</h2>
            </div>
          </div>

          <div className="a2g-hero-switcher" role="group" aria-label="Focus lineup">
            {[
              { id: "all", label: "ALL LINEUP (14)" },
              { id: "arepas", label: "01 AREPAS (6)" },
              { id: "sides", label: "02 SIDES & SWEETS (5)" },
              { id: "drinks", label: "03 DRINKS & DIPS (3)" },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`a2g-switch-pill ${
                  focusTab === pill.id ? "active" : ""
                }`}
                onClick={() => setFocusTab(pill.id as "all" | ArepaCategory)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL STATEMENT + CALORIEMATE-STYLE PACKAGING ──── */}
      <section className="a2g-statement">
        <div>
          <div className="a2g-kicker">HECHO A MANO · NO PASSPORT NEEDED</div>
          <h2>
            Balanced Venezuelan craft built for beach walks, late lunches &amp;
            takeaway boxes.
          </h2>
          <p>
            Every Arepa 2GO dish is made from scratch using prime ingredients —
            100% gluten-free white corn masa, slow-cooked carne mechada, sweet
            caramelized plantain, and fresh daily guasacaca.
          </p>
          <Link href="/studies/arepa2go/menu" className="a2g-btn-primary">
            EXPLORE FULL MENU →
          </Link>
        </div>

        <div className="a2g-box-frame">
          <img
            src="/images/studies/arepa2go/museum-box-packaging.jpg"
            alt="Arepa 2GO yellow takeaway box"
            className="a2g-box-img"
          />
        </div>
      </section>

      {/* ── LINEUP BAND 01: AREPAS ─────────────────────────────── */}
      {(focusTab === "all" || focusTab === "arepas") && (
        <section className="a2g-lineup-band">
          <div className="a2g-band-head">
            <div className="a2g-band-title-wrap">
              <span
                className="a2g-band-bar"
                style={{ backgroundColor: "#F8C61E" }}
              />
              <h2 className="a2g-band-title">01 · SIGNATURE AREPAS</h2>
            </div>
            <Link href="/studies/arepa2go/menu" className="a2g-band-link">
              FILTER MENU →
            </Link>
          </div>

          <div className="a2g-product-grid">
            {arepas.map((item) => (
              <article key={item.id} className="a2g-card">
                <div className="a2g-card-top">
                  <span>
                    NO.{item.num} · {item.tag}
                  </span>
                  <span
                    className="a2g-card-dot"
                    style={{ backgroundColor: item.accentHex }}
                  />
                </div>
                <div className="a2g-card-img-wrap">
                  <img src={item.img} alt={item.name} className="a2g-card-img" />
                </div>
                <div>
                  <h3 className="a2g-card-title">{item.name}</h3>
                  <p className="a2g-card-desc">{item.description}</p>
                </div>
                <div className="a2g-card-foot">
                  <span className="a2g-card-price">
                    £{item.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="a2g-add-btn"
                    onClick={() => addToTray(item)}
                  >
                    + ADD TO TRAY
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── LINEUP BAND 02: SIDES & SWEETS ─────────────────────── */}
      {(focusTab === "all" || focusTab === "sides") && (
        <section className="a2g-lineup-band">
          <div className="a2g-band-head">
            <div className="a2g-band-title-wrap">
              <span
                className="a2g-band-bar"
                style={{ backgroundColor: "#F2633A" }}
              />
              <h2 className="a2g-band-title">02 · EMPANADAS, SIDES &amp; SWEETS</h2>
            </div>
            <Link href="/studies/arepa2go/menu" className="a2g-band-link">
              VIEW ALL →
            </Link>
          </div>

          <div className="a2g-product-grid">
            {sides.map((item) => (
              <article key={item.id} className="a2g-card">
                <div className="a2g-card-top">
                  <span>
                    NO.{item.num} · {item.tag}
                  </span>
                  <span
                    className="a2g-card-dot"
                    style={{ backgroundColor: item.accentHex }}
                  />
                </div>
                <div className="a2g-card-img-wrap">
                  <img src={item.img} alt={item.name} className="a2g-card-img" />
                </div>
                <div>
                  <h3 className="a2g-card-title">{item.name}</h3>
                  <p className="a2g-card-desc">{item.description}</p>
                </div>
                <div className="a2g-card-foot">
                  <span className="a2g-card-price">
                    £{item.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="a2g-add-btn"
                    onClick={() => addToTray(item)}
                  >
                    + ADD TO TRAY
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── LINEUP BAND 03: DRINKS & DIPS ──────────────────────── */}
      {(focusTab === "all" || focusTab === "drinks") && (
        <section className="a2g-lineup-band">
          <div className="a2g-band-head">
            <div className="a2g-band-title-wrap">
              <span
                className="a2g-band-bar"
                style={{ backgroundColor: "#1AA8A8" }}
              />
              <h2 className="a2g-band-title">03 · TROPICAL DRINKS &amp; DIPS</h2>
            </div>
            <Link href="/studies/arepa2go/ingredients" className="a2g-band-link">
              DIP GUIDE →
            </Link>
          </div>

          <div className="a2g-product-grid">
            {drinks.map((item) => (
              <article key={item.id} className="a2g-card">
                <div className="a2g-card-top">
                  <span>
                    NO.{item.num} · {item.tag}
                  </span>
                  <span
                    className="a2g-card-dot"
                    style={{ backgroundColor: item.accentHex }}
                  />
                </div>
                <div className="a2g-card-img-wrap">
                  <img src={item.img} alt={item.name} className="a2g-card-img" />
                </div>
                <div>
                  <h3 className="a2g-card-title">{item.name}</h3>
                  <p className="a2g-card-desc">{item.description}</p>
                </div>
                <div className="a2g-card-foot">
                  <span className="a2g-card-price">
                    £{item.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="a2g-add-btn"
                    onClick={() => addToTray(item)}
                  >
                    + ADD TO TRAY
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── NUTRITION & CRAFT INFOGRAPHIC BAND ─────────────────── */}
      <section className="a2g-craft-band">
        <div className="a2g-craft-inner">
          <div className="a2g-band-head">
            <div>
              <div className="a2g-kicker">INGREDIENTS &amp; CRAFT</div>
              <h2 className="a2g-band-title">5 REASONS EVERY BITE HITS DIFFERENT</h2>
            </div>
            <Link href="/studies/arepa2go/ingredients" className="a2g-band-link">
              READ NUTRITION &amp; DIPS →
            </Link>
          </div>

          <div className="a2g-craft-grid">
            {CRAFT_PILLARS.map((p) => (
              <article key={p.code} className="a2g-craft-card">
                <span
                  className="a2g-craft-num"
                  style={{ backgroundColor: p.color }}
                >
                  {p.code}
                </span>
                <h3>{p.title}</h3>
                <p>{p.detail}</p>
              </article>
            ))}
          </div>

          <div className="a2g-band-head" style={{ marginTop: 48 }}>
            <div>
              <div className="a2g-kicker">AREPA MUSEUM</div>
              <h2 className="a2g-band-title">STORIES FROM CARACAS TO SOUTHSEA</h2>
            </div>
            <Link href="/studies/arepa2go/museum" className="a2g-band-link">
              ENTER MUSEUM →
            </Link>
          </div>

          <div className="a2g-museum-grid">
            {MUSEUM_CHAPTERS.map((ch) => (
              <Link
                key={ch.num}
                href="/studies/arepa2go/museum"
                className="a2g-museum-card"
              >
                <div className="a2g-box-frame" style={{ border: 0, borderRadius: 0 }}>
                  <img src={ch.img} alt={ch.title} className="a2g-box-img" />
                </div>
                <div className="a2g-museum-body">
                  <span className="a2g-kicker">{ch.num}</span>
                  <h3>{ch.title}</h3>
                  <p>{ch.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
