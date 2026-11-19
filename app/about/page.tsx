import type { Metadata } from "next";
import {
  AboutApproach,
  AboutCTA,
  AboutFooter,
  AboutHero,
  AboutStory,
} from "@/components/About";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { Stats } from "@/components/Stats";

export const metadata: Metadata = {
  title: "Studio & Director — The Juanimal Studio",
  description:
    "Juan Colombo: graphic design, UX/UI, marketing, and code-driven motion. Human direction, agent-scale production, and our open R&D lab fuelorfool.ing.",
};

export default function AboutPage() {
  return (
    <PageShell page="about">
      <Nav active="about" />
      <AboutHero />
      <AboutStory />
      <AboutApproach />
      <Stats />
      <AboutCTA />
      <AboutFooter />
    </PageShell>
  );
}
