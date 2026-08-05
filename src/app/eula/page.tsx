import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import { EULA_METADATA, EULA_SECTIONS } from "@/content/legal/eula";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EULA",
  description:
    "Acuerdo de Licencia de Usuario Final de Trayecto, conforme a la legislación de Costa Rica.",
  alternates: { canonical: "/eula" },
};

export default function EulaPage() {
  return (
    <main className="min-h-svh bg-background">
      <LegalDocumentLayout
        title={EULA_METADATA.title}
        lastUpdated={EULA_METADATA.lastUpdated}
        jurisdiction={EULA_METADATA.jurisdiction}
        sections={EULA_SECTIONS}
      />
    </main>
  );
}
