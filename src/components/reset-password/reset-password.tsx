"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, BriefcaseBusiness, CheckCircle2, KeyRound } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  // Si no hay token en los parámetros
  if (!token) {
    return (
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
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
            Restablece tu contraseña de forma segura.
          </h1>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Protege tu cuenta con una nueva contraseña para continuar gestionando todas tus postulaciones.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <AlertCircle className="size-7" />
            </div>
            <span className="font-mono text-[11px] tracking-widest uppercase text-rose-500">
              Enlace inválido
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Token no encontrado
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              El enlace para restablecer tu contraseña no es válido o no incluye el token necesario.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <Link
                href="/forgot-password"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase text-primary-foreground hover:bg-primary/90"
              >
                Solicitar un nuevo enlace
              </Link>
              <Link
                href="/"
                className="mt-2 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const pwd = (formData.get("password") as string) || password;
    const confirmPwd = (formData.get("confirmPassword") as string) || confirmPassword;

    if (!pwd || pwd.length < 8) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.add({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 8 caracteres.",
        type: "error",
      });
      return;
    }

    if (pwd !== confirmPwd) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.add({
        title: "Las contraseñas no coinciden",
        description: "Asegúrate de que ambas contraseñas sean idénticas.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: pwd,
        token: token,
      });

      if (error) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        toast.add({
          title: "Error al actualizar contraseña",
          description: error.message || "El token es inválido o ya ha expirado. Solicita un nuevo enlace.",
          type: "error",
        });
      } else {
        setSuccess(true);
        toast.add({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido restablecida correctamente.",
          type: "success",
          timeout: 4000,
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.add({
        title: "Error de servidor",
        description: "No se pudo actualizar tu contraseña. Intenta nuevamente.",
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
          Crea tu nueva contraseña de acceso.
        </h1>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          Elige una contraseña segura que combine letras, números y símbolos para mantener protegida tu información.
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
          <KeyRound className="size-5 shrink-0 text-accent" />
          <span>Te recomendamos utilizar al menos 8 caracteres combinando mayúsculas, minúsculas y números.</span>
        </div>
      </section>

      {/* Form Card */}
      <section className="rounded-2xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
        {success ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-7" />
            </div>

            <span className="font-mono text-[11px] tracking-widest uppercase text-emerald-500">
              ¡Listo!
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Contraseña restablecida
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tu contraseña se actualizó correctamente. Te estamos redirigiendo al inicio de sesión...
            </p>

            <div className="mt-6 w-full">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase text-primary-foreground hover:bg-primary/90"
              >
                Iniciar sesión ahora
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                Nueva Contraseña
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Restablece tu contraseña
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ingresa y confirma tu nueva contraseña de acceso.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <PasswordField
                  id="password"
                  name="password"
                  label="Nueva contraseña"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <PasswordField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar nueva contraseña"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />

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
                      Actualizando contraseña...
                    </>
                  ) : (
                    "Guardar nueva contraseña"
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
