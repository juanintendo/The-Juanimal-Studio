import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Libre_Franklin,
  Montserrat,
  Yellowtail,
} from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-disp",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

const yellowtail = Yellowtail({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Juanimal Studio — Tech Wizard · UX/UI, AI & Business Tools",
  description:
    "UX/UI, web & app development, AI implementation and business tools. Fiery digital solutions for hot business.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${montserrat.variable} ${yellowtail.variable} ${libreFranklin.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
