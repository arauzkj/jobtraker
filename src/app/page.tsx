"use client";
import { SceneBackground } from "@/components/background";
import { Login } from "@/components/login";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(data: FormData) {
    // Login "tonto": sin lógica todavía, solo entra al dashboard.
    console.log("Login data:", Object.fromEntries(data.entries()));
    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />

      <Login setShowPassword={setShowPassword} showPassword={showPassword} onSubmit={handleSubmit} />
    </main>
  );
}
