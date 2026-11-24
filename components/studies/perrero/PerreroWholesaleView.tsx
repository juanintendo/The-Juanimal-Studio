"use client";

import { useState } from "react";

export default function PerreroWholesaleView() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="pr-burst-hero">
        <svg viewBox="0 0 400 400" className="pr-burst-svg" aria-hidden="true">
          {Array.from({ length: 36 }).map((_, i) => (
            <line
              key={i}
              x1="200"
              y1="200"
              x2="200"
              y2="16"
              stroke="#F8F2E2"
              strokeWidth="1.5"
              strokeDasharray="10 12"
              transform={`rotate(${i * 10} 200 200)`}
            />
          ))}
        </svg>

        <h1 className="pr-burst-h1">
          GOT SHELVES? WE
          <br />
          SHOULD PROBABLY TALK
        </h1>
        <p style={{ position: "relative", zIndex: 2, color: "var(--pr-dim)", maxWidth: "46ch", margin: "0 auto" }}>
          Bottle shops, specialty grocers, burger joints, and perrero carts:
          stock small-batch sauces that actually move off the shelf.
        </p>
      </section>

      <section className="pr-wholesale-photos">
        <div className="pr-scene-frame">
          <img
            src="/images/studies/perrero/scene-wholesale-shelf.jpg"
            alt="Perrero Sauce bottles on wooden retail shelf"
            className="pr-scene-img"
          />
        </div>
        <div className="pr-scene-frame">
          <img
            src="/images/studies/perrero/scene-wholesale-award.jpg"
            alt="Perrero Sauce award winning bottles"
            className="pr-scene-img"
          />
        </div>
        <div className="pr-scene-frame">
          <img
            src="/images/studies/perrero/scene-street-cart.jpg"
            alt="Perrero Sauce street cart kitchen"
            className="pr-scene-img"
          />
        </div>
      </section>

      <section style={{ padding: "0 20px" }}>
        <div className="pr-form-box">
          <h2
            style={{
              fontFamily: "var(--pr-disp)",
              fontSize: 38,
              margin: "0 0 6px",
              textTransform: "uppercase",
            }}
          >
            REQUEST WHOLESALE LINE SHEET
          </h2>
          <p style={{ margin: "0 0 18px", color: "var(--pr-dim)", fontSize: 14 }}>
            12-bottle case minimums · Custom 3-pack retail displays · Fast dispatch.
          </p>

          {sent ? (
            <div
              style={{
                border: "1px solid #58C446",
                borderRadius: 10,
                padding: 18,
                color: "#58C446",
                fontWeight: 600,
              }}
            >
              ✓ Wholesale inquiry received! Our Caracas distribution desk will
              send the 2026 case pricing sheet within 24 hours.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="pr-form-grid">
                <input className="pr-input" required placeholder="Shop / Restaurant Name" />
                <input className="pr-input" type="email" required placeholder="Buyer Email" />
              </div>
              <div className="pr-form-grid">
                <input className="pr-input" required placeholder="City & Country" />
                <input className="pr-input" placeholder="Estimated Monthly Cases (e.g. 5–20)" />
              </div>
              <textarea
                className="pr-textarea"
                placeholder="Tell us about your shelves or menu..."
              />
              <button type="submit" className="pr-pill-cta" style={{ width: "100%", padding: "14px 20px" }}>
                SEND WHOLESALE REQUEST →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
