"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { MascotStateSpec } from "@/components/MascotStateSpec";
import { Reveal } from "@/components/Reveal";

export function ProcessSection() {
  const { t } = useLanguage();
  const proc = t.process;

  return (
    <section className="process-sec sec-pad" id="process">
      <Reveal as="span" className="eyebrow">
        {proc.eyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        {proc.titleLine1}
        <br />
        <span className="accent">{proc.titleAccent}</span>
      </Reveal>
      <Reveal as="p" className="about-lede">
        {proc.lede}
      </Reveal>

      <div className="svc-grid proc-grid">
        {proc.steps.map((step) => (
          <Reveal as="article" className="svc-card proc-card" key={step.num}>
            <span className="svc-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </Reveal>
        ))}
      </div>

      <MascotStateSpec />
    </section>
  );
}
