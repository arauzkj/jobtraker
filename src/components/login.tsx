import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export function Login({ showPassword, setShowPassword, onSubmit }: LoginProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit(formData);
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
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  defaultValue="demo@trayecto.app"
                  autoComplete="email"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <LockKeyhole />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  defaultValue="demo1234"
                  autoComplete="current-password"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-accent"
                  defaultChecked
                />
                Recordarme
              </label>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              className="mt-1 w-full font-mono tracking-wide uppercase"
            >
              Entrar al tablero
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Regístrate
          </button>
        </p>
      </section>
    </div>
  );
}
