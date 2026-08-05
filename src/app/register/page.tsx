"use client";

import { SceneBackground } from "@/components/background";
import { AuthLegalFooter } from "@/components/legal/auth-legal-footer";
import { Register } from "@/components/register/register";
import { useDebounce } from "@/hooks/use-debounce";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 500);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(dataForm: FormData) {
    setSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      email: dataForm.get("email") as string,
      password: dataForm.get("password") as string,
      name: dataForm.get("name") as string,
      username: dataForm.get("username") as string,

      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          return;
        },
      },
    });
    setSubmitting(false);

  }

  useEffect(() => {
    async function checkUsernameAvailability() {
      if (username.length <= 3) return null;
      setLoading(true);
      try {
        const result = await authClient.isUsernameAvailable({
          username: debouncedUsername,
        });
        setAvailable(result.data?.available ?? null);
      } catch (e) {
        console.error(e);
        setAvailable(null);
      } finally {
        setLoading(false);
      }
    }

    checkUsernameAvailability();
  }, [debouncedUsername]);
  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <SceneBackground
        intensity={1}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-background/10 to-background/70" />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Register
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={handleSubmit}
          setUsername={setUsername}
          username={username}
          available={available}
          loading={loading}
          submitting={submitting}
          shake={shake}
        />
      </div>
      <AuthLegalFooter />
    </main>
  );
}
