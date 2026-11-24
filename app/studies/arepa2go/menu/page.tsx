import type { Metadata } from "next";
import Arepa2GoMenuView from "@/components/studies/arepa2go/Arepa2GoMenuView";

export const metadata: Metadata = {
  title: "Full Menu | Arepa 2GO",
  description:
    "Explore all Venezuelan arepas, empanadas, tequeños, tostones, yuca fries, churros & tropical cocktails.",
};

export default function Arepa2GoMenuPage() {
  return <Arepa2GoMenuView />;
}
