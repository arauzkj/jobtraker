import { BriefcaseBusiness, Mail, User } from "lucide-react";
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

export function Register({
  showPassword,
  setShowPassword,
  onSubmit,
}: RegisterProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
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
                  placeholder="Tu nombre"
                  autoComplete="name"
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
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                />
              </InputGroup>
            </Field>

            <PasswordField setShowPassword={setShowPassword} showPassword={showPassword} />

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-input accent-accent"
                defaultChecked
              />
              <span>
                Acepto los términos de servicio y la política de privacidad.
              </span>
            </label>

            <Button
              type="submit"
              className="mt-1 w-full font-mono tracking-wide uppercase"
            >
              Crear cuenta
            </Button>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  );
}
