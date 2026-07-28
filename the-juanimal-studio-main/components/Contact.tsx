"use client";

import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section className="aged sec-pad" id="contact">
      <div className="inner">
        <Reveal as="span" className="script">
          Or age your competition&hellip;
        </Reveal>
        <Reveal as="h2">
          Almost beyond
          <br />
          recognition
        </Reveal>
        <Reveal as="a" className="cta-btn" href="mailto:hello@juanimal.studio">
          Start a project
        </Reveal>
        <p className="foot-note">
          &copy; The Juanimal Studio &mdash; Tech Wizard &bull; UX/UI &bull; AI
          &bull; Tools for Business
        </p>
      </div>
    </section>
  );
}
