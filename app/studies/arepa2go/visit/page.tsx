import type { Metadata } from "next";
import Arepa2GoVisitView from "@/components/studies/arepa2go/Arepa2GoVisitView";

export const metadata: Metadata = {
  title: "Visit & Takeaway | Arepa 2GO",
  description:
    "Visit Arepa 2GO in Southsea UK, read verified guest reviews, or send a takeaway inquiry.",
};

export default function Arepa2GoVisitPage() {
  return <Arepa2GoVisitView />;
}
