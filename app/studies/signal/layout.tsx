import type { Metadata } from "next";
import { Courier_Prime, Silkscreen } from "next/font/google";
import "./signal.css";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-signal-px",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-signal-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Juan Colombo — Signal Study | The Juanimal Studio",
  description:
    "Product & Creative Lead. 18+ years from Leo Burnett campaigns to Microsoft Copilot & Xbox Game Pass, now building AI-driven pipelines and products at Fuel or Fool.",
};

export default function SignalStudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`sg-root ${silkscreen.variable} ${courierPrime.variable}`}
    >
      {children}
    </div>
  );
}
