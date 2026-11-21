import type { ReactNode } from "react";
import {
  Bricolage_Grotesque,
  Inter_Tight,
  Patrick_Hand,
  Space_Mono,
} from "next/font/google";
import "./ramses.css";

const bricolage = Bricolage_Grotesque({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--rm-font-disp",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--rm-font-comic",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--rm-font-mono",
  display: "swap",
});

const interTight = Inter_Tight({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--rm-font-ui",
  display: "swap",
});

export default function RamsesManiaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${bricolage.variable} ${patrickHand.variable} ${spaceMono.variable} ${interTight.variable} rm-font-root`}
    >
      {children}
    </div>
  );
}
