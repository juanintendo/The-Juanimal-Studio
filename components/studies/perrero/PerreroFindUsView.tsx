"use client";

import { useMemo, useState } from "react";
import { STOCKISTS, type Stockist } from "./catalog";

export default function PerreroFindUsView() {
  const [city, setCity] = useState<"ALL" | Stockist["city"]>("ALL");

  const visible = useMemo(
    () => (city === "ALL" ? STOCKISTS : STOCKISTS.filter((s) => s.city === city)),
    [city]
  );

  return (
    <>
      <section className="pr-find-hero">
        <img
          src="/images/studies/perrero/ing-avocado.png"
          alt=""
          style={{ width: 170, height: 170, objectFit: "contain", margin: "0 auto" }}
        />

        <div>
          <div
            style={{
              fontFamily: "var(--pr-ui)",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.14em",
              color: "var(--pr-gold)",
              marginBottom: 8,
            }}
          >
            SHOP SMALL
          </div>
          <h1
            style={{
              fontFamily: "var(--pr-disp)",
              fontWeight: 900,
              fontSize: "clamp(54px, 8vw, 118px)",
              lineHeight: 0.88,
              margin: "0 0 18px",
              textTransform: "uppercase",
            }}
          >
            FIND US
            <br />
            <span className="pr-outline">LOCALLY</span>
          </h1>
          <div className="pr-filter-row">
            {(["ALL", "CARACAS", "MIAMI", "NEW YORK", "MADRID"] as const).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  className={`pr-step-btn ${city === c ? "active" : ""}`}
                  onClick={() => setCity(c)}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        <img
          src="/images/studies/perrero/prop-wooden-crate.png"
          alt="Perrero Sauce Co. wooden delivery crate"
          style={{ width: "100%", maxWidth: 320, height: "auto", objectFit: "contain", margin: "0 auto" }}
        />
      </section>

      <section className="pr-stockist-grid">
        {visible.map((st) => (
          <article key={st.name} className="pr-stockist-card">
            <div>
              <div
                style={{
                  fontFamily: "var(--pr-ui)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--pr-gold)",
                  marginBottom: 6,
                }}
              >
                {st.city} · {st.neighborhood}
              </div>
              <h2
                style={{
                  fontFamily: "var(--pr-ui)",
                  fontWeight: 800,
                  fontSize: 24,
                  margin: "0 0 8px",
                }}
              >
                {st.name}
              </h2>
              <p style={{ margin: "0 0 6px", fontSize: 14, color: "var(--pr-dim)" }}>
                {st.address}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--pr-dim)" }}>
                {st.hours}
              </p>
            </div>
            <div
              style={{
                borderTop: "1px dashed var(--pr-line)",
                paddingTop: 10,
                fontFamily: "var(--pr-ui)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              STOCKS: {st.flavors}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
