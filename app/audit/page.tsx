import { AuditTool } from "@/components/AuditTool";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";

// Unlisted page: reachable by direct link only, and kept out of search
// results so it can be handed to specific prospects rather than used freely.
export const metadata = {
  title: "UX Audit — The Juanimal Studio",
  description:
    "An AI-powered UX audit from The Juanimal Studio, by invitation.",
  robots: { index: false, follow: false },
};

export default function AuditPage() {
  return (
    <PageShell page="about">
      <Nav active="audit" />
      <header className="merch-hero" id="top">
        <span className="eyebrow">The Juanimal Studio</span>
        <h1>Free UX Audit</h1>
        <p>
          Paste any live URL below and get an instant, AI-powered read on
          what&rsquo;s working and what&rsquo;s costing you conversions.
        </p>
      </header>
      <AuditTool />
    </PageShell>
  );
}
