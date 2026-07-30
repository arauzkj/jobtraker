import {
  AtSign,
  BriefcaseBusiness,
  Check,
  Loader2,
  Mail,
  User,
  X,
} from "lucide-react";
import { AuthBrandPanel } from "./auth-brand-panel";
import { AuthCard } from "./auth-card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { PasswordField } from "../shared/password-field";
import { Button } from "../ui/button";
import Link from "next/link";
import { Spinner } from "../ui/spinner";

export function Register({
  showPassword,
  setShowPassword,
  onSubmit,
  username,
  setUsername,
  available,
  loading,
  submitting,
  shake,
}: RegisterProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  // Determinar el contenido de feedback para el username
  const usernameFeedback = () => {
    if (username.length <= 3) return null; // no mostrar nada si es muy corto
    if (loading) {
      return (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Verificando...
        </span>
      );
    }
    if (available === true) {
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <Check className="size-4" />
          Disponible
        </span>
      );
    }
    if (available === false) {
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-rose-600">
          <X className="size-4" />
          No disponible
        </span>
      );
    }
    return null;
  };

  return (
    <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
      <AuthBrandPanel
        icon={BriefcaseBusiness}
        brandName="Trayecto"
        title="Crea tu cuenta y empieza a ordenar tu búsqueda."
        description="Una cuenta para registrar cada postulación, guardar notas de cada entrevista y no perderle el rastro a ninguna oportunidad."
        features={[
          "Seguimiento por etapas de entrevista",
          "Alertas visuales para postulaciones sin respuesta",
          "Todo tu historial en un solo tablero",
        ]}
      />

      <AuthCard
        eyebrow="Registro"
        title="Crea tu cuenta"
        description="Comienza a seguir tus postulaciones en minutos."
        footer={
          <>
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  required
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </InputGroup>
            </Field>

            {/* Nombre de usuario */}
            <Field>
              <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <AtSign />
                </InputGroupAddon>
                <InputGroupInput
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  minLength={4}
                  required
                />
              </InputGroup>
              {/* Feedback de disponibilidad */}
              <div className="mt-1.5 min-h-5">{usernameFeedback()}</div>
            </Field>

            <PasswordField
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-input accent-accent"
                defaultChecked
                required
              />
              <span>
                Acepto los términos de servicio y la política de privacidad.
              </span>
            </label>

            <Button
              type="submit"
              disabled={submitting}
              className={`mt-1 w-full font-mono tracking-wide uppercase ${
                shake ? "animate-shake" : ""
              }`}
            >
              {submitting ? (
                <>
                  <Spinner className="size-4" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  );
}
