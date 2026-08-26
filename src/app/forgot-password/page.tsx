import { SceneBackground } from "@/components/background";
import { AuthLegalFooter } from "@/components/legal/auth-legal-footer";
import { ForgotPassword } from "@/components/forgot-password/forgot-password";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña - Trayecto",
  description: "Recupera el acceso a tu cuenta en Trayecto.",
};

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <ForgotPassword />
      </div>
      <AuthLegalFooter />
    </main>
  );
}
