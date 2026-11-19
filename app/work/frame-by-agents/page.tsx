import type { Metadata } from "next";
import { FrameByAgentsCaseStudy } from "@/components/FrameByAgentsCaseStudy";

export const metadata: Metadata = {
  title: "Frame by Agents Launch Kit — Case Study — The Juanimal Studio",
  description:
    "Launch Kit #001 case study: 75s deterministic SaaS launch film, 9:16 paid-social cutdowns, 4 feature loops, and 25-run Codex benchmark telemetry.",
};

export default function FrameByAgentsPage() {
  return <FrameByAgentsCaseStudy />;
}
