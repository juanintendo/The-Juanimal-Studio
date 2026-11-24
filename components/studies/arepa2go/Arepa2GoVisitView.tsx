"use client";

import { useState } from "react";
import { GUEST_REVIEWS } from "./catalog";

export default function Arepa2GoVisitView() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="a2g-sub-hero">
        <div className="a2g-kicker">VISIT &amp; TAKEAWAY · SOUTHSEA, UK</div>
        <h1>Five minutes from the beach. No passport needed.</h1>
        <p>
          Walk in for hot handmade arepas, takeaway boxes, and cold Coco Loco
          cocktails — or message our kitchen directly.
        </p>
      </section>

      <section className="a2g-visit-grid">
        <div className="a2g-panel">
          <div className="a2g-kicker">KITCHEN &amp; HOURS</div>
          <h2 style={{ fontFamily: "var(--a2g-head)", margin: "0 0 14px" }}>
            AREPA 2GO SOUTHSEA
          </h2>
          <p style={{ margin: "0 0 12px", color: "var(--a2g-dim)", lineHeight: 1.6 }}>
            <strong>Phone:</strong> +44-0239-2791746
            <br />
            <strong>Email:</strong> arepa2go.info@gmail.com
            <br />
            <strong>Vibe:</strong> Retro-tropical Venezuelan beach stand ·
            Dine-in &amp; Takeaway
          </p>

          <div
            style={{
              borderTop: "1px solid var(--a2g-line)",
              paddingTop: 16,
              marginTop: 16,
              display: "grid",
              gap: 12,
            }}
          >
            <div className="a2g-kicker" style={{ margin: 0 }}>
              GUEST REVIEWS
            </div>
            {GUEST_REVIEWS.map((rev) => (
              <article
                key={rev.author}
                style={{
                  background: "#fff",
                  border: "1px solid var(--a2g-line)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ color: "#F2633A", fontSize: 13, marginBottom: 4 }}>
                  ★★★★★
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 13.5, lineHeight: 1.55 }}>
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--a2g-dim)" }}>
                  {rev.author} · {rev.source}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="a2g-panel">
          <div className="a2g-kicker">GET IN TOUCH</div>
          <h2 style={{ fontFamily: "var(--a2g-head)", margin: "0 0 14px" }}>
            SEND A CRAVING OR BOOKING NOTE
          </h2>
          {sent ? (
            <div className="a2g-order-ok">
              ✓ Gracias! Message received by the Arepa 2GO Southsea team.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input className="a2g-input" required placeholder="Your First Name" />
              <input
                className="a2g-input"
                type="email"
                required
                placeholder="Your Email Address"
              />
              <textarea
                className="a2g-textarea"
                required
                placeholder="Your Message (allergies, group takeaway, or table question)"
              />
              <button type="submit" className="a2g-checkout-btn">
                SEND YOUR MESSAGE →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
