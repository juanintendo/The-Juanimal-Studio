import type { Metadata } from "next";
import "@/app/gallery.css";
import { PosterGalleryHome } from "@/components/gallery/PosterGalleryHome";

export const metadata: Metadata = {
  title: "Juanimal Designs — Galería de Pósters, Motion & Sistemas WebGL",
  description:
    "Pósters interactivos en WebGL, cómics espaciales, libros 3D y dirección creativa bilingüe por Juan Colombo.",
};

export default function SpanishHomePage() {
  return <PosterGalleryHome />;
}
