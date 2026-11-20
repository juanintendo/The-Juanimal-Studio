import type { ReactNode } from "react";
import {
  Barlow_Condensed,
  Caveat,
  Caveat_Brush,
  Inter_Tight,
  Kalam,
  Permanent_Marker,
  Reenie_Beanie,
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

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--ns-font-pen",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--ns-font-pencil",
  display: "swap",
});

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--ns-font-fineliner",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--ns-font-marker",
  display: "swap",
});

export default function NoSkuLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${barlowCondensed.variable} ${interTight.variable} ${caveatBrush.variable} ${caveat.variable} ${reenieBeanie.variable} ${kalam.variable} ${permanentMarker.variable} ns-font-root`}
    >
      {children}
    </div>
  );
}
