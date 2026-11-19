"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function StatItem({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Initialize to `count` so SSR HTML and initial paint never show 0.
  const [value, setValue] = useState(count);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setValue(count);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const dur = 1200;

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(count * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, count, reduced]);

  return (
    <div ref={ref} className={visible ? "reveal in" : "reveal"}>
      <div className="stat-num lfp-tabular">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export function Stats() {
  const { t } = useLanguage();

  return (
    <section className="stats" id="stats" aria-label="Studio numbers">
      <div className="stats-grid">
        {t.stats.map((s) => (
          <StatItem key={s.label} count={s.count} label={s.label} />
        ))}
      </div>
    </section>
  );
}
