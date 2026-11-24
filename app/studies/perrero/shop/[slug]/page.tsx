import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSauceBySlug, PERRERO_SAUCES } from "@/components/studies/perrero/catalog";
import PerreroPdpView from "@/components/studies/perrero/PerreroPdpView";

export function generateStaticParams() {
  return PERRERO_SAUCES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sauce = getSauceBySlug(slug);
  if (!sauce) return { title: "Sauce Not Found | Perrero Sauce Co." };
  return {
    title: `${sauce.name} | Perrero Sauce Co.`,
    description: sauce.description,
  };
}

export default async function PerreroPdpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sauce = getSauceBySlug(slug);
  if (!sauce) notFound();
  return <PerreroPdpView sauce={sauce} />;
}
