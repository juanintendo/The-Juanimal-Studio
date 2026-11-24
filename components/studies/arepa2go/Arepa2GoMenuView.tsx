"use client";

import { useMemo, useState } from "react";
import { AREPA_MENU, type ArepaCategory } from "./catalog";
import { useArepa2GoTray } from "./Arepa2GoShell";

export default function Arepa2GoMenuView() {
  const { addToTray } = useArepa2GoTray();
  const [cat, setCat] = useState<"all" | ArepaCategory>("all");
  const [gfOnly, setGfOnly] = useState(false);

  const items = useMemo(
    () =>
      AREPA_MENU.filter((item) => {
        if (cat !== "all" && item.category !== cat) return false;
        if (gfOnly && !item.glutenFree) return false;
        return true;
      }),
    [cat, gfOnly]
  );

  return (
    <>
      <section className="a2g-sub-hero">
        <div className="a2g-kicker">FULL FOOD &amp; DRINKS CATALOG</div>
        <h1>Every handmade bite &amp; tropical sip.</h1>
        <p>
          Filter by category or gluten-free status. All arepas &amp; empanadas
          are 100% naturally gluten-free white corn masa.
        </p>

        <div className="a2g-hero-switcher" style={{ justifyContent: "flex-start" }}>
          {[
            { id: "all", label: "ALL (14)" },
            { id: "arepas", label: "AREPAS (6)" },
            { id: "sides", label: "EMPANADAS & SIDES (5)" },
            { id: "drinks", label: "DRINKS & DIPS (3)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`a2g-switch-pill ${cat === tab.id ? "active" : ""}`}
              onClick={() => setCat(tab.id as "all" | ArepaCategory)}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            className={`a2g-switch-pill ${gfOnly ? "active" : ""}`}
            style={
              gfOnly
                ? { backgroundColor: "#F8C61E", color: "#111", borderColor: "#F8C61E" }
                : undefined
            }
            onClick={() => setGfOnly((v) => !v)}
          >
            {gfOnly ? "✓ GLUTEN-FREE ONLY" : "GLUTEN-FREE ONLY"}
          </button>
        </div>
      </section>

      <section className="a2g-lineup-band" style={{ borderBottom: 0 }}>
        <div className="a2g-product-grid">
          {items.map((item) => (
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
                <h2 className="a2g-card-title">{item.name}</h2>
                <p className="a2g-card-desc">{item.description}</p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    color: "#777",
                  }}
                >
                  {item.ingredients}
                </p>
              </div>
              <div className="a2g-card-foot">
                <span className="a2g-card-price">£{item.price.toFixed(2)}</span>
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
    </>
  );
}
