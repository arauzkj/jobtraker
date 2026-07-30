"use client";
import { SceneBackground } from "@/components/background";
import { Login } from "@/components/login";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(dataForm: FormData) {
    const email = dataForm.get("email");

    const isValidEmail =
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setLoading(true);
    if (isValidEmail) {
      const { data, error } = await authClient.signIn.email({
        email: dataForm.get("email") as string,
        password: dataForm.get("password") as string,
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              title: "Sesión iniciada",
              description: "Bienvenido de vuelta a Trayecto.",
              type: "success",
              timeout: 3000,
            });
            router.push("/dashboard");
          },
          onError: () => {
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);

            toast.add({
              title: "No se pudo iniciar sesión",
              description: "Revisa tus credenciales e intenta de nuevo.",
              type: "error",
            });
            return;
          },
        },
      });
    } else {
      const { data, error } = await authClient.signIn.username({
        username: dataForm.get("email") as string,
        password: dataForm.get("password") as string,
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              title: "Sesión iniciada",
              description: "Bienvenido de vuelta a Trayecto.",
              type: "success",
              timeout: 3000,
            });
            router.push("/dashboard");
          },
          onError: () => {
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);

            toast.add({
              title: "No se pudo iniciar sesión",
              description: "Revisa tus credenciales e intenta de nuevo.",
              type: "error",
            });
            return;
          },
        },
      });
    }
  }

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />

      <Login
        setShowPassword={setShowPassword}
        showPassword={showPassword}
        onSubmit={handleSubmit}
        loading={loading}
        shake={shake}
      />
    </main>
  );
}
