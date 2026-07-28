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
  title: "About a Wizard — The Juanimal Studio",
  description:
    "The person behind The Juanimal Studio — UX/UI, web & app development, AI implementation and business tools, one dragon, no committee.",
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
