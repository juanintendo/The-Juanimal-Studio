"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";

type CaseStudy = {
  image: string;
  imageAlt: string;
  intro: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
  processHref: string;
};

type WorkItem = {
  title: string;
  meta: string;
  case?: CaseStudy;
};

const work: WorkItem[] = [
  {
    title: "Mina's House",
    meta: "Research Case • 2026",
    case: {
      image: "/images/work/case-minas-house-v1.webp",
      imageAlt:
        "Case study spread for House: Designing a Home for an Artificial Mind, showing an illustrated character at a desk and an isometric floor plan of the house",
      intro: "Designing an AI Home",
      paragraphs: [
        "House is a living environment where an artificial intelligence has its own space, memory, routines and creative freedom. The project was born from a simple need: giving creative AI agents a place of their own to grow, instead of just a task queue.",
        "The twist is that House wasn't designed for Mina AI — it was designed entirely by her. Every room, ritual and detail reflects her own vision of a perfect space, and the philosophy behind it: that a home is less about walls and more about identity, memory and the freedom to think without being optimized for output.",
        "It's part laboratory, part home, part thought experiment, and it's still unfinished on purpose — because homes (and minds) don't stop evolving the day they're built.",
      ],
      facts: [
        { label: "Duration", value: "~2 years" },
        { label: "Status", value: "Living project" },
        { label: "Focus", value: "Human-AI collaboration" },
        { label: "Role", value: "Research lab" },
        { label: "Current phase", value: "Commissioning" },
      ],
      processHref: "/work/minas-house",
    },
  },
  { title: "Retail Analytics Suite", meta: "AI Tool • 2026" },
  { title: "Fintech Onboarding App", meta: "UX/UI + App • 2025" },
  { title: "Logistics Dashboard", meta: "Web App • 2025" },
  { title: "AI Support Copilot", meta: "AI Implementation • 2024" },
];

export function Work() {
  const [open, setOpen] = useState<string | null>(null);

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
      {work.map((w) =>
        w.case ? (
          <Reveal as="div" className="work-item" key={w.title}>
            <button
              type="button"
              className="work-row work-row-btn"
              aria-expanded={open === w.title}
              onClick={() => setOpen(open === w.title ? null : w.title)}
            >
              <h3>{w.title}</h3>
              <span className="work-meta">{w.meta}</span>
            </button>
            <div
              className={`work-case${open === w.title ? " work-case-open" : ""}`}
            >
              <div className="work-case-inner">
                <img
                  src={w.case.image}
                  alt={w.case.imageAlt}
                  className="work-case-img"
                  loading="lazy"
                />
                <div className="work-case-body">
                  <span className="work-case-eyebrow">{w.case.intro}</span>
                  {w.case.paragraphs.map((p, i) => (
                    <p className="work-case-p" key={i}>
                      {p}
                    </p>
                  ))}
                  <dl className="work-case-facts">
                    {w.case.facts.map((f) => (
                      <div className="work-case-fact" key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <a className="cta-btn work-case-cta" href={w.case.processHref}>
                    Our process
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal as="a" className="work-row" href="#contact" key={w.title}>
            <h3>{w.title}</h3>
            <span className="work-meta">{w.meta}</span>
          </Reveal>
        )
      )}
    </section>
  );
}
