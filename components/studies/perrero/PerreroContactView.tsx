"use client";

import { useState } from "react";

export default function PerreroContactView() {
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

        <h1 className="pr-burst-h1">CONTACT</h1>
        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 18,
            margin: "0 0 6px",
          }}
        >
          Caracas · Miami · Madrid
        </p>
        <a
          href="mailto:juan@fuelorfool.ing"
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: "var(--pr-disp)",
            fontSize: 30,
            textDecoration: "underline",
            color: "var(--pr-gold)",
          }}
        >
          HELLO@PERREROSAUCE.CO
        </a>
      </section>

      <section style={{ padding: "0 20px" }}>
        <div className="pr-form-box">
          {sent ? (
            <div
              style={{
                border: "1px solid #58C446",
                borderRadius: 10,
                padding: 18,
                color: "#58C446",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              ✓ Message delivered! Thanks for hitting up the Perrero Sauce Co.
              kitchen.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="pr-form-grid">
                <input className="pr-input" required placeholder="Name" />
                <input className="pr-input" type="email" required placeholder="Email" />
              </div>
              <textarea className="pr-textarea" required placeholder="Message" />
              <button
                type="submit"
                className="pr-pill-cta"
                style={{ width: "100%", padding: "14px 20px" }}
              >
                SEND MESSAGE →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
