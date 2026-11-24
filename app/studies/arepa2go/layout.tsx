import type { Metadata } from "next";
import { DM_Sans, Fraunces, Space_Grotesk } from "next/font/google";
import { Arepa2GoShell } from "@/components/studies/arepa2go/Arepa2GoShell";
import "./arepa2go.css";

const spaceGrotesk = Space_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-a2g-head",
  display: "swap",
});

const fraunces = Fraunces({
  weight: ["600", "800"],
  subsets: ["latin"],
  variable: "--font-a2g-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-a2g-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AREPA 2GO — Venezuela in a Bite | CalorieMate Editorial Study",
  description:
    "Authentic Venezuelan cuisine in Southsea UK: handmade gluten-free arepas, tequeños, empanadas & tropical cocktails.",
};

export default function Arepa2GoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`a2g-root ${spaceGrotesk.variable} ${fraunces.variable} ${dmSans.variable}`}
    >
      <Arepa2GoShell>{children}</Arepa2GoShell>
    </div>
  );
}
