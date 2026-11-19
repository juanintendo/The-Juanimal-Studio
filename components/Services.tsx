"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function Services() {
  const { t } = useLanguage();
  const pkg = t.packages;

  return (
    <section className="services sec-pad" id="packages">
      <Reveal as="span" className="eyebrow">
        {pkg.eyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        {pkg.titleLine1}
        <br />
        <span className="accent">{pkg.titleAccent}</span>
      </Reveal>
      <Reveal as="p" className="about-lede">
        {pkg.lede}
      </Reveal>

      <div className="svc-grid pkg-grid">
        {pkg.cards.map((s) => {
          const isPopular = s.num === "A";
          return (
            <Reveal
              as="article"
              className={`svc-card pkg-card${isPopular ? " pkg-card-popular" : ""}`}
              key={s.num}
            >
              <span className="svc-num">{s.num}</span>
              <div className="pkg-top-row">
                <span className={`pkg-badge${isPopular ? " is-popular" : ""}`}>
                  {s.badge}
                </span>
                <span className="pkg-price">{s.price}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul className="pkg-list">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
