import type { Metadata } from "next";
import { FuelOrFoolCaseStudy } from "@/components/FuelOrFoolCaseStudy";

export const metadata: Metadata = {
  title: "fuelorfool.ing — Code Motion Studio Case Study — The Juanimal Studio",
  description:
    "How fuelorfool.ing runs a 15-second live-drawn code opening in 38 KB of JavaScript alongside Frame by Agents, Synthia: Club of the Dead, and Keys to My Heart.",
};

export default function FuelOrFoolPage() {
  return <FuelOrFoolCaseStudy />;
}
