import type { Metadata } from "next";
import { NoSkuShowcase } from "@/components/nosku/NoSkuShowcase";

export const metadata: Metadata = {
  title: "NO SKU™ — There Is No Product Yet — The Juanimal Studio",
  description:
    "Portfolio Web Concept #02: interactive Three.js unspooling tape roll, 3D paper-curl sticky note, orbital paint wipe, 2D diagonal camera & physics bouncing sticker balls.",
};

export default function NoSkuPage() {
  return <NoSkuShowcase />;
}
