import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Perrero Sauce Co.",
  description:
    "It is not about cooking. It's about building the flavor — born on 3AM Caracas street corners.",
};

export default function PerreroAboutPage() {
  return (
    <>
      <section className="pr-about-hero">
        <div className="pr-about-lines">
          <p className="pr-about-kicker">
            IT IS NOT ABOUT COOKING. IT&apos;S ABOUT
          </p>
          <h1 className="pr-about-h1">
            BUILDING
            <br />
            THE
            <br />
            <span className="pr-outline">FLAVOR</span>
          </h1>
          <img
            src="/images/studies/perrero/prop-wooden-spoon.png"
            alt=""
            className="pr-about-spoon"
          />
          <img
            src="/images/studies/perrero/prop-sauce-pot.png"
            alt="Small batch sauce simmering"
            className="pr-about-pot"
          />
        </div>
      </section>

      <section className="pr-story-grid">
        <div className="pr-scene-frame">
          <img
            src="/images/studies/perrero/scene-street-cart.jpg"
            alt="Late-night Caracas perrero street cart"
            className="pr-scene-img"
          />
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              fontFamily: "var(--pr-ui)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "var(--pr-gold)",
            }}
          >
            CARACAS · SABANA GRANDE &amp; LAS MERCEDES
          </div>
          <h2
            style={{
              fontFamily: "var(--pr-disp)",
              fontSize: "clamp(36px, 4.4vw, 56px)",
              lineHeight: 0.94,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            BORN AT 3AM ON A STAINLESS STEEL CORNER CART
          </h2>
          <p style={{ margin: 0, color: "var(--pr-dim)", lineHeight: 1.65 }}>
            In Caracas, nobody asks for just mustard and ketchup. You stand under
            a warm streetlamp at 3AM and watch the perrero build layers: fresh
            emerald guasacaca with zero mayo, triple-garlic emulsion, charred sweet
            corn drizzle, smoky bacon tartar, and fiery ají dulce.
          </p>
          <p style={{ margin: 0, color: "var(--pr-dim)", lineHeight: 1.65 }}>
            We bottled those exact five corner legends in tight small batches —
            zero corn syrup, zero industrial seed oils, and zero shortcuts.
          </p>

          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
            <Link href="/studies/perrero/shop" className="pr-pill-cta">
              SHOP ALL 5 SAUCES →
            </Link>
            <img
              src="/images/studies/perrero/sticker-3am-caracas.png"
              alt="3.AM Caracas Sticker"
              style={{ width: 82, height: 82, objectFit: "contain" }}
            />
            <img
              src="/images/studies/perrero/sticker-small-batch.png"
              alt="Small Batch Sticker"
              style={{ width: 82, height: 82, objectFit: "contain" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
