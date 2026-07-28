"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function AboutHero() {
  return (
    <header className="merch-hero about-hero" id="top">
      <Reveal as="span" className="eyebrow about-hero-eyebrow">
        About a Wizard
      </Reveal>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="about-hero-logotype"
        src="/images/brand-logotype.png"
        alt="The Juanimal Studio"
      />
      <Reveal as="p" className="about-hero-lede">
        Part designer, part developer, full-time tinkerer. One studio, One
        Wizard and All Magic! — every project gets treated like a spell worth
        getting right. This is the right Studio for the most daring projects.
      </Reveal>
    </header>
  );
}

const APPROACH = [
  {
    num: "A",
    title: "Discover",
    body: "Ask the annoying questions early — who's actually using this, what breaks if we ship it wrong, what does \u201cdone\u201d even mean here.",
  },
  {
    num: "B",
    title: "Design",
    body: "Wireframes fast, prototypes faster. Real feedback loops instead of guessing behind a locked Figma file for three weeks.",
  },
  {
    num: "C",
    title: "Build",
    body: "Ship in small, testable pieces. Clean code, sensible defaults, nothing held together with duct tape and good intentions.",
  },
  {
    num: "D",
    title: "Support",
    body: "Stick around after launch day. Bugs get fixed, questions get answered, the spell keeps working long after the ink dries.",
  },
] as const;

export function AboutStory() {
  return (
    <section className="services sec-pad" id="about-story">
      <Reveal as="span" className="eyebrow">
        The origin story
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        Half circuit board,
        <br />
        <span className="accent">half sketchbook</span>
      </Reveal>
      <Reveal as="p" className="about-lede">
        The Juanimal Studio started the same way most good tools do — out of
        frustration with the bad ones. Years of shipping interfaces, wiring
        up AI where it actually helps (not where it looks good in a deck),
        and building the odd tool that saves a team real hours every week,
        turned into a studio built around one idea: fewer slides, more
        shipped work.
      </Reveal>
      <Reveal as="p" className="about-lede">
        No account managers, no six-person status meetings — just a direct
        line to the person actually doing the work. Fiery when it needs to
        be, careful where it counts.
      </Reveal>
    </section>
  );
}

export function AboutApproach() {
  return (
    <section className="services sec-pad about-approach" id="approach">
      <Reveal as="span" className="eyebrow">
        How it works
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        A process that survives
        <br />
        <span className="accent">contact with reality</span>
      </Reveal>
      <div className="svc-grid">
        {APPROACH.map((step) => (
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
  return (
    <section className="aged sec-pad" id="about-cta">
      <div className="inner">
        <Reveal as="span" className="script">
          Got a project brewing&hellip;?
        </Reveal>
        <Reveal as="h2">
          Let&rsquo;s cast
          <br />
          something together
        </Reveal>
        <Reveal as="a" className="cta-btn" href="/#contact">
          Summon me
        </Reveal>
        <p className="foot-note">
          &copy; The Juanimal Studio &mdash; Tech Wizard &bull; UX/UI &bull; AI
          &bull; Tools for Business
        </p>
      </div>
    </section>
  );
}

export function AboutFooter() {
  return (
    <section className="merch-foot-cta">
      <p>&ldquo;Every good spell needs a wizard behind it&hellip;&rdquo;</p>
      <Link href="/merch">See the merch</Link>
    </section>
  );
}
