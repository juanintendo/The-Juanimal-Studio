"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function MerchHero() {
  return (
    <header className="merch-hero" id="top">
      <Reveal as="span" className="eyebrow">
        The Juanimal Studio
      </Reveal>
      <Reveal as="h1">Studio Merch</Reveal>
      <Reveal as="p">
        Wearable spells and desk-side sorcery. Tees, hoodies, stickers and mugs —
        designed in-house, printed for real wizards.
      </Reveal>
    </header>
  );
}

export function MerchFooter() {
  return (
    <section className="merch-foot-cta">
      <p>&ldquo;Every great wizard needs merch&hellip;&rdquo;</p>
      <Link href="/#contact">Back to the studio</Link>
    </section>
  );
}
