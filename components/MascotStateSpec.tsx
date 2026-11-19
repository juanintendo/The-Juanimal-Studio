"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { clamp, spring, twos, volumeSquash } from "@/lib/motion";

type MascotStateId = "idle" | "thinking" | "pass" | "drift";

const RIVE_SNIPPET = `import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { spring, volumeSquash } from "@/lib/motion";

export function AgentStatusMascot({ state }: { state: "idle" | "thinking" | "pass" | "drift" }) {
  const { rive, RiveComponent } = useRive({
    src: "/riv/juanimal-qa-state-v1.riv",
    stateMachines: "AgentQA",
    autoplay: true,
  });

  // Trigger baseline squash-and-stretch stamp on QA pass (scaleX * scaleY === 1)
  // k=120, c=14 -> 7.4% overshoot, 16-frame settle at 60fps
  const passTrigger = useStateMachineInput(rive, "AgentQA", "onPass");
  return <RiveComponent aria-label={\`Agent status: \${state}\`} />;
}`;

export function MascotStateSpec() {
  const { t: copy } = useLanguage();
  const spec = copy.process.mascotSpec;
  const reduced = usePrefersReducedMotion();

  const [stateId, setStateId] = useState<MascotStateId>("idle");
  const [stateElapsed, setStateElapsed] = useState(0);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    setStateElapsed(0);
    if (reduced) return;

    let raf = 0;
    const tick = (now: number) => {
      setStateElapsed((now - startRef.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stateId, reduced]);

  const activeDef =
    spec.states.find((s) => s.id === stateId) ?? spec.states[0];

  const t12 = twos(stateElapsed);

  // Compute deterministic physical transforms per state
  let mascotTransform = "none";
  let lensPulse = 0;
  if (!reduced) {
    if (stateId === "idle") {
      // Stepped 12fps breathing (on twos), asymmetrical offset
      const breath = Math.sin(t12 * 2.2) * 0.025;
      mascotTransform = `${volumeSquash(1 + breath)} translateY(${(-breath * 60).toFixed(1)}px)`;
    } else if (stateId === "thinking") {
      // Anticipation tilt (-6deg) + subtle stepped micro-bob
      const s = spring(stateElapsed, 120, 14);
      const bob = Math.sin(t12 * 6) * 3;
      mascotTransform = `rotate(${(-5 * clamp(s, 0, 1.08)).toFixed(2)}deg) translateY(${bob.toFixed(1)}px)`;
      lensPulse = 0.5 + 0.5 * Math.sin(stateElapsed * 8);
    } else if (stateId === "pass") {
      // Baseline volume-preserving squash stamp (k=120, c=14)
      const s = spring(stateElapsed, 120, 14);
      const impact = stateElapsed < 0.25 ? 0.88 + s * 0.16 : 1 + (s - 1) * 0.3;
      mascotTransform = volumeSquash(impact);
    } else if (stateId === "drift") {
      // Recoil counter-move & fast critically-damped snap back (k=300, c=30)
      const recoil = stateElapsed < 0.18 ? -12 : 0;
      const s = spring(Math.max(0, stateElapsed - 0.18), 300, 30);
      const x = stateElapsed < 0.18 ? recoil : recoil * (1 - s);
      mascotTransform = `translateX(${x.toFixed(1)}px) rotate(${(x * 0.3).toFixed(1)}deg)`;
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RIVE_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* fallback no-op */
    }
  };

  return (
    <div className="mspec-card">
      <div className="mspec-header">
        <div>
          <span className="mspec-eyebrow">{spec.eyebrow}</span>
          <h3 className="mspec-title">{spec.title}</h3>
          <p className="mspec-desc">{spec.desc}</p>
        </div>
        <button
          type="button"
          className="lfp-btn-sec"
          aria-expanded={inspectorOpen}
          onClick={() => setInspectorOpen((v) => !v)}
        >
          {inspectorOpen ? spec.inspectorOpen : spec.inspectorClosed}
        </button>
      </div>

      <div className="mspec-body">
        {/* Interactive Mascot Stage */}
        <div className={`mspec-stage mspec-state-${stateId}`}>
          <div className="mspec-hud-top">
            <span className="mspec-badge">{activeDef.badge}</span>
            <span className="lfp-tabular">12 FPS / SPRING</span>
          </div>

          <div className="mspec-mascot-wrap">
            {/* Registration Corner Crosshairs */}
            <svg
              className="mspec-reg-overlay"
              viewBox="0 0 320 240"
              aria-hidden="true"
            >
              <path
                d="M20 40 L20 20 L40 20 M280 20 L300 20 L300 40 M20 200 L20 220 L40 220 M280 220 L300 220 L300 200"
                fill="none"
                stroke={
                  stateId === "drift"
                    ? "#E04E1F"
                    : stateId === "pass"
                      ? "#1C8C54"
                      : "#171009"
                }
                strokeWidth="3"
              />
              {stateId === "thinking" && (
                <g opacity={0.35 + lensPulse * 0.55}>
                  <circle cx="118" cy="88" r="14" fill="#E04E1F" />
                  <circle cx="152" cy="88" r="14" fill="#19A4FF" />
                </g>
              )}
              {stateId === "drift" && (
                <rect
                  x="36"
                  y="30"
                  width="248"
                  height="180"
                  rx="8"
                  fill="none"
                  stroke="#E04E1F"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              )}
            </svg>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/v3/ag-director-emblem.png"
              alt="Juanimal Robo-Dragon Director Mascot interactive state preview"
              className="mspec-mascot-img"
              style={{
                transformOrigin: "50% 100%",
                transform: mascotTransform,
              }}
            />

            {stateId === "pass" && (
              <div className="mspec-stamp-pass">✓ ON MODEL</div>
            )}
            {stateId === "drift" && (
              <div className="mspec-stamp-drift">✕ DRIFT → ROLLBACK</div>
            )}
          </div>

          <div className="mspec-hud-foot">
            <code>{activeDef.principle}</code>
            <span className="lfp-tabular">{activeDef.springParams}</span>
          </div>
        </div>

        {/* Trigger Controls + Live State Description */}
        <div className="mspec-controls">
          <div className="mspec-trigger-grid" role="group" aria-label="Trigger Mascot States">
            {spec.states.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`mspec-trigger-btn${stateId === st.id ? " is-active" : ""}`}
                onClick={() => setStateId(st.id)}
              >
                <span className="mspec-trig-dot" aria-hidden="true" />
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          <div className="mspec-status-box">
            <strong>{activeDef.badge}</strong>
            <p>{activeDef.statusText}</p>
          </div>

          <div className="mspec-graph">
            <div className="mspec-node">IDLE</div>
            <span aria-hidden="true">→</span>
            <div className="mspec-node">THINKING</div>
            <span aria-hidden="true">→</span>
            <div className="mspec-node">QA PASS / DRIFT</div>
          </div>
        </div>
      </div>

      {/* Expandable Inspector Drawer */}
      {inspectorOpen && (
        <div className="mspec-drawer">
          <div className="mspec-drawer-head">
            <span>STATE MACHINE &amp; PHYSICS CODE (RIVE / REACT)</span>
            <button type="button" className="lfp-btn-sec" onClick={handleCopy}>
              {copied ? spec.copiedBtn : spec.copyBtn}
            </button>
          </div>
          <pre className="mspec-code">
            <code>{RIVE_SNIPPET}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
