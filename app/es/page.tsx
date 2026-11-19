import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";

export const metadata: Metadata = {
  title:
    "The Juanimal Studio — Films de Lanzamiento, Product Motion y Web Cinematográfica",
  description:
    "Launch kits, demos de producto centrados en UI, sistemas de motion interactivo y web scrollytelling para equipos SaaS e IA.",
};

export default function SpanishHomePage() {
  return <HomeContent />;
}
