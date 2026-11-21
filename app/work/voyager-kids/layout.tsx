import type { ReactNode } from "react";
import {
  Caveat_Brush,
  Fraunces,
  Inter_Tight,
  Patrick_Hand,
} from "next/font/google";
import "./voyager.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--vg-font-serif",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--vg-font-crayon",
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--vg-font-brush",
  display: "swap",
});

const interTight = Inter_Tight({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--vg-font-ui",
  display: "swap",
});

export default function VoyagerKidsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} ${patrickHand.variable} ${caveatBrush.variable} ${interTight.variable} vg-font-root`}
    >
      {children}
    </div>
  );
}
