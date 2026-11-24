"use client";

import Link from "next/link";
import { useState } from "react";
import { PERRERO_SAUCES, STREET_REVIEWS, type PerreroSauce } from "./catalog";
import { PerreroBottleSilhouette } from "./PerreroArtwork";
import { usePerreroCart } from "./PerreroShell";

export function PerreroWeaponGrid({
  sauces = PERRERO_SAUCES,
  showHeading = true,
}: {
  sauces?: PerreroSauce[];
  showHeading?: boolean;
}) {
  const { addBottleToCart } = usePerreroCart();

  return (
    <section id="pr-shop" className="pr-weapon-section">
      {showHeading && (
        <>
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
        </>
      )}

      <div className="pr-weapon-scroll">
        <div className="pr-weapon-grid">
          {sauces.map((sauce) => (
            <article
              key={sauce.id}
              className="pr-weapon-card"
              style={{ backgroundColor: sauce.cardBgHex }}
            >
              <Link
                href={`/studies/perrero/shop/${sauce.slug}`}
                className="pr-weapon-title-link"
              >
                <h3 className="pr-weapon-title">{sauce.name}</h3>
              </Link>

              <Link
                href={`/studies/perrero/shop/${sauce.slug}`}
                className="pr-weapon-img-stage"
                aria-label={`View ${sauce.name} product page`}
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
              </Link>

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
                  <Link
                    href={`/studies/perrero/shop/${sauce.slug}`}
                    className="pr-btn-ghost"
                  >
                    VIEW
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PerreroThreePackBuilder() {
  const { addPackToCart } = usePerreroCart();
  const [packSlots, setPackSlots] = useState<Array<PerreroSauce | null>>([
    PERRERO_SAUCES[0],
    PERRERO_SAUCES[1],
    null,
  ]);

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

  const packFull = packSlots.every((s) => s !== null);

  return (
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
              onClick={() => {
                if (packFull) addPackToCart(packSlots as PerreroSauce[]);
              }}
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
  );
}

export function PerreroReviewsStrip() {
  return (
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
  );
}
