"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function AboutHero() {
  const { t } = useLanguage();

  return (
    <header className="merch-hero about-hero" id="top">
      <Reveal as="span" className="eyebrow about-hero-eyebrow">
        {t.about.eyebrow}
      </Reveal>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="about-hero-logotype"
        src="/images/brand-logotype-v2.png"
        alt="The Juanimal Studio"
      />
      <Reveal as="p" className="about-hero-lede">
        {t.about.lede}
      </Reveal>
    </header>
  );
}

export function AboutStory() {
  const { t } = useLanguage();

  return (
    <section className="services sec-pad" id="about-story">
      <Reveal as="span" className="eyebrow">
        {t.about.storyEyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        {t.about.storyTitle1}
        <br />
        <span className="accent">{t.about.storyTitleAccent}</span>
      </Reveal>
      <Reveal as="p" className="about-lede">
        {t.about.p1}
      </Reveal>
      <Reveal as="p" className="about-lede">
        {t.about.p2}
      </Reveal>
      <Reveal as="p" className="about-lede">
        {t.about.p3}
      </Reveal>
    </section>
  );
}

export function AboutApproach() {
  const { t } = useLanguage();

  return (
    <section className="services sec-pad about-approach" id="approach">
      <Reveal as="span" className="eyebrow">
        {t.about.approachEyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        {t.about.approachTitle1}
        <br />
        <span className="accent">{t.about.approachTitleAccent}</span>
      </Reveal>
      <div className="svc-grid">
        {t.about.approachCards.map((step) => (
          <Reveal as="article" className="svc-card" key={step.num}>
            <span className="svc-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutCTA() {
  const { t } = useLanguage();

  return (
    <section className="aged sec-pad" id="about-cta">
      <div className="inner">
        <Reveal as="span" className="script">
          {t.about.ctaScript}
        </Reveal>
        <Reveal as="h2">
          {t.about.ctaTitle1}
          <br />
          {t.about.ctaTitleAccent}
        </Reveal>
        <Reveal as="div">
          <Link className="cta-btn" href="/contact">
            {t.about.ctaBtn}
          </Link>
        </Reveal>
        <p className="foot-note">{t.contact.footNote}</p>
      </div>
    </section>
  );
}

export function AboutFooter() {
  const { t } = useLanguage();

  return (
    <section className="merch-foot-cta">
      <p>{t.about.footCtaLine}</p>
      <div className="about-foot-links">
        <a
          href="https://fuelorfool.ing"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.about.footCtaLab}
        </a>
        <Link href="/merch">{t.about.footCtaMerch}</Link>
      </div>
    </section>
  );
}
