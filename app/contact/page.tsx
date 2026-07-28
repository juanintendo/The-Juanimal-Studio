import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import {
  Postcard,
  SocialsDashboard,
  SummonFooter,
  SummonHero,
} from "@/components/Summon";

export const metadata: Metadata = {
  title: "Summon Me — The Juanimal Studio",
  description:
    "Get in touch with The Juanimal Studio — send a message, mail a spell, or find the studio on socials.",
};

export default function ContactPage() {
  return (
    <PageShell page="contact">
      <Nav active="contact" />
      <SummonHero />
      <Postcard />
      <SocialsDashboard />
      <SummonFooter />
    </PageShell>
  );
}
