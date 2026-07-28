import type { Metadata } from "next";
import { MerchFooter, MerchHero } from "@/components/MerchChrome";
import { MerchShop } from "@/components/MerchShop";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Studio Merch — The Juanimal Studio",
  description:
    "Wearable spells and desk-side sorcery. Tees, hoodies, stickers and mugs from The Juanimal Studio.",
};

export default function MerchPage() {
  return (
    <PageShell page="merch">
      <Nav active="merch" />
      <MerchHero />
      <MerchShop />
      <MerchFooter />
    </PageShell>
  );
}
