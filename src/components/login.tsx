"use client";

import { BriefcaseBusiness, Mail } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/shared/password-field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Spinner } from "./ui/spinner";

export function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const isValidEmail =
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setLoading(true);

    const onSuccess = () => {
      toast.add({
        title: "Sesión iniciada",
        description: "Bienvenido de vuelta a Trayecto.",
        type: "success",
        timeout: 3000,
      });
      router.push("/dashboard");
    };

    const onError = () => {
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      toast.add({
        title: "No se pudo iniciar sesión",
        description: "Revisa tus credenciales e intenta de nuevo.",
        type: "error",
      });
    };

    if (isValidEmail) {
      void authClient.signIn.email({
        email: email,
        password: formData.get("password") as string,
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess,
          onError,
        },
      });
      return;
    }

    void authClient.signIn.username({
      username: email as string,
      password: formData.get("password") as string,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess,
        onError,
      },
    });
  };

  return (
    <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
      {/* Brand / copy */}
      <section className="hidden flex-col gap-6 lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseBusiness className="size-5" />
          </span>
          <span className="font-mono text-sm font-medium tracking-widest uppercase">
            Trayecto
          </span>
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight">
          Ordena tu búsqueda de trabajo en un solo tablero.
        </h1>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          Registra cada postulación, sigue en qué etapa de la entrevista te
          quedaste y detecta a tiempo las que quedaron sin respuesta.
        </p>
        <dl className="grid grid-cols-3 gap-4 pt-2">
          {[
            { k: "Postulaciones", v: "10" },
            { k: "En entrevista", v: "4" },
            { k: "Ofertas", v: "1" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col gap-1">
              <dt className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                {s.k}
              </dt>
              <dd className="text-2xl font-semibold">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Login card */}
      <section className="rounded-2xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
            Acceso
          </span>
          <h2 className="text-2xl font-semibold tracking-tight">
            Inicia sesión
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Entra a tu tablero de seguimiento de trabajos.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                />
              </InputGroup>
            </Field>

            <PasswordField
              id="password"
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              autoComplete="current-password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-accent"
                  defaultChecked
                />
                Recordarme
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`mt-1 w-full font-mono tracking-wide uppercase ${
                shake ? "animate-shake" : ""
              }`}
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </section>
    </div>
  );
}
