import type { Metadata } from "next";
import { VoyagerBookShowcase } from "@/components/voyager/VoyagerBookShowcase";

export const metadata: Metadata = {
  title:
    "How to Talk to Kids About Voyager 1 — Illustrated 3D Crayon Book — The Juanimal Studio",
  description:
    "Portfolio Web Concept #03: interactive Three.js bending 3D picture book in textured wax-crayon illustration style starring Guaca the Macaw & Voyager 1 (EN / ES).",
};

export default function VoyagerKidsPage() {
  return <VoyagerBookShowcase />;
}
