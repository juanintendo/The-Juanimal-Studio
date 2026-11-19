"use client";

import Link from "next/link";
import { useState } from "react";
import { Contact } from "@/components/Contact";
import { useLanguage } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

const ERAS_SHOWCASE = [
  { label: "00 Canon (Photo)", img: "/images/fba/00-canon.webp" },
  { label: "01 Pencil Test", img: "/images/fba/01-pencil.webp" },
  { label: "02 1920s Painted", img: "/images/fba/02-1920s.webp" },
  { label: "03 1930s Ink Cel", img: "/images/fba/02c-1930s-ink.webp" },
  { label: "04 1940s Aviator", img: "/images/fba/03-1940s.webp" },
  { label: "05 1960s Op-Art", img: "/images/fba/04-1960s.webp" },
  { label: "06 1970s Airbrush", img: "/images/fba/05-1970s.webp" },
  { label: "07 1990s Cyber Cel", img: "/images/fba/06-1990s.webp" },
  { label: "08 Stylized 3D", img: "/images/fba/07-3d.webp" },
] as const;

const PRINCIPLES_TESTS = [
  {
    n: "01",
    name: "Squash & Stretch",
    test: "Volume conserved (scaleX × scaleY = 1) during impact holds.",
  },
  {
    n: "02",
    name: "Anticipation",
    test: "Counter-move (4–8% travel) precedes every major headline/pose hit.",
  },
  {
    n: "03",
    name: "Staging",
    test: "Single unmistakable silhouette readable at a 1-second squint.",
  },
  {
    n: "04",
    name: "Pose to Pose",
    test: "Key drawings approved by human before in-betweens run.",
  },
  {
    n: "05",
    name: "Follow Through",
    test: "Hair, jacket, and secondary tails settle 1–2 frames late.",
  },
  {
    n: "06",
    name: "Slow In, Slow Out",
    test: "Drawings bunch near key poses; linear tweening rejected.",
  },
  {
    n: "07",
    name: "Arcs",
    test: "Limbs and letter pivots travel on curves, never straight rails.",
  },
  {
    n: "08",
    name: "Secondary Action",
    test: "Micro-expressions and eye scans reinforce the primary beat.",
  },
  {
    n: "09",
    name: "Timing",
    test: "Stepped on twos (12fps) aligned strictly to 122.5 BPM bars.",
  },
  {
    n: "10",
    name: "Exaggeration",
    test: "Pushed key silhouettes up to 20% for comedic/emotional read.",
  },
  {
    n: "11",
    name: "Solid Drawing",
    test: "3D mass and sternum opal placement survive turnaround views.",
  },
  {
    n: "12",
    name: "Appeal",
    test: "Final chorus: not just clean linework, a character worth watching.",
  },
] as const;

export function KeysToMyHeartCaseStudy() {
  const { lang } = useLanguage();
  const isEs = lang === "es";
  const [selected, setSelected] = useState(0);

  return (
    <PageShell page="about">
      <Nav active="work" />

      <header className="merch-hero cs-hero" id="top">
        <Reveal as="span" className="eyebrow">
          {isEs
            ? "Film Musical e Investigación · 122.5 BPM"
            : "Music Film & Craft Research · 122.5 BPM"}
        </Reveal>
        <Reveal as="h1">Keys to My Heart</Reveal>
        <Reveal as="p">
          {isEs
            ? "The Illusion of Agency: un corto musical de 3:16 producido en días y con presupuesto $0 de generación de video, donde una imagen congelada aprende los 12 principios de animación a través de siete eras visuales."
            : "The Illusion of Agency: a 3:16 animated short produced under a hard contest deadline with $0 video-gen spend, where a frozen gallery photo learns all 12 animation principles across seven visual eras."}
        </Reveal>
        <div className="cs-hero-links">
          <Link href="/#work" className="cs-back-pill">
            ← {isEs ? "Volver al Estudio" : "Back to Studio"}
          </Link>
          <a
            href="https://fuelorfool.ing/keys-to-my-heart/"
            target="_blank"
            rel="noopener noreferrer"
            className="cs-back-pill cs-pill-accent"
          >
            {isEs ? "Ver Sitio del Film ↗" : "Visit Film Microsite ↗"}
          </a>
        </div>
      </header>

      <section className="services sec-pad">
        <div className="cs-two-col">
          <article className="svc-card">
            <span className="svc-num">01</span>
            <h3>{isEs ? "El Reto (Plazo + $0)" : "The Constraint (Days + $0)"}</h3>
            <p>
              {isEs
                ? "El concurso $CLAUDIA de anabology fijó una fecha límite dura (6 nov 2026) con presupuesto cero para generación de video. Convertimos cada verso en una prueba de ingeniería y dirección: ¿puede un pipeline de agentes aprobar o reprobar un principio clásico de animación?"
                : "The $CLAUDIA contest had an immovable deadline (Nov 6, 2026) and zero budget for commercial video-gen APIs. We turned the constraint into the thesis: treat every one of the 12 animation principles as an objective pass/fail check in code."}
            </p>
          </article>

          <article className="svc-card">
            <span className="svc-num">02</span>
            <h3>
              {isEs
                ? "Keys Humanos, In-Betweens por Agentes"
                : "Human Keys, Agent In-Betweens"}
            </h3>
            <p>
              {isEs
                ? "La idea, la letra y cada aprobación fueron humanas. Claude escribió el beat map a 122.5 BPM, los storyboards y las animaciones en código; agentes auxiliares generaron model sheets y revisiones; Google Flow animó clips desde nuestros keys aprobados."
                : "A person created the story, lyrics, and every approval gate. Agents generated the 122.5 BPM beat map, storyboards, code-driven transitions, and model sheets; Google Flow animated clips anchored to our approved keys."}
            </p>
          </article>
        </div>

        <h2 className="sec-h2" style={{ marginTop: 64, marginBottom: 20 }}>
          {isEs
            ? "Los 12 Principios como Tests"
            : "The 12 Principles as Pass/Fail Checks"}
        </h2>
        <div className="cs-principles-grid">
          {PRINCIPLES_TESTS.map((p) => (
            <div key={p.n} className="cs-principle-card">
              <span className="lfp-badge-red">{p.n}</span>
              <h4>{p.name}</h4>
              <p>{p.test}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="work sec-pad">
        <span className="eyebrow">
          {isEs
            ? "Comparativa de Eras Visuales"
            : "Visual Era Progression"}
        </span>
        <h2 className="sec-h2" style={{ marginBottom: 24 }}>
          {isEs ? "De Foto Congelada a 3D" : "From Frozen Frame to 3D"}
        </h2>

        <div className="cs-era-tabs">
          {ERAS_SHOWCASE.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              className={`cs-era-tab${selected === idx ? " is-active" : ""}`}
              onClick={() => setSelected(idx)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="cs-era-viewer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ERAS_SHOWCASE[selected].img}
            alt={ERAS_SHOWCASE[selected].label}
          />
          <div className="cs-era-caption">
            <strong>{ERAS_SHOWCASE[selected].label}</strong>
            <p>
              {isEs
                ? "Mismas proporciones base y mismo rasgo ancla heredado desde el canon inicial."
                : "Locked proportions and anchor features inherited continuously from the initial canon sheet."}
            </p>
          </div>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}
