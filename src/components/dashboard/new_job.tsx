import { Briefcase, Building2, Pencil, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  type CreateJobInput,
  type JobStatus,
  STATUS_META,
} from "@/lib/validation/job.schema";
import { useEffect, useState } from "react";

const EMPTY_JOB: Partial<CreateJobInput> = {
  title: "",
  role: "",
  company: "",
  location: "",
  workMode: "",
  salary: "",
  wheresApplied: "",
  status: "APPLIED" as JobStatus,
  contact: "",
  contactEmail: "",
  link: "",
  description: "",
  notes: "",
};

const WORK_MODES = ["Remoto", "Híbrido", "Presencial"];

export function NewJobSheet({
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  job = null,
}: NewJobProps) {
  const isEditing = Boolean(job);
  const [form, setForm] = useState<Partial<CreateJobInput>>(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (job) {
      setForm({
        title: job.title || "",
        role: job.role || "",
        company: job.company || "",
        location: job.location || "",
        workMode: job.workMode || "",
        salary: job.salary || "",
        wheresApplied: job.wheresApplied || "",
        status: job.status || ("APPLIED" as JobStatus),
        contact: job.contact || "",
        contactEmail: job.contactEmail || "",
        link: job.link || "",
        description: job.description || "",
        notes: job.notes || "",
      });
    } else {
      setForm(EMPTY_JOB);
    }
  }, [job, open]);

  function updateField<K extends keyof CreateJobInput>(
    key: K,
    value: CreateJobInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    const success = isEditing
      ? await onUpdate?.(formData)
      : await onCreate?.(formData);
    setSaving(false);

    if (success !== false) {
      onOpenChange(false);
    }
  }

  function handleCancel() {
    setForm(job ? { ...form } : EMPTY_JOB);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="gap-3 border-b p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {isEditing ? (
                <Pencil className="size-5" />
              ) : (
                <Briefcase className="size-5" />
              )}
            </span>
            <div className="flex flex-col gap-1">
              <SheetTitle className="text-lg leading-tight">
                {isEditing ? "Editar postulación" : "Nueva postulación"}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {isEditing
                  ? "Actualiza los datos de esta postulación."
                  : "Registra un nuevo trabajo al que te postulaste."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <form id="new-job-form" onSubmit={handleSubmit} className="contents">
          <ScrollArea className="flex-1 min-h-0">
            <FieldGroup className="p-6">
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej. Postulación Frontend Engineer - Q3"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Puesto</FieldLabel>
                <Input
                  id="role"
                  name="role"
                  placeholder="Frontend Engineer"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="company">Empresa</FieldLabel>
                <Input
                  id="company"
                  name="company"
                  placeholder="Nebula Labs"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="location">Ubicación</FieldLabel>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Ciudad de México"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Modalidad</FieldLabel>
                  <Select
                    name="workMode"
                    value={form.workMode}
                    onValueChange={(value) =>
                      updateField("workMode", value as string)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="salary">Salario</FieldLabel>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="$4,500 USD"
                    value={form.salary}
                    onChange={(e) => updateField("salary", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="wheresApplied">Fuente</FieldLabel>
                  <Input
                    id="wheresApplied"
                    name="wheresApplied"
                    placeholder="LinkedIn"
                    value={form.wheresApplied}
                    onChange={(e) =>
                      updateField("wheresApplied", e.target.value)
                    }
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Select
                  name="status"
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value as JobStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_META) as JobStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="contact">Contacto</FieldLabel>
                  <Input
                    id="contact"
                    name="contact"
                    placeholder="Laura Méndez"
                    value={form.contact}
                    onChange={(e) => updateField("contact", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contactEmail">
                    Correo de contacto
                  </FieldLabel>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="laura@empresa.com"
                    value={form.contactEmail}
                    onChange={(e) =>
                      updateField("contactEmail", e.target.value)
                    }
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="link">Enlace de la oferta</FieldLabel>
                <Input
                  id="link"
                  name="link"
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => updateField("link", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Requisitos del puesto, responsabilidades, etc."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="min-h-20 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">Notas</FieldLabel>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Detalles del proceso, seguimiento, etc."
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-20 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </Field>
            </FieldGroup>
          </ScrollArea>

          <SheetFooter className="flex-row gap-2 border-t p-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {isEditing ? (
                <Save data-icon="inline-start" />
              ) : (
                <Building2 data-icon="inline-start" />
              )}
              {saving
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Guardar postulación"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
