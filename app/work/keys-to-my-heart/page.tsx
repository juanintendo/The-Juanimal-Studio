import type { Metadata } from "next";
import { KeysToMyHeartCaseStudy } from "@/components/KeysToMyHeartCaseStudy";

export const metadata: Metadata = {
  title: "Keys to My Heart (The Illusion of Agency) — The Juanimal Studio",
  description:
    "Case study: a 3:16 musical animated short at 122.5 BPM teaching the 12 classical principles of animation across 7 visual eras with human keys and agent pipelines.",
};

export default function KeysToMyHeartPage() {
  return <KeysToMyHeartCaseStudy />;
}
