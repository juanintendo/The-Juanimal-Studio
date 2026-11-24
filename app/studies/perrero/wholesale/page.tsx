import type { Metadata } from "next";
import PerreroWholesaleView from "@/components/studies/perrero/PerreroWholesaleView";

export const metadata: Metadata = {
  title: "Wholesale | Perrero Sauce Co.",
  description:
    "Stock Perrero Sauce Co. in your specialty shop, restaurant, or street food stand.",
};

export default function PerreroWholesalePage() {
  return <PerreroWholesaleView />;
}
