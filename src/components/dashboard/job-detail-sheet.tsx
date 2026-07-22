import { cn } from "@/lib/utils"
import { InterviewStage, Job } from "@/types/components"
import { Building2, CalendarDays, Check, ExternalLink, Mail, MapPin, Pencil, Trash2, Wallet } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet"
import { StatusBadge } from "./status-badge"
import { ScrollArea } from "../ui/scroll-area"
import { formatDate, STAGE_META } from "./job-row"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"

export const STAGE_ORDER: InterviewStage[] = [
  "screening",
  "technical",
  "team",
  "final",
]

function StageProgress({ job }: { job: Job }) {
  const currentStep = job.stage ? STAGE_META[job.stage].step : 0
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
        Etapa de entrevista
      </span>
      <ol className="flex flex-col gap-0">
        {STAGE_ORDER.map((stage, i) => {
          const step = STAGE_META[stage].step
          const done = step < currentStep
          const active = step === currentStep
          const isLast = i === STAGE_ORDER.length - 1
          return (
            <li key={stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                    done && "border-transparent bg-success text-success-foreground",
                    active && "border-accent bg-accent/15 text-accent-foreground",
                    !done && !active && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : step}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "my-0.5 w-px flex-1",
                      done ? "bg-success" : "bg-border",
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-4 pt-0.5", isLast && "pb-0")}>
                <p
                  className={cn(
                    "text-sm",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {STAGE_META[stage].label}
                </p>
                {active && (
                  <p className="text-xs text-muted-foreground">Etapa actual</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

export function JobDetailSheet({
  job,
  open,
  onOpenChange,
}: {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        {job && (
          <>
            <SheetHeader className="gap-3 border-b p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <SheetTitle className="text-lg leading-tight">
                    {job.role}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {job.company}
                  </SheetDescription>
                </div>
              </div>
              <StatusBadge status={job.status} />
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Fact icon={MapPin} label="Ubicación" value={job.location} />
                  <Fact icon={Building2} label="Modalidad" value={job.workMode} />
                  <Fact icon={Wallet} label="Salario" value={job.salary} />
                  <Fact icon={CalendarDays} label="Fuente" value={job.source} />
                  <Fact
                    icon={CalendarDays}
                    label="Postulado"
                    value={formatDate(job.appliedDate)}
                  />
                  <Fact
                    icon={CalendarDays}
                    label="Actualizado"
                    value={formatDate(job.lastUpdate)}
                  />
                </div>

                {job.status === "interview" && (
                  <>
                    <Separator />
                    <StageProgress job={job} />
                  </>
                )}

                <Separator />

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Contacto
                  </span>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{job.contact}</span>
                      <span className="text-xs text-muted-foreground">
                        {job.contactEmail}
                      </span>
                    </div>
                    {job.contactEmail !== "—" && (
                      <Button size="icon-sm" variant="ghost" aria-label="Enviar correo">
                        <Mail />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Notas
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {job.notes}
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Historial
                  </span>
                  <ol className="flex flex-col gap-0">
                    {job.timeline.map((entry, i) => {
                      const isLast = i === job.timeline.length - 1
                      return (
                        <li key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                            {!isLast && <span className="my-0.5 w-px flex-1 bg-border" />}
                          </div>
                          <div className={cn("pb-4", isLast && "pb-0")}>
                            <p className="text-sm font-medium">{entry.label}</p>
                            <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                              {formatDate(entry.date)}
                            </p>
                            {entry.note && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {entry.note}
                              </p>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="flex-row gap-2 border-t p-4">
              <Button variant="outline" className="flex-1">
                <Pencil data-icon="inline-start" />
                Editar
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={job.url} target="_blank" rel="noreferrer" />}
              >
                <ExternalLink data-icon="inline-start" />
                Oferta
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Eliminar"
              >
                <Trash2 />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
