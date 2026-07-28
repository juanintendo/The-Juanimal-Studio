import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Tape } from "@/components/Tape";
import { Work } from "@/components/Work";

export default function HomePage() {
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
            <circle cx="3.75" cy="3.75" r="1.9" fill="#171009" />
          </pattern>
        </defs>
      </svg>

      <Nav />
      <Hero />
      <Tape />
      <Services />
      <Stats />
      <Work />
      <Contact />
    </PageShell>
  );
}
