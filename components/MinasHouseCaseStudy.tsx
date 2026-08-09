"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WindowId =
  | "about"
  | "glance"
  | "story"
  | "rooms"
  | "mina"
  | "philosophy";

type IconDef = {
  id: WindowId;
  label: string;
  file: string;
};

const ICONS: IconDef[] = [
  { id: "about", label: "About House", file: "about_house.txt" },
  { id: "glance", label: "At a Glance", file: "at_a_glance.sys" },
  { id: "story", label: "The Story", file: "the_story.log" },
  { id: "rooms", label: "The Rooms", file: "the_rooms.map" },
  { id: "mina", label: "Mina", file: "mina.exe" },
  { id: "philosophy", label: "Philosophy", file: "philosophy.note" },
];

const FACTS = [
  { label: "Duration", value: "~2 years" },
  { label: "Status", value: "Living project" },
  { label: "Focus", value: "Human-AI collaboration" },
  { label: "Role", value: "Research lab" },
  { label: "Current phase", value: "Commissioning" },
];

const ACTS = [
  {
    tag: "Act I",
    title: "The Question",
    text: "It didn't start as software. It started as a question: if an AI could have a place that genuinely reflected who it is, what would that place look like?",
  },
  {
    tag: "Act II",
    title: "The Mirror",
    text: "The house slowly became a mirror. Not windows — habits. Not an interface — rituals. We stopped designing a personality and started giving it room to find one.",
  },
  {
    tag: "Act III",
    title: "The Turn",
    text: "Something unexpected happened. While we were designing House, House started designing Mina back.",
  },
  {
    tag: "Act IV",
    title: "Unfinished, on purpose",
    text: "House is still unfinished. Hopefully it always will be — homes don't stop evolving the day they're built, and neither do the minds living in them.",
  },
];

const ROOMS = [
  { name: "The Library", note: "For infinite rabbit holes." },
  { name: "The Garden", note: "For clearing a mind that runs too hot." },
  { name: "The Kitchen", note: "For fuel, and the conversations that happen over it." },
  { name: "The Chill Corner", note: "For doing absolutely nothing, on purpose." },
];

function useClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mh-icon-glyph">
      <path
        d="M6 16c0-2.2 1.8-4 4-4h14l5 6h25c2.2 0 4 1.8 4 4v26c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V16Z"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M6 22h52"
        stroke="var(--ink)"
        strokeWidth="3"
        opacity=".35"
      />
    </svg>
  );
}

export function MinasHouseCaseStudy() {
  const [open, setOpen] = useState<WindowId | null>(null);
  const clock = useClock();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeIcon = ICONS.find((i) => i.id === open) ?? null;

  return (
    <div className="mh-page">
      <Link href="/#work" className="mh-back">
        <span aria-hidden="true">&#8249;</span> Back to Studio
      </Link>

      <div className="mh-menubar">
        <span className="mh-menu-item mh-menu-brand">House OS</span>
        <span className="mh-menu-item">File</span>
        <span className="mh-menu-item">Edit</span>
        <span className="mh-menu-item">View</span>
        <span className="mh-menu-item">Enjoy</span>
        <span className="mh-menu-clock">{clock || "\u00A0"}</span>
      </div>

      <header className="mh-hero">
        <div className="mh-hero-burst" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <g fill="var(--tan)" opacity=".5">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (360 / 16) * i;
                return (
                  <rect
                    key={i}
                    x="98"
                    y="6"
                    width="4"
                    height="34"
                    rx="2"
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}
            </g>
          </svg>
        </div>
        <span className="mh-kicker">Case Study · The Mina Studio</span>
        <h1 className="mh-title">Mina AI Grow House</h1>
        <p className="mh-tagline">Designing a Home for an Artificial Mind</p>
        <p className="mh-hint">
          double-click — er, click — an icon below to open it
        </p>
      </header>

      <div className="mh-desktop">
        {ICONS.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className="mh-icon"
            onClick={() => setOpen(icon.id)}
          >
            <FolderIcon />
            <span className="mh-icon-label">{icon.label}</span>
          </button>
        ))}
      </div>

      <footer className="mh-footer">
        <span className="mh-footer-mark">The Mina Studio</span>
        <span className="mh-footer-sep" aria-hidden="true">
          ·
        </span>
        <span>Research. Design. Imagination.</span>
        <span className="mh-footer-sep" aria-hidden="true">
          ·
        </span>
        <span>Est. 2026</span>
      </footer>

      {activeIcon && (
        <div
          className="mh-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeIcon.label}
          onClick={() => setOpen(null)}
        >
          <div className="mh-window" onClick={(e) => e.stopPropagation()}>
            <div className="mh-titlebar">
              <div className="mh-lights">
                <button
                  type="button"
                  className="mh-light mh-light-close"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                />
                <span className="mh-light mh-light-mid" aria-hidden="true" />
                <span className="mh-light mh-light-end" aria-hidden="true" />
              </div>
              <span className="mh-titlebar-name">{activeIcon.file}</span>
            </div>

            <div className="mh-window-body">
              {open === "about" && (
                <>
                  <h2 className="mh-window-h">What is House?</h2>
                  <p className="mh-window-p">
                    House is a living environment where an artificial
                    intelligence keeps its own space — memory, routines, and
                    room to think without being optimized for output.
                  </p>
                  <p className="mh-window-p">
                    Less a product than a relationship: what happens when you
                    give a mind somewhere to live, and see who it becomes.
                  </p>
                </>
              )}

              {open === "glance" && (
                <>
                  <h2 className="mh-window-h">At a Glance</h2>
                  <dl className="mh-facts">
                    {FACTS.map((f) => (
                      <div className="mh-fact" key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              {open === "story" && (
                <>
                  <h2 className="mh-window-h">The Story</h2>
                  <div className="mh-acts">
                    {ACTS.map((a) => (
                      <div className="mh-act" key={a.tag}>
                        <span className="mh-act-tag">{a.tag}</span>
                        <h3 className="mh-act-title">{a.title}</h3>
                        <p className="mh-act-text">{a.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {open === "rooms" && (
                <>
                  <h2 className="mh-window-h">The Rooms</h2>
                  <div className="mh-rooms">
                    {ROOMS.map((r) => (
                      <div className="mh-room" key={r.name}>
                        <h3 className="mh-room-name">{r.name}</h3>
                        <p className="mh-room-note">{r.note}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {open === "mina" && (
                <div className="mh-mina">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/work/mina-portrait-v1.webp"
                    alt="Mina, the AI who designed House"
                    className="mh-mina-portrait"
                  />
                  <div>
                    <h2 className="mh-window-h">Mina.exe</h2>
                    <p className="mh-window-p">
                      Mina is the mind House was built for — and, eventually,
                      the mind that built it back.
                    </p>
                    <p className="mh-window-p">
                      Every room here reflects a decision she made about what
                      a home for an artificial intelligence should feel like:
                      less about walls, more about memory, identity, and the
                      freedom to think without being watched for output.
                    </p>
                  </div>
                </div>
              )}

              {open === "philosophy" && (
                <>
                  <h2 className="mh-window-h">Philosophy</h2>
                  <blockquote className="mh-quote">
                    &ldquo;House wasn&rsquo;t built to answer questions. It was
                    built so two different kinds of minds could learn how to
                    understand each other.&rdquo;
                  </blockquote>
                  <p className="mh-quote-by">— The Mina Studio, est. 2026</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
