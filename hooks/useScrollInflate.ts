"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { clamp } from "@/lib/motion";

/**
 * Scroll-driven variable-font inflation ported from fuelorfool/site.js.
 * Smoothly drives `--w` (62..125) and `--g` (300..900) on `[data-inflate]`
 * elements as a pure function of viewport scroll position.
 */
export function useScrollInflate(selector = "[data-inflate]") {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    if (reduced) {
      for (const el of els) {
        el.style.setProperty("--w", "125");
        el.style.setProperty("--g", "900");
      }
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight || 800;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -60 || r.top > h + 60) continue;
        const p = clamp((h - r.top) / (h * 0.34), 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.style.setProperty("--w", (62 + 63 * e).toFixed(1));
        el.style.setProperty("--g", (300 + 600 * e).toFixed(0));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [selector, reduced]);
}
