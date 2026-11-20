import type { ReactNode } from "react";
import {
  Barlow_Condensed,
  Caveat_Brush,
  Inter_Tight,
} from "next/font/google";
import "./nosku.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--ns-font-disp",
  display: "swap",
});

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--ns-font-body",
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--ns-font-hand",
  display: "swap",
});

export default function NoSkuLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${barlowCondensed.variable} ${interTight.variable} ${caveatBrush.variable} ns-font-root`}
    >
      {children}
    </div>
  );
}
