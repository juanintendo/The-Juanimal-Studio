"use client";

import { Fragment } from "react";

const ITEMS = [
  "UX/UI Design",
  "Web Development",
  "App Development",
  "AI Implementation",
  "Business Tools",
  "Branding & Graphic Design",
] as const;

export function Tape() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="tape" aria-hidden="true">
      <div className="tape-inner">
        {loop.map((label, i) => (
          <Fragment key={`${label}-${i}`}>
            <span>{label}</span>
            <span className="dotsep">&#10022;</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
