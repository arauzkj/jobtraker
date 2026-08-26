"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Mail, RotateCw } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.add({
        title: "Correo no válido",
        description: "Ingresa una dirección de correo electrónico válida.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        toast.add({
          title: "Error",
          description: error.message || "No pudimos procesar tu solicitud. Intenta más tarde.",
          type: "error",
        });
      } else {
        setSent(true);
        setSentEmail(email);
        toast.add({
          title: "Correo enviado",
          description: "Hemos enviado el enlace a tu bandeja de entrada.",
          type: "success",
          timeout: 4000,
        });
      }
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.add({
        title: "Error de conexión",
        description: "No fue posible conectar con el servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
      {/* Brand Panel */}
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
          Recupera el acceso a tu seguimiento de postulaciones.
        </h1>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          No pierdas el hilo de tus oportunidades laborales. Te enviaremos un enlace seguro para restablecer tu contraseña en segundos.
        </p>
        <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            Enlace con caducidad segura
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            El enlace de recuperación es de un solo uso y vencerá en 1 hora por seguridad.
          </p>
        </div>
      </section>

      {/* Card */}
      <section className="rounded-2xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-7" />
            </div>

            <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              Revisa tu correo
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Enlace enviado
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hemos enviado las instrucciones para restablecer tu contraseña a:
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">
              {sentEmail}
            </p>

            <div className="mt-6 w-full rounded-lg border border-border/60 bg-muted/30 p-3 text-left text-xs text-muted-foreground">
              💡 Si no lo encuentras en unos minutos, revisa tu carpeta de correo no deseado (spam) o promociones.
            </div>

            <div className="mt-6 flex w-full flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSent(false)}
                className="w-full font-mono text-xs uppercase"
              >
                <RotateCw className="size-3.5" />
                Ingresar otro correo
              </Button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Volver a iniciar sesión
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                Recuperación
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ingresa tu correo electrónico registrado y te enviaremos un enlace para crear una nueva.
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
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      autoComplete="email"
                      required
                      autoFocus
                    />
                  </InputGroup>
                </Field>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 w-full font-mono tracking-wide uppercase ${
                    shake ? "animate-shake" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <Spinner className="size-4" />
                      Enviando enlace...
                    </>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </Button>
              </FieldGroup>
            </form>

            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <ArrowLeft className="size-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
