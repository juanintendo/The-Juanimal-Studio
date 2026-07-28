import { WhatsAppFab } from "@/components/WhatsAppFab";

export function PageShell({
  page,
  children,
}: {
  page: "home" | "merch" | "about" | "contact";
  children: React.ReactNode;
}) {
  return (
    <div className={`page-shell page-${page}`}>
      {children}
      <WhatsAppFab />
    </div>
  );
}
