"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STATS = [
  { count: 7, label: "Current projects" },
  { count: 48, label: "Shipped projects" },
  { count: 12, label: "Tools sold to business" },
  { count: 6, label: "Years in print" },
] as const;

function StatItem({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(0);
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
      { threshold: 0.6 }
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
    const dur = 1400;

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
      <div className="stat-num">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="stats" id="stats" aria-label="Studio numbers">
      <div className="stats-grid">
        {STATS.map((s) => (
          <StatItem key={s.label} count={s.count} label={s.label} />
        ))}
      </div>
    </section>
  );
}
