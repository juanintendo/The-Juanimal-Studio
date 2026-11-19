"use client";

import Link from "next/link";
import { useState } from "react";
import { Contact } from "@/components/Contact";
import { useLanguage } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

const FILM_ACTS = [
  {
    act: "01 · THE PUMP (0.0s)",
    titleEn: "Nozzle Plug-In & SVG Liquid Rise",
    titleEs: "Boquilla & Ola Líquida en SVG",
    descEn:
      "Hazard stripes scroll continuously while an SVG path computes real-time sine waves as liquid fills the viewport and lifts a custom 4-wheel odometer.",
    descEs:
      "Franjas industriales animan mientras un path SVG calcula olas sinusoidales en tiempo real y empuja el odómetro de 4 ruedas.",
    snippet: `const y = lerp(H + 40, -80, inOut(prog(t, 1.3, 2.05)));\nconst wave = Math.sin(i * 0.9 + t * 9) * 16 + Math.sin(i * 0.37 - t * 6) * 22;`,
  },
  {
    act: "02 · FUEL (2.05s)",
    titleEn: "Variable Axis Inflation + Bubble Field",
    titleEs: "Inflación de Eje Variable + Burbujas",
    descEn:
      "Archivo variable font inflates letter-by-letter from wdth 62, wght 120 to wdth 125, wght 900. Spring overshoot converts into volume-preserving squash.",
    descEs:
      "La fuente variable Archivo se infla letra por letra de wdth 62 a 125. El overshoot del spring se convierte en squash que conserva el volumen.",
    snippet: `const s = spring(Math.max(0, t - start - i * stagger), 120, 13);\naxes(l, lerp(62, 125, clamp(s)), lerp(120, 900, clamp(s)));`,
  },
  {
    act: "03 · 0R (4.25s)",
    titleEn: "Braking Wheel & Canvas Halftone Ring",
    titleEs: "Rueda que Frena & Anillo Halftone",
    descEn:
      "A rolling SVG wheel decelerates into the letter O with an exponential squash shudder while a 64x64 procedural canvas halftone ring expands behind it.",
    descEs:
      "Una rueda SVG frena hasta convertirse en la letra O mientras un anillo halftone de 64x64 dibujado en canvas se expande detrás.",
    snippet: `const k = 1 - Math.abs(Math.hypot(px, py) / (size / 2) - mid) / half;\ng.arc(px + size / 2, py + size / 2, step * 0.56 * Math.sqrt(k), 0, 7);`,
  },
  {
    act: "04 · F00LING (5.15s)",
    titleEn: "Collision Physics & Boil on Twos",
    titleEs: "Física de Colisión & Boil en Dos",
    descEn:
      "Wheels slam the letter I sideways until it tips 92 degrees and snaps back annoyed, while settled letters vibrate subtly on a 12fps stepped clock.",
    descEs:
      "Las ruedas golpean la letra I hasta tumbarla 92 grados y enderezarla molesta, mientras las letras vibran levemente en reloj de 12fps.",
    snippet: `const boil = local > 1.25 ? Math.sin(twos(local) * 31 + i * 2.2) * 1.5 : 0;`,
  },
  {
    act: "05 · THE 6 CRAFTS (7.0s)",
    titleEn: "Each Word Performs Its Own Discipline",
    titleEs: "Cada Palabra Ejecuta su Propio Oficio",
    descEn:
      "MOTION arrives with trailing ink ghosts; UX flies a Bezier cursor to press a button; UI drives damped sliders; WEB morphs responsive panes; PRODUCT stamps SHIPPED.",
    descEs:
      "MOTION entra con estelas; UX vuela un cursor Bezier; UI mueve sliders con spring; WEB reacomoda paneles; PRODUCT sella SHIPPED.",
    snippet: `const bx = q*q*sx + 2*q*p*cx1 + p*p*ex; // Quadratic Bezier cursor`,
  },
  {
    act: "06 · GAUGE & EYE (12.0s)",
    titleEn: "E-to-F Needle Sweep & 26x Slit Pupil Zoom",
    titleEs: "Aguja E→F & Zoom 26x en Pupila",
    descEn:
      "Wipe bands open an analog fuel gauge sweeping from Empty to Full, cutting straight into a macro serpent slit-pupil zoom that swallows the screen.",
    descEs:
      "Bandas revelan un medidor de combustible de E a F, cortando a un zoom de 26x en el ojo de la serpiente hasta oscurecer la pantalla.",
    snippet: `const z = 1 + easeIn(p) * 26; // locks zoom anchor to pupil (52%, 49%)`,
  },
  {
    act: "07 · LANDING (13.15s)",
    titleEn: "Responsive Refit at Any Aspect Ratio",
    titleEs: "Reajuste Responsivo en Cualquier Formato",
    descEn:
      "Unlike an MP4, `word.fit()` measures the window on resize and recalculates layout for wide monitors, 2:1 ultrawide, or 9:16 mobile portrait.",
    descEs:
      "A diferencia de un MP4, `word.fit()` mide la ventana y recalcula todo para monitores 16:9, ultrawide o teléfonos 9:16.",
    snippet: `const tall = W / H < 0.9; // stacks lines vertically when portrait`,
  },
] as const;

