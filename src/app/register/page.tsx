"use client";

import { SceneBackground } from "@/components/background";
import { Register } from "@/components/register/register";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  function handleSubmit(data: FormData) {
    console.log("Register data:", Object.fromEntries(data.entries()));
    router.push("/");
  }
  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />
      <Register
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleSubmit}
      ></Register>
    </main>
  );
}
