"use client";

import Link from "next/link";
import { useState } from "react";
import { Contact } from "@/components/Contact";
import { useLanguage } from "@/components/LanguageProvider";
import { LaunchFilmPlayer } from "@/components/LaunchFilmPlayer";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

const ERA_SHEETS = [
  {
    id: "00-canon",
    tab: "00 Canon",
    noteEn: "The canon character bible. Everything else inherits from this sheet.",
    noteEs: "La biblia canon del personaje. Todo lo demás hereda de esta hoja.",
    img: "/images/fba/00-canon.webp",
  },
  {
    id: "01-pencil",
    tab: "01 Pencil",
    noteEn: "Graphite pencil study. Only the sternum opal stays in color.",
    noteEs: "Estudio a lápiz grafito. Solo el ópalo del esternón conserva color.",
    img: "/images/fba/01-pencil.webp",
  },
  {
    id: "02-1920s",
    tab: "02 1920s",
    noteEn: "Painted theatrical poster. Tiered flapper dress, pearls, plume.",
    noteEs: "Póster teatral pintado. Vestido flapper, perlas y pluma.",
    img: "/images/fba/02-1920s.webp",
  },
  {
    id: "02b-1930s-pencil",
    tab: "03 30s Pencil",
    noteEn: "1930s rubber-hose cartoon rough pencil turnaround.",
    noteEs: "Giro de personaje en lápiz estilo rubber-hose años 30.",
    img: "/images/fba/02b-1930s-pencil.webp",
  },
  {
    id: "02c-1930s-ink",
    tab: "04 30s Ink",
    noteEn: "Same turnaround, inked and painted on cel.",
    noteEs: "El mismo giro, entintado y pintado sobre acetato.",
    img: "/images/fba/02c-1930s-ink.webp",
  },
  {
    id: "03-1940s",
    tab: "05 1940s",
    noteEn: "Color cel aviator period pack.",
    noteEs: "Pack de época aviador en cel a color años 40.",
    img: "/images/fba/03-1940s.webp",
  },
  {
    id: "04-1960s",
    tab: "06 1960s",
    noteEn: "Flat graphic op-art coat.",
    noteEs: "Gráfica plana años 60 con abrigo op-art.",
    img: "/images/fba/04-1960s.webp",
  },
  {
    id: "05-1970s",
    tab: "07 1970s",
    noteEn: "Airbrushed disco poster.",
    noteEs: "Póster aerografiado de época disco años 70.",
    img: "/images/fba/05-1970s.webp",
  },
  {
    id: "06-1990s",
    tab: "08 1990s",
    noteEn: "Painted cyber cel with cobalt vinyl coat.",
    noteEs: "Cel pintado cyber años 90 con gabardina de vinilo cobalto.",
    img: "/images/fba/06-1990s.webp",
  },
  {
    id: "07-3d",
    tab: "09 3D",
    noteEn: "Stylized feature 3D render still anchored to the canon traits.",
    noteEs: "Render 3D estilizado anclado a los rasgos inmutables del canon.",
    img: "/images/fba/07-3d.webp",
  },
] as const;

