import type { Metadata } from "next";
import PerreroShopView from "@/components/studies/perrero/PerreroShopView";

export const metadata: Metadata = {
  title: "Shop All Sauces | Perrero Sauce Co.",
  description:
    "Browse all 5 Caracas small-batch street sauces or build a custom 3-pack and save $4.00.",
};

export default function PerreroShopPage() {
  return <PerreroShopView />;
}
