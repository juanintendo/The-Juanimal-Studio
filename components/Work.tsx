"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function Work() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<string | null>("frame-by-agents");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  return (
    <section className="work sec-pad" id="work">
      <Reveal as="span" className="eyebrow">
        {t.work.eyebrow}
      </Reveal>
      <Reveal
        as="h2"
        className="sec-h2"
        style={{ marginBottom: "clamp(36px,5vw,64px)" }}
      >
        {t.work.title}
      </Reveal>
      {t.work.items.map((w) => {
        const isOpen = open === w.id;
        const isExternal = "external" in w && w.external;
        return (
          <Reveal as="div" className="work-item" key={w.id}>
            <button
              type="button"
              className="work-row work-row-btn"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : w.id)}
            >
              <h3>{w.title}</h3>
              <span className="work-meta">{w.meta}</span>
            </button>
            <div className={`work-case${isOpen ? " work-case-open" : ""}`}>
              <div className="work-case-inner">
                <button
                  type="button"
                  className="work-case-img-btn"
                  onClick={() =>
                    setLightbox({ src: w.image, alt: w.imageAlt })
                  }
                  aria-label="Expand image"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image}
                    alt={w.imageAlt}
                    className="work-case-img"
                    loading="lazy"
                  />
                </button>
                <div className="work-case-body">
                  <span className="work-case-eyebrow">{w.intro}</span>
                  {w.paragraphs.map((p, i) => (
                    <p className="work-case-p" key={i}>
                      {p}
                    </p>
                  ))}
                  <dl className="work-case-facts">
                    {w.facts.map((f) => (
                      <div className="work-case-fact" key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {isExternal ? (
                    <a
                      className="cta-btn work-case-cta"
                      href={w.processHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {w.ctaLabel}
                    </a>
                  ) : (
                    <Link className="cta-btn work-case-cta" href={w.processHref}>
                      {w.ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}

      {lightbox && (
        <div
          className="work-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="work-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label={t.work.closeLabel}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="work-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
