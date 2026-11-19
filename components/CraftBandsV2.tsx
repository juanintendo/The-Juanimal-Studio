"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useScrollInflate } from "@/hooks/useScrollInflate";

export function CraftBandsV2() {
  const { t } = useLanguage();
  useScrollInflate("[data-inflate]");

  return (
    <section className="cb-wrap" aria-label="Studio capabilities">
      {t.craftBands.map((band) => (
        <div key={band.num} className={`cb-band cb-${band.variant}`}>
          <div className="cb-left">
            <span className="cb-num lfp-tabular">{band.num}</span>
            <h2 className="cb-title" data-inflate>
              {band.title}
            </h2>
          </div>
          <p className="cb-desc">{band.desc}</p>
        </div>
      ))}
    </section>
  );
}
