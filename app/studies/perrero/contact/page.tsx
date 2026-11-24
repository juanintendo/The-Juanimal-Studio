import type { Metadata } from "next";
import PerreroContactView from "@/components/studies/perrero/PerreroContactView";

export const metadata: Metadata = {
  title: "Contact | Perrero Sauce Co.",
  description:
    "Get in touch with Perrero Sauce Co. for collabs, events, press, or sauce questions.",
};

export default function PerreroContactPage() {
  return <PerreroContactView />;
}
