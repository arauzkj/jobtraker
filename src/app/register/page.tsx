"use client";

import { SceneBackground } from "@/components/background";
import { Register } from "@/components/register/register";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  async function handleSubmit(dataForm: FormData) {
    const { data, error } = await authClient.signUp.email({
      email: dataForm.get("email") as string,
      password: dataForm.get("password") as string,
      name: "",
      username: "",
      callbackURL: "/dashboard",
    });
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
