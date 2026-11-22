import type { Metadata } from "next";
import { RamsesManiaShowcase } from "@/components/ramses/RamsesManiaShowcase";

export const metadata: Metadata = {
  title:
    "Ramses — Interactive WebGL Sphynx Comic — The Juanimal Studio",
  description:
    "Portfolio Web Concept #04: Spatial Three.js graphic novel starring Ramses, our 100% hairless Sphynx Sun-Pharaoh, with GLSL B&W-to-pop-color waves, Web Audio foley, and playable sunbeam mini-game (EN / ES).",
};

export default function RamsesManiaPage() {
  return <RamsesManiaShowcase />;
}
