import { AuditTool } from "@/components/AuditTool";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Free UX Audit — The Juanimal Studio",
  description:
    "Drop a URL, get an instant AI-powered UX audit from The Juanimal Studio.",
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
