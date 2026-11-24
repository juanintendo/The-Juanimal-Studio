"use client";

import Link from "next/link";
import { useState } from "react";
import { PERRERO_SAUCES, type PerreroSauce } from "./catalog";
import { PerreroWeaponGrid } from "./PerreroSections";
import { usePerreroCart } from "./PerreroShell";

export default function PerreroPdpView({ sauce }: { sauce: PerreroSauce }) {
  const { addBottleToCart } = usePerreroCart();
  const [packSize, setPackSize] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState(1);

  const idx = PERRERO_SAUCES.findIndex((s) => s.slug === sauce.slug);
  const prevSauce =
    PERRERO_SAUCES[(idx - 1 + PERRERO_SAUCES.length) % PERRERO_SAUCES.length];
  const nextSauce = PERRERO_SAUCES[(idx + 1) % PERRERO_SAUCES.length];
  const otherSauces = PERRERO_SAUCES.filter((s) => s.slug !== sauce.slug);

  const packMultiplier = packSize === 1 ? 1 : packSize === 2 ? 1.85 : 2.65;
  const unitPackPrice = Math.round(sauce.price * packMultiplier);
  const totalPrice = unitPackPrice * qty;
  const packLabel =
    packSize === 1
      ? `${sauce.size} · SINGLE BOTTLE`
      : packSize === 2
      ? `2-BOTTLE DUO (${sauce.size})`
      : `3-BOTTLE STASH (${sauce.size})`;

  return (
    <>
      <section className="pr-pdp-split">
        {/* Left: Editorial full-height product scene */}
        <div
          className="pr-pdp-visual"
          style={{ backgroundColor: sauce.pdpBgHex }}
        >
          <img
            src={sauce.pdpImg}
            alt={sauce.name}
            className="pr-pdp-scene-img"
          />

          <div className="pr-pdp-nav-arrows">
            <Link
              href={`/studies/perrero/shop/${prevSauce.slug}`}
              className="pr-pdp-arrow"
              aria-label={`Previous sauce: ${prevSauce.name}`}
            >
              ←
            </Link>
            <Link
              href={`/studies/perrero/shop/${nextSauce.slug}`}
              className="pr-pdp-arrow"
              aria-label={`Next sauce: ${nextSauce.name}`}
            >
              →
            </Link>
          </div>
        </div>

        {/* Right: Monumental typography, bento profile & add to cart */}
        <div className="pr-pdp-details">
          <div>
            <div className="pr-pdp-head">
              <div
                style={{
                  fontFamily: "var(--pr-ui)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: sauce.accentHex,
                  marginBottom: 8,
                }}
              >
                PRODUCT NO.{sauce.num} · {sauce.size}
              </div>
              <h1 className="pr-pdp-title">{sauce.name}</h1>
              <p className="pr-pdp-tagline">{sauce.tagline}</p>
              <img
                src={sauce.mascotImg}
                alt=""
                className="pr-pdp-mascot"
              />
            </div>

            <div className="pr-pdp-bento" style={{ marginTop: 22 }}>
              <div className="pr-bento-card">
                <h3>TASTE PROFILE</h3>
                <ul className="pr-bento-list">
                  {sauce.tasteProfile.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div className="pr-bento-card">
                <h3>PAIRS WITH</h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    color: "var(--pr-dim)",
                  }}
                >
                  {sauce.pairing.join(", ")}.
                </p>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: "var(--pr-ui)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: sauce.accentHex,
                  }}
                >
                  {sauce.heat === 0
                    ? "HEAT LEVEL: ZERO HEAT"
                    : `HEAT LEVEL: ${"🔥".repeat(sauce.heat)} (${sauce.heat}/5)`}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="pr-seals-row" style={{ marginBottom: 18 }}>
              {[
                { icon: "🌽", label: "NO CORN SYRUP" },
                { icon: "🌾", label: "GLUTEN FREE" },
                { icon: "🧪", label: "NO ADDITIVES" },
                { icon: "💧", label: "NO SEED OILS" },
              ].map((seal) => (
                <div key={seal.label} className="pr-seal">
                  <span className="pr-seal-circle">{seal.icon}</span>
                  <span>{seal.label}</span>
                </div>
              ))}
            </div>

            <div className="pr-pdp-buy-row">
              <select
                aria-label="Select bundle size"
                className="pr-pdp-select"
                value={packSize}
                onChange={(e) => setPackSize(Number(e.target.value) as 1 | 2 | 3)}
              >
                <option value={1}>1 bottle (12 oz) — ${sauce.price}.00</option>
                <option value={2}>
                  2 bottles (Save 8%) — ${Math.round(sauce.price * 1.85)}.00
                </option>
                <option value={3}>
                  3 bottles (Save 12%) — ${Math.round(sauce.price * 2.65)}.00
                </option>
              </select>

              <div className="pr-qty" style={{ height: 44 }}>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  style={{ width: 38, height: 44 }}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span style={{ minWidth: 32 }}>{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  style={{ width: 38, height: 44 }}
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="pr-pdp-add-btn"
              style={{ backgroundColor: sauce.accentHex }}
              onClick={() =>
                addBottleToCart(sauce, qty, packLabel, unitPackPrice)
              }
            >
              <span>ADD TO CART</span>
              <span>${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pr-pdp-extra">
        <div className="pr-pdp-info-bar">
          <div className="pr-bento-card">
            <h3>REAL CARACAS INGREDIENTS</h3>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--pr-dim)",
              }}
            >
              {sauce.ingredients}
            </p>
          </div>
          <div className="pr-bento-card">
            <h3>WANT MIX &amp; MATCH?</h3>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13.5,
                color: "var(--pr-dim)",
              }}
            >
              Build your own 3-pack with any 3 flavors and save $4.00 instantly.
            </p>
            <Link href="/studies/perrero/shop#pr-bundle" className="pr-step-btn">
              BUILD 3-PACK →
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1520, margin: "0 auto", padding: "0 24px" }}>
        <h2
          style={{
            fontFamily: "var(--pr-disp)",
            fontSize: "clamp(34px, 4vw, 52px)",
            margin: "0 0 4px",
            textTransform: "uppercase",
          }}
        >
          OTHER WEAPONS
        </h2>
      </div>
      <PerreroWeaponGrid sauces={otherSauces} showHeading={false} />
    </>
  );
}
