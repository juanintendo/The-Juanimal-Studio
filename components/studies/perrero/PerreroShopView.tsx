"use client";

import { useMemo, useState } from "react";
import { PERRERO_SAUCES, type SauceCategory } from "./catalog";
import {
  PerreroReviewsStrip,
  PerreroThreePackBuilder,
  PerreroWeaponGrid,
} from "./PerreroSections";

export default function PerreroShopView() {
  const [filter, setFilter] = useState<"all" | SauceCategory>("all");

  const filteredSauces = useMemo(
    () =>
      filter === "all"
        ? PERRERO_SAUCES
        : PERRERO_SAUCES.filter((s) => s.category === filter),
    [filter]
  );

  return (
    <>
      <section className="pr-shop-hero">
        <div className="pr-float-layer" aria-hidden="true">
          <img
            src="/images/studies/perrero/ing-corn.png"
            alt=""
            className="pr-float-3d pr-float-near"
            style={{ left: "5%", top: "12%", width: 150, height: 150 }}
          />
          <img
            src="/images/studies/perrero/ing-chili.png"
            alt=""
            className="pr-float-3d pr-float-far"
            style={{ right: "6%", top: "14%", width: 145, height: 145 }}
          />
        </div>

        <h1 className="pr-shop-h1">
          SAUCE MADE
          <img
            src="/images/studies/perrero/ing-mascot-avocado.png"
            alt="Avocado Mascot"
            className="pr-inline-mascot"
          />
          FROM
          <br />
          REAL INGREDIENTS
        </h1>
        <p className="pr-shop-sub">
          This is where you stop talking about 3AM Caracas street food and
          actually put the good stuff in your fridge.
        </p>

        <div className="pr-filter-row" role="group" aria-label="Filter sauces">
          {[
            { id: "all", label: "ALL SAUCES (5)" },
            { id: "creamy", label: "CREAMY & HERBY" },
            { id: "sweet", label: "SWEET & SMOKY" },
            { id: "fire", label: "FIRE HEAT" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pr-step-btn ${filter === tab.id ? "active" : ""}`}
              onClick={() => setFilter(tab.id as "all" | SauceCategory)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <PerreroWeaponGrid sauces={filteredSauces} showHeading={false} />

      <div className="pr-sticker-band">
        <img
          src="/images/studies/perrero/sticker-3am-caracas.png"
          alt="3.AM Caracas No Shortcuts Sticker"
          className="pr-sticker-img"
        />
        <img
          src="/images/studies/perrero/sticker-small-batch.png"
          alt="Small Batch No Corn Syrup No Seed Oils Sticker"
          className="pr-sticker-img"
        />
      </div>

      <PerreroThreePackBuilder />
      <PerreroReviewsStrip />
    </>
  );
}
