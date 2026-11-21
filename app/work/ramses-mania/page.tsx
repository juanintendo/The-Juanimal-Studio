import type { Metadata } from "next";
import { RamsesManiaShowcase } from "@/components/ramses/RamsesManiaShowcase";

export const metadata: Metadata = {
  title:
    "Ramsés Mania — Interactive WebGL Sphynx Comic — The Juanimal Studio",
  description:
    "Portfolio Web Concept #04: Ponpon Mania-inspired spatial Three.js graphic novel starring Ramsés, our 100% hairless Sphynx Sun-Pharaoh, with GLSL B&W-to-pop-color waves, Web Audio foley, and playable sunbeam finale (EN / ES).",
};

export default function RamsesManiaPage() {
  return <RamsesManiaShowcase />;
}
