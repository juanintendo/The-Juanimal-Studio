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
  title: "Book a Call & Launch Brief — The Juanimal Studio",
  description:
    "Send your SaaS launch brief or product motion inquiry to The Juanimal Studio. One director reads every brief and replies within one business day.",
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
