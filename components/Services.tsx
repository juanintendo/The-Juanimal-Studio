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

      <div className="svc-grid pkg-grid-5">
        {pkg.cards.map((s) => {
          const isPopular = s.num === "A";
          const isEntry = s.num === "00";
          return (
            <Reveal
              as="article"
              className={`svc-card pkg-card${isPopular ? " pkg-card-popular" : ""}${isEntry ? " pkg-card-entry" : ""}`}
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

      {/* Market Reality Comparison Matrix */}
      <div className="pkg-matrix-block">
        <h3 className="pkg-matrix-title">{pkg.matrixTitle}</h3>
        <div className="cs-table-wrap">
          <table className="cs-table pkg-matrix-table">
            <thead>
              <tr>
                {pkg.matrixCols.map((col, idx) => (
                  <th
                    key={col}
                    className={idx === 3 ? "is-ours-col" : undefined}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pkg.matrixRows.map((row) => (
                <tr key={row.metric}>
                  <td>
                    <strong>{row.metric}</strong>
                  </td>
                  <td>{row.low}</td>
                  <td>{row.mid}</td>
                  <td className="is-ours-cell">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
