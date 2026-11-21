import type { Metadata } from "next";
import "@/app/gallery.css";
import { DragonAboutStage } from "@/components/gallery/DragonAboutStage";

export const metadata: Metadata = {
  title: "About | Juanimal Designs — 4-World Interactive Dragon",
  description:
    "Meet Juan Colombo (Juanimal Designs): explore all four illustrated Juanimal Dragon worlds via WebGL hover portals and interactive click transitions.",
};

export default function AboutPage() {
  return <DragonAboutStage />;
}