export function FrameByAgentsCaseStudy() {
  const { lang } = useLanguage();
  const isEs = lang === "es";
  const [eraIdx, setEraIdx] = useState(4);
  const currentEra = ERA_SHEETS[eraIdx];

  return (
    <PageShell page="about">
      <Nav active="work" />

      <header className="merch-hero cs-hero" id="top">
        <Reveal as="span" className="eyebrow">
          {isEs
            ? "Caso de Estudio Comercial · Launch Kit #001"
            : "Commercial Case Study · Launch Kit #001"}
        </Reveal>
        <Reveal as="h1">Frame by Agents</Reveal>
        <Reveal as="p">
          {isEs
            ? "La consistencia no es un mejor prompt. Es una cadena. Cómo produjimos un Launch Kit completo de 75s, cortes 9:16 y loops para el lanzamiento de nuestra plataforma de animación cuadro a cuadro."
            : "Consistency is not a better prompt. It is a chain. How we produced a 75s Launch Film, 9:16 paid-social cutdowns, and silent feature-grid loops for our frame-by-frame animation product."}
        </Reveal>
        <div className="cs-hero-links">
          <Link href="/#work" className="cs-back-pill">
            ← {isEs ? "Volver al Estudio" : "Back to Studio"}
          </Link>
          <a
            href="https://fuelorfool.ing/frame-by-agents/"
            target="_blank"
            rel="noopener noreferrer"
            className="cs-back-pill cs-pill-accent"
          >
            {isEs ? "Ver Tienda en Vivo ↗" : "Visit Live Storefront ↗"}
          </a>
        </div>
      </header>

      {/* BRIEF + PROBLEM */}
      <section className="services sec-pad">
        <div className="cs-two-col">
          <article className="svc-card">
            <span className="svc-num">01</span>
            <h3>{isEs ? "El Brief" : "The Brief"}</h3>
            <p>
              {isEs
                ? "Frame by Agents entrega el método de un departamento de animación de los años 30 listo para agentes de código (11 skills, manual de montaje y packs por era, desde $99 Kit hasta $299 Studio). El reto comercial: explicar en 75 segundos por qué falla la generación por prompts sueltos y demostrar el flujo paso a paso sin inventar interfaces."
                : "Frame by Agents packages a 1930s animation department workflow for coding agents (11 skills, assembly manual, era packs, $99 Kit / $299 Studio). The commercial challenge: prove in 75 seconds why naive prompting drifts and demonstrate the real approval chain without faking UI."}
            </p>
          </article>

          <article className="svc-card">
            <span className="svc-num">02</span>
            <h3>
              {isEs
                ? 'El Problema: "Dos Primos"'
                : 'The Problem: "Two Cousins"'}
            </h3>
            <p>
              {isEs
                ? "Si pides el mismo personaje dos veces a un modelo, obtienes dos primos lejanos. En nuestras pruebas de hojas completas (7 de 7), la segunda mitad del ciclo copiaba la primera en lugar de alternar extremidades, y las manos rápidas saltaban de profundidad."
                : "Ask a generative model for the same character twice and you get two cousins. Across 7/7 whole-cycle sheet tests, the second half copied the first instead of swapping limbs, and fast hands jumped behind the body."}
            </p>
          </article>
        </div>

        <div className="cs-method-strip">
          <div>
            <strong>LOOK</strong>
            <span>
              {isEs
                ? "Recortar el mensaje a una sola línea: la consistencia es una cadena."
                : "Cut positioning to one thesis: consistency is a chain."}
            </span>
          </div>
          <div>
            <strong>KEYS</strong>
            <span>
              {isEs
                ? "Juan aprueba biblia, model sheets, guías de pose y 8 keyframes."
                : "Director approves bible, model sheets, pose guides & 8 keys."}
            </span>
          </div>
          <div>
            <strong>IN-BETWEENS</strong>
            <span>
              {isEs
                ? "Escenas de UI programadas como funciones puras de tiempo (draw(t))."
                : "UI scenes built as deterministic pure functions of time (draw(t))."}
            </span>
          </div>
          <div>
            <strong>QA CHECK</strong>
            <span>
              {isEs
                ? "Auditoria de onion-skin, márgenes, color y los 12 principios."
                : "Onion-skin overlay, margin clip check, color drift & 12 principles."}
            </span>
          </div>
        </div>
      </section>

      {/* EMBEDDED PLAYER */}
      <section className="launch-showcase sec-pad">
        <span className="eyebrow">
          {isEs
            ? "Entregable en Código · Master + 9:16 + Loops"
            : "Live Code Deliverable · Master + 9:16 + Loops"}
        </span>
        <h2 className="sec-h2" style={{ marginBottom: 28 }}>
          {isEs ? "Launch Kit #001 Player" : "Launch Kit #001 Player"}
        </h2>
        <LaunchFilmPlayer />
      </section>

      {/* LAB TELEMETRY (RESULTS.MD) */}
      <section className="services sec-pad">
        <span className="eyebrow">
          {isEs
            ? "Evidencia de Laboratorio (RESULTS.md)"
            : "Verified Lab Telemetry (RESULTS.md)"}
        </span>
        <h2 className="sec-h2">
          {isEs ? "Comparativa A vs B vs C" : "Benchmark: Arm A vs B vs C"}
        </h2>
        <p className="about-lede">
          {isEs
            ? "25 generaciones reales en Codex sobre el personaje de Synthia (canvas 1024px, pies en 512,900, cuerpo 670px, margen 16px). La tira de 4 maniquíes con código de color (Arm C) redujo el tiempo a 202s y pasó la validación del motor."
            : "25 benchmark Codex runs targeting the game sprite spec (1024px canvas, feet at 512,900, 670px body, 16px margin). The 4-pose color-coded mannequin strip (Arm C) cut generation time to 202s and passed validation."}
        </p>

        <div className="cs-table-wrap">
          <table className="cs-table lfp-tabular">
            <thead>
              <tr>
                <th>Arm</th>
                <th>{isEs ? "Entrada del Pipeline" : "Pipeline Input"}</th>
                <th>Gens</th>
                <th>Time</th>
                <th>{isEs ? "Resultado QA" : "QA Outcome"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Arm A</strong>
                </td>
                <td>Sheet + written limb plan (1 pose / image)</td>
                <td>8</td>
                <td>747s</td>
                <td>Hair &amp; mace grip drift; two kicks overdone</td>
              </tr>
              <tr>
                <td>
                  <strong>Arm B</strong>
                </td>
                <td>Arm A + single mannequin pose guide</td>
                <td>8</td>
                <td>800s</td>
                <td>Poses match guide; mace grip steady</td>
              </tr>
              <tr className="is-winner">
                <td>
                  <strong>Arm C ★</strong>
                </td>
                <td>
                  Sheet + 4-mannequin strip (Red near / Blue far / Brown prop)
                </td>
                <td>2</td>
                <td>202s</td>
                <td>
                  Most consistent hair/costume; &lt;0.5px head jitter; passes
                  spec
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="cs-proof-grid">
          <figure className="cs-proof-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fba/lab-abc-compare.jpg"
              alt="Side-by-side comparison of Arm A, Arm B, and Arm C walk generations"
              loading="lazy"
            />
            <figcaption>
              {isEs
                ? "Comparativa directa A / B / C de deriva de personaje."
                : "Direct A / B / C benchmark comparison of identity & prop lock."}
            </figcaption>
          </figure>
          <figure className="cs-proof-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fba/lab-walk-onion.jpg"
              alt="Onion skin overlay across 8 walk drawings"
              loading="lazy"
            />
            <figcaption>
              {isEs
                ? "Onion-skin de 8 dibujos para verificar arcos y contacto de pies."
                : "8-drawing onion-skin overlay verifying arcs and foot contact."}
            </figcaption>
          </figure>
          <figure className="cs-proof-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fba/lab-walk-rulers.jpg"
              alt="Scale and proportion registration rulers across walk frames"
              loading="lazy"
            />
            <figcaption>
              {isEs
                ? "Reglas de altura y proporción (<1/255 deriva de color)."
                : "Height & registration rulers (<1/255 intra-sheet color drift)."}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 10 ERA SWITCHER */}
      <section className="work sec-pad">
        <span className="eyebrow">
          {isEs
            ? "Switcher de Model Sheets · 10 Eras"
            : "Interactive Model Sheet Switcher · 10 Eras"}
        </span>
        <h2 className="sec-h2" style={{ marginBottom: 24 }}>
          {isEs ? "Un personaje, diez oficios" : "One face, ten crafts"}
        </h2>

        <div className="cs-era-tabs" role="tablist" aria-label="Animation Eras">
          {ERA_SHEETS.map((sheet, idx) => (
            <button
              key={sheet.id}
              type="button"
              role="tab"
              aria-selected={eraIdx === idx}
              className={`cs-era-tab${eraIdx === idx ? " is-active" : ""}`}
              onClick={() => setEraIdx(idx)}
            >
              {sheet.tab}
            </button>
          ))}
        </div>

        <div className="cs-era-viewer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentEra.img} alt={currentEra.tab} />
          <div className="cs-era-caption">
            <strong>{currentEra.tab}</strong>
            <p>{isEs ? currentEra.noteEs : currentEra.noteEn}</p>
          </div>
        </div>

        <div className="cs-credits-box">
          <h3>
            {isEs
              ? "Créditos de Producción"
              : "Production Credits (Human + Agents)"}
          </h3>
          <ul>
            <li>
              <strong>Direction, Script &amp; Key Approvals:</strong> Juan
              Colombo (The Juanimal Studio)
            </li>
            <li>
              <strong>Code Motion Engine:</strong> Deterministic{" "}
              <code>draw(t)</code> timeline, damped springs (<code>k=120/100/300</code>),
              and volume-preserving baseline squash
            </li>
            <li>
              <strong>Sheet &amp; Frame Pipeline:</strong> Frame by Agents 11-skill
              suite (Codex CLI + <code>qa_motion.py</code> +{" "}
              <code>motion.py</code>)
            </li>
          </ul>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}
