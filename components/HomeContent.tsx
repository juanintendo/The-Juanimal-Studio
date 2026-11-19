import { Contact } from "@/components/Contact";
import { CraftBandsV2 } from "@/components/CraftBandsV2";
import { HeroSignatureStage } from "@/components/HeroSignatureStage";
import { LaunchKitShowcase } from "@/components/LaunchKitShowcase";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { ProcessSection } from "@/components/ProcessSection";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Tape } from "@/components/Tape";
import { WorkShowcaseV2 } from "@/components/WorkShowcaseV2";

export function HomeContent() {
  return (
    <PageShell page="home">
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="starHt"
            width="7.5"
            height="7.5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            <circle cx="3.75" cy="3.75" r="1.9" fill="#09090C" />
          </pattern>
        </defs>
      </svg>

      <Nav />
      <HeroSignatureStage />
      <Tape />
      <CraftBandsV2 />
      <LaunchKitShowcase />
      <WorkShowcaseV2 />
      <Services />
      <Stats />
      <ProcessSection />
      <Contact />
    </PageShell>
  );
}
