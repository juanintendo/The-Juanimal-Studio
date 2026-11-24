import type { Metadata } from "next";
import PerreroFindUsView from "@/components/studies/perrero/PerreroFindUsView";

export const metadata: Metadata = {
  title: "Find Us Locally | Perrero Sauce Co.",
  description:
    "Find Perrero Sauce Co. bottles at partner shops and street spots in Caracas, Miami, New York, and Madrid.",
};

export default function PerreroFindUsPage() {
  return <PerreroFindUsView />;
}
