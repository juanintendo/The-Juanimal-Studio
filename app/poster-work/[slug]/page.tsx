import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/gallery.css";
import { PosterCaseStudy } from "@/components/gallery/PosterCaseStudy";
import {
  GALLERY_PROJECTS,
  getGalleryProject,
} from "@/lib/gallery/projects";

export function generateStaticParams() {
  return GALLERY_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getGalleryProject(slug);
  if (!project) {
    return { title: "Project Not Found — Juanimal Designs" };
  }
  return {
    title: `${project.title} — Juanimal Designs`,
    description: project.summary.en,
  };
}

export default async function PosterWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getGalleryProject(slug);
  if (!project) notFound();
  return <PosterCaseStudy project={project} />;
}
