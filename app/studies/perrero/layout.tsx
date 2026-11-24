import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import "./perrero.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pr-disp",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-pr-head",
  display: "swap",
});

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-pr-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PERRERO SAUCE CO. — Caracas Street Cart Sauces | E-Commerce Study",
  description:
    "Small-batch Venezuelan street hot-dog sauces: Guasacaca Verde, 3AM Garlic Velvet, Sweet Corn Gold, Smoky Bacon Tartar & Calle Heat Ají.",
};

export default function PerreroStudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`pr-root ${anton.variable} ${bricolage.variable} ${interTight.variable}`}
    >
      {children}
    </div>
  );
}
