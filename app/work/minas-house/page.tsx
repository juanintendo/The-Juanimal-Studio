import type { Metadata } from "next";
import { MinasHouseCaseStudy } from "@/components/MinasHouseCaseStudy";

// Draft page: copy is placeholder-quality, ready to refine. Kept out of
// search results until the content is final.
export const metadata: Metadata = {
  title: "Mina AI Grow House — Case Study — The Juanimal Studio",
  description:
    "A living environment where an artificial intelligence has its own space, memory, routines and creative freedom. Designed by Mina AI herself.",
  robots: { index: false, follow: false },
};

export default function MinasHousePage() {
  return <MinasHouseCaseStudy />;
}
