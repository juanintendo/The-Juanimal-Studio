"use client";

import { Fragment } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export function Tape() {
  const { t } = useLanguage();
  const loop = [...t.tape, ...t.tape];

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
