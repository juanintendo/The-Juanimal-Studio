import type { Metadata } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Arepa2GoShell } from "@/components/studies/arepa2go/Arepa2GoShell";
import "./arepa2go.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-a2g-head",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-a2g-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
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
      className={`a2g-root ${inter.variable} ${fraunces.variable} ${plusJakarta.variable}`}
    >
      <Arepa2GoShell>{children}</Arepa2GoShell>
    </div>
  );
}
