"use client";

import Link from "next/link";
import { LaunchFilmPlayer } from "@/components/LaunchFilmPlayer";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";

export function LaunchKitShowcase() {
  const { t } = useLanguage();
  const s = t.launchShowcase;

  return (
    <section className="launch-showcase sec-pad" id="launch-kit">
      <div className="launch-showcase-head">
        <div>
          <Reveal as="span" className="eyebrow">
            {s.eyebrow}
          </Reveal>
          <Reveal as="h2" className="sec-h2">
            {s.titleLine1}
            <br />
            <span className="accent">{s.titleAccent}</span>
          </Reveal>
          <Reveal as="p" className="launch-lede">
            {s.lede}
          </Reveal>
        </div>
        <Link href="/work/frame-by-agents" className="launch-case-link">
          {s.caseLink}
        </Link>
      </div>

      <LaunchFilmPlayer />
    </section>
  );
}
