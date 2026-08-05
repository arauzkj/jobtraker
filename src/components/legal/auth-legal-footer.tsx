import Link from "next/link";

export function AuthLegalFooter() {
  return (
    <footer className="relative z-10 w-full px-4 pb-6 pt-2">
      <p className="mx-auto max-w-5xl text-center text-xs leading-relaxed text-muted-foreground">
        Al usar Trayecto aceptas nuestros{" "}
        <Link
          href="/terminos"
          className="font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
        >
          Términos y Condiciones
        </Link>{" "}
        y el{" "}
        <Link
          href="/eula"
          className="font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
        >
          EULA
        </Link>
        . Jurisdicción: República de Costa Rica.
      </p>
    </footer>
  );
}

export function LegalAcceptanceLinks() {
  return (
    <>
      <Link
        href="/terminos"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        Términos y Condiciones
      </Link>{" "}
      y el{" "}
      <Link
        href="/eula"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        EULA
      </Link>
    </>
  );
}
