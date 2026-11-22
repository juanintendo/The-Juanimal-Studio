import type { Metadata } from "next";
import { VectraTwinShowcase } from "@/components/VectraTwinShowcase";

export const metadata: Metadata = {
  title: "Vectra Twin // AI — Portfolio Web Concept — The Juanimal Studio",
  description:
    "Editorial spatial B2B digital twin showcase with electric scroll-scrubbed typography, auto-hiding WHAT/HOW/WHY/WHERE mini-nav, interactive RECAP matrix, and 60fps cursor telemetry.",
};

export default function VectraShortAliasPage() {
  return <VectraTwinShowcase />;
}