export function FuelOrFoolCaseStudy() {
  const { lang } = useLanguage();
  const isEs = lang === "es";
  const [activeAct, setActiveAct] = useState(0);

  return (
    <PageShell page="about">
      <Nav active="work" />

      <header className="merch-hero cs-hero" id="top">
        <Reveal as="span" className="eyebrow">
          {isEs
            ? "Caso Técnico y Creativo · Open R&D Lab"
            : "Technical & Creative Case Study · Open R&D Lab"}
        </Reveal>
        <Reveal as="h1">fuelorfool.ing</Reveal>
        <Reveal as="p">
          {isEs
            ? "Una apertura de estudio de 15 segundos dibujada 100% en código (38 KB de JS determinista), cero archivos de video en el hero, y nuestro laboratorio abierto de juegos, films y herramientas con agentes."
            : "A 15-second studio opening drawn 100% in code (38 KB of pure deterministic JS), zero video files in the hero, and our open R&D lab shipping games, films, and agent animation tools."}
        </Reveal>
        <div className="cs-hero-links">
          <Link href="/#work" className="cs-back-pill">
            ← {isEs ? "Volver al Estudio" : "Back to Studio"}
          </Link>
          <a
            href="https://fuelorfool.ing/"
            target="_blank"
            rel="noopener noreferrer"
            className="cs-back-pill cs-pill-accent"
          >
            {isEs ? "Visitar fuelorfool.ing ↗" : "Visit fuelorfool.ing ↗"}
          </a>
        </div>
      </header>

      <section className="services sec-pad">
        <div className="cs-two-col">
          <article className="svc-card">
            <span className="svc-num">01</span>
            <h3>
              {isEs
                ? "La Tesis: Por qué 0 MP4 en la Intro"
                : "The Thesis: Zero Video Files in the Opening"}
            </h3>
            <p>
              {isEs
                ? "Un video 4K pre-renderizado se recorta o se pixeliza al cambiar de desktop 16:9 a móvil 9:16. En fuelorfool.ing cada escena, ola SVG, anillo halftone y letra variable se evalúa desde `draw(t)` — reajustándose a cualquier ventana en milisegundos."
                : "A pre-rendered MP4 crops awkwardly between 16:9 monitors and 9:16 phones. On fuelorfool.ing every scene, SVG wave, canvas halftone ring, and variable letter is evaluated purely from `draw(t)`, refitting cleanly to any viewport."}
            </p>
          </article>

          <article className="svc-card">
            <span className="svc-num">02</span>
            <h3>
              {isEs
                ? "Cómo Alimenta a The Juanimal Studio"
                : "How It Powers The Juanimal Studio"}
            </h3>
            <p>
              {isEs
                ? "fuelorfool es el taller donde probamos motores de física, sistemas de sprints con agentes y films en código. Todo lo que supera el estándar de laboratorio pasa directo a los Launch Kits y webs de clientes en Juanimal."
                : "fuelorfool is the open workshop where we stress-test motion physics, sprite pipelines, and code-drawn films. Every technique proven in the lab ships straight into client Launch Kits and launch sites at Juanimal."}
            </p>
          </article>
        </div>

        <h2 className="sec-h2" style={{ marginTop: 64, marginBottom: 20 }}>
          {isEs
            ? "Los 7 Actos de film.js (38 KB)"
            : "The 7 Acts of film.js (38 KB)"}
        </h2>

        <div className="cs-era-tabs">
          {FILM_ACTS.map((item, idx) => (
            <button
              key={item.act}
              type="button"
              className={`cs-era-tab${activeAct === idx ? " is-active" : ""}`}
              onClick={() => setActiveAct(idx)}
            >
              {item.act}
            </button>
          ))}
        </div>

        <div className="fof-act-card">
          <div>
            <span className="lfp-badge-red">{FILM_ACTS[activeAct].act}</span>
            <h3>
              {isEs
                ? FILM_ACTS[activeAct].titleEs
                : FILM_ACTS[activeAct].titleEn}
            </h3>
            <p>
              {isEs
                ? FILM_ACTS[activeAct].descEs
                : FILM_ACTS[activeAct].descEn}
            </p>
          </div>
          <pre className="mspec-code">
            <code>{FILM_ACTS[activeAct].snippet}</code>
          </pre>
        </div>
      </section>

      <section className="work sec-pad">
        <span className="eyebrow">
          {isEs ? "Clips de Producción en Vivo" : "Live Studio Motion Clips"}
        </span>
        <h2 className="sec-h2" style={{ marginBottom: 28 }}>
          {isEs ? "Piezas del Laboratorio" : "Built Inside the Lab"}
        </h2>

        <div className="fof-video-grid">
          <figure className="cs-proof-card">
            <video
              src="/media/fof/clip-pump.mp4"
              poster="/media/fof/snake-poster.webp"
              controls
              muted
              loop
              playsInline
              style={{ width: "100%", display: "block" }}
            />
            <figcaption>
              <strong>Nozzle Python Mascot</strong> —{" "}
              {isEs
                ? "Clip de personaje híbrido 2D/3D para el cierre de fuelorfool.ing."
                : "Mascot sequence pairing brass nozzle identity with studio motion."}
            </figcaption>
          </figure>

          <figure className="cs-proof-card">
            <video
              src="/media/fof/clip-eye.mp4"
              poster="/media/fof/eye.webp"
              controls
              muted
              loop
              playsInline
              style={{ width: "100%", display: "block" }}
            />
            <figcaption>
              <strong>Macro Slit-Pupil Transition</strong> —{" "}
              {isEs
                ? "Corte por acción hacia la secuencia final del logotipo."
                : "Action-cut macro iris driving the transition into the final wordmark."}
            </figcaption>
          </figure>

          <figure className="cs-proof-card">
            <video
              src="/media/fof/cine-moon.mp4"
              poster="/media/fof/cine-moon.webp"
              controls
              muted
              loop
              playsInline
              style={{ width: "100%", display: "block" }}
            />
            <figcaption>
              <strong>Synthia: Club of the Dead</strong> —{" "}
              {isEs
                ? "Prueba cinemática del jefe en sprint de 4 días con sprites cuadro a cuadro."
                : "Boss cinematic test from our 4-day beat-locked rhythm RPG sprint."}
            </figcaption>
          </figure>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}
