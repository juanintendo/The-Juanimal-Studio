import type { Metadata } from "next";
import Link from "next/link";
import { MUSEUM_CHAPTERS } from "@/components/studies/arepa2go/catalog";

export const metadata: Metadata = {
  title: "Arepa Museum | Arepa 2GO",
  description:
    "Explore the story behind Arepa 2GO: Venezuelan white corn craft, Southsea coastal vibes, and takeaway block packaging.",
};

export default function Arepa2GoMuseumPage() {
  return (
    <>
      <section className="a2g-sub-hero">
        <div className="a2g-kicker">AREPA MUSEUM · CULTURAL ARCHIVE</div>
        <h1>From Caracas street stands to the Southsea coast.</h1>
        <p>
          Three editorial chapters celebrating handmade corn craft, tropical
          hospitality, and Swiss-Japanese takeaway design.
        </p>
      </section>

      {MUSEUM_CHAPTERS.map((ch, idx) => (
        <section
          key={ch.num}
          className="a2g-statement"
          style={idx === MUSEUM_CHAPTERS.length - 1 ? { borderBottom: 0 } : undefined}
        >
          <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
            <div className="a2g-kicker">{ch.num}</div>
            <h2>{ch.title}</h2>
            <p>{ch.copy}</p>
            <Link href="/studies/arepa2go/menu" className="a2g-btn-primary">
              TASTE THIS CHAPTER →
            </Link>
          </div>
          <div
            className="a2g-box-frame"
            style={{ order: idx % 2 === 1 ? 1 : 2 }}
          >
            <img src={ch.img} alt={ch.title} className="a2g-box-img" />
          </div>
        </section>
      ))}
    </>
  );
}
