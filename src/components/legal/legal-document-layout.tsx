import Link from "next/link";
import { ArrowLeft } from "lucide-react";


function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function renderBody(body: string) {
  return body.split("\n\n").map((paragraph, index) => (
    <p key={index} className="leading-relaxed text-muted-foreground">
      {renderInline(paragraph)}
    </p>
  ));
}

export function LegalDocumentLayout({
  title,
  lastUpdated,
  jurisdiction,
  sections,
}: LegalDocumentLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>

      <header className="mb-10 space-y-3 border-b border-border pb-8">
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          Documento legal · {jurisdiction}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Última actualización: {lastUpdated}
        </p>
      </header>

      <article className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="space-y-3">{renderBody(section.body)}</div>
          </section>
        ))}
      </article>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Este documento forma parte del acuerdo entre usted y el titular de
          Trayecto. Consulte también{" "}
          <Link href="/terminos" className="underline-offset-4 hover:underline">
            Términos y Condiciones
          </Link>{" "}
          y{" "}
          <Link href="/eula" className="underline-offset-4 hover:underline">
            EULA
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
