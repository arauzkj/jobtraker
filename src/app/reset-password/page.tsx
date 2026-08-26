import { Suspense } from "react";
import { SceneBackground } from "@/components/background";
import { AuthLegalFooter } from "@/components/legal/auth-legal-footer";
import { ResetPasswordForm } from "@/components/reset-password/reset-password";
import { Spinner } from "@/components/ui/spinner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña - Trayecto",
  description: "Configura tu nueva contraseña en Trayecto.",
};

function ResetPasswordFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
      <AuthLegalFooter />
    </main>
  );
}
