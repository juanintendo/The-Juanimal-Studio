"use client";

import { Reveal } from "@/components/Reveal";

const services = [
  {
    num: "A",
    icon: "/images/service-ux.png",
    iconHeight: 64,
    title: "UX/UI & Web Development",
    body: "Interfaces people actually enjoy using. We design and build fast, accessible websites and web apps — from first wireframe to shipped product, with every pixel pulling its weight.",
  },
  {
    num: "B",
    icon: "/images/service-web.png",
    iconHeight: 76,
    title: "App Development",
    body: "Native-feeling mobile and desktop apps, engineered light. Clear flows, snappy performance and a design system your team can grow with long after launch day.",
  },
  {
    num: "C",
    icon: "/images/service-apps.png",
    iconHeight: 69,
    title: "AI Implementation & Business Tools",
    body: "We wire AI into real workflows — then package it. We build and sell specialized tools that save businesses hours every week, not slideware about the future.",
  },
  {
    num: "D",
    icon: "/images/service-branding.png",
    iconHeight: 86,
    title: "Branding & Graphic Design",
    body: "Logos, color systems and visual identities with a point of view. We give your brand a face people remember — then keep it consistent across every touchpoint.",
  },
] as const;

export function Services() {
  return (
    <section className="services sec-pad" id="services">
      <Reveal as="span" className="eyebrow">
        What we do
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        A great idea deserves
        <br />
        <span className="accent">an outside the box plan</span>
      </Reveal>
      <div className="svc-grid">
        {services.map((s) => (
          <Reveal as="article" className="svc-card" key={s.num}>
            <span className="svc-num">{s.num}</span>
            <div className="svc-icon" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.icon}
                alt=""
                style={{ height: s.iconHeight, width: "auto", display: "block" }}
              />
            </div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
