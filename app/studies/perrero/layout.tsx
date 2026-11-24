import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Londrina_Solid,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./perrero.css";

const londrina = Londrina_Solid({
  weight: ["400", "900"],
  subsets: ["latin"],
  variable: "--font-pr-disp",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-pr-ui",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-pr-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PERRERO SAUCE CO. — Caracas Street Cart Sauces | E-Commerce Study",
  description:
    "Small-batch Venezuelan street hot-dog sauces: Guasacaca Seria, 3.AM Las Mercedes, Liquid Cachapa, Tocineta Tartar & Molotov Love.",
};

export default function PerreroStudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`pr-root ${londrina.variable} ${barlowCondensed.variable} ${jakarta.variable}`}
    >
      {children}
    </div>
  );
}
