import type { Metadata } from "next";
import Link from "next/link";
import { CRAFT_PILLARS } from "@/components/studies/arepa2go/catalog";

export const metadata: Metadata = {
  title: "Ingredients & Dips | Arepa 2GO",
  description:
    "100% gluten-free white corn masa, fresh house-made guasacaca, garlic & picante dips.",
};

export default function Arepa2GoIngredientsPage() {
  return (
    <>
      <section className="a2g-sub-hero">
        <div className="a2g-kicker">NUTRITION &amp; INGREDIENTS GUIDE</div>
        <h1>Pure white corn masa &amp; three daily house dips.</h1>
        <p>
          Inspired by CalorieMate&apos;s nutrition clarity: transparent
          ingredients, naturally gluten-free corn pockets, and zero shortcuts in
          the kitchen.
        </p>
      </section>

      <section className="a2g-statement">
        <div>
          <div className="a2g-kicker">01 · THE HOUSE DIPS TRIO</div>
          <h2>Guasacaca, Garlic &amp; Picante — blended every morning.</h2>
          <p>
            <strong>Guasacaca:</strong> Our emerald house signature — ripe Hass
            avocado, fresh cilantro, green pepper &amp; lime.
            <br />
            <strong>Garlic Sauce:</strong> Silky traditional Venezuelan garlic
            emulsion made for tequeños and Pelúa arepas.
            <br />
            <strong>Picante:</strong> Bright Venezuelan hot chili sauce for
            those who like extra heat.
          </p>
          <Link href="/studies/arepa2go/menu" className="a2g-btn-primary">
            ORDER WITH DIPS →
          </Link>
        </div>

        <div className="a2g-box-frame" style={{ padding: 24 }}>
          <img
            src="/images/studies/arepa2go/dips-trio.png"
            alt="Guasacaca, Garlic, and Picante house dips"
            className="a2g-box-img"
          />
        </div>
      </section>

      <section className="a2g-craft-band" style={{ borderBottom: 0 }}>
        <div className="a2g-craft-inner">
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
        </div>
      </section>
    </>
  );
}
