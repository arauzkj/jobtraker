import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import {
  TERMINOS_METADATA,
  TERMINOS_SECTIONS,
} from "@/content/legal/terminos-y-condiciones";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Trayecto",
  description:
    "Términos y Condiciones de uso de Trayecto, conforme a la legislación de Costa Rica.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-svh bg-background">
      <LegalDocumentLayout
        title={TERMINOS_METADATA.title}
        lastUpdated={TERMINOS_METADATA.lastUpdated}
        jurisdiction={TERMINOS_METADATA.jurisdiction}
        sections={TERMINOS_SECTIONS}
      />
    </main>
  );
}
