"use client";

import { Reveal } from "@/components/Reveal";

const work = [
  { title: "Retail Analytics Suite", meta: "AI Tool • 2026" },
  { title: "Fintech Onboarding App", meta: "UX/UI + App • 2025" },
  { title: "Logistics Dashboard", meta: "Web App • 2025" },
  { title: "AI Support Copilot", meta: "AI Implementation • 2024" },
] as const;

export function Work() {
  return (
    <section className="work sec-pad" id="work">
      <Reveal as="span" className="eyebrow">
        Selected work
      </Reveal>
      <Reveal
        as="h2"
        className="sec-h2"
        style={{ marginBottom: "clamp(36px,5vw,64px)" }}
      >
        Fresh off the press
      </Reveal>
      {work.map((w) => (
        <Reveal as="a" className="work-row" href="#contact" key={w.title}>
          <h3>{w.title}</h3>
          <span className="work-meta">{w.meta}</span>
        </Reveal>
      ))}
    </section>
  );
}
