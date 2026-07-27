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
import { useEffect, useState } from "react";
import { JobStatusDto } from "@/dto/jobstatus.dto.enum";
import { STATUS_META } from "@/dto/status.const";
import { JobDto } from "@/dto/job.dto";

const emptyForm = {
  role: "",
  company: "",
  location: "",
  workMode: "Remoto",
  salary: "",
  source: "",
  status: JobStatusDto.PENDENTING,
  contact: "",
  contactEmail: "",
  url: "",
  notes: "",
};

export function NewJobSheet({
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  job = null,
}: NewJobProps) {
  const WORK_MODES = ["Remoto", "Híbrido", "Presencial"];
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(job);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(()=>{
    if(!open) return
    if(job){
      return
    }else{
      return
    }
  }, [job,open]);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="gap-3 border-b p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {isEditing ? <Pencil className="size-5" /> : <Briefcase className="size-5" />}
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

        <form
          id="new-job-form"
          onSubmit={handleSubmit}
          className="contents"
        >
          <ScrollArea className="flex-1">
            <FieldGroup className="p-6">
              <Field>
                <FieldLabel htmlFor="role">Puesto</FieldLabel>
                <Input
                  id="role"
                  placeholder="Frontend Engineer"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="company">Empresa</FieldLabel>
                <Input
                  id="company"
                  placeholder="Nebula Labs"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="location">Ubicación</FieldLabel>
                  <Input
                    id="location"
                    placeholder="Ciudad de México"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Modalidad</FieldLabel>
                  <Select
                    value={form.workMode}
                    onValueChange={(v) => set("workMode", v as typeof form.workMode)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
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
                    placeholder="$4,500 USD"
                    value={form.salary}
                    onChange={(e) => set("salary", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="source">Fuente</FieldLabel>
                  <Input
                    id="source"
                    placeholder="LinkedIn"
                    value={form.source}
                    onChange={(e) => set("source", e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v as JobStatusDto)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: JobStatusDto) => STATUS_META[value].label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_META) as JobStatusDto[]).map((s) => (
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
                    placeholder="Laura Méndez"
                    value={form.contact}
                    onChange={(e) => set("contact", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contactEmail">Correo de contacto</FieldLabel>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="laura@empresa.com"
                    value={form.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="url">Enlace de la oferta</FieldLabel>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) => set("url", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">Notas</FieldLabel>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Detalles del proceso, seguimiento, etc."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
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
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? (
                <Save data-icon="inline-start" />
              ) : (
                <Building2 data-icon="inline-start" />
              )}
              {isEditing ? "Guardar cambios" : "Guardar postulación"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
