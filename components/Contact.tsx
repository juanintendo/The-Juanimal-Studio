"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section className="aged sec-pad" id="contact">
      <div className="inner">
        <Reveal as="span" className="script">
          {t.contact.ctaScript}
        </Reveal>
        <Reveal as="h2">
          {t.contact.ctaHeadline1}
          <br />
          {t.contact.ctaHeadline2}
        </Reveal>
        <Reveal as="div">
          <Link className="cta-btn" href="/contact">
            {t.contact.ctaBtn}
          </Link>
        </Reveal>
        <div className="foot-links-row">
          <a
            href="https://fuelorfool.ing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our Lab (fuelorfool.ing) ↗
          </a>
          <span aria-hidden="true">·</span>
          <a href="mailto:hello@juanimal.studio">hello@juanimal.studio</a>
          <span aria-hidden="true">·</span>
          <Link href="/merch">Studio Merch</Link>
        </div>
        <p className="foot-note">{t.contact.footNote}</p>
      </div>
    </section>
  );
}
