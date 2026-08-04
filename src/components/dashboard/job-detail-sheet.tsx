import { cn } from "@/lib/utils"
import {
  Building2,
  CalendarDays,
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Wallet,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import { formatDate } from "./job-row"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { JobDto } from "@/dto/job.dto"
import { STAGE_ORDER } from "@/dto/stage_order.const"
import { STAGE_META } from "@/dto/stage_meta.const"
import { Timeline_EntryDto } from "@/dto/timeline_entry.dto"
import { JobStatusDto } from "@/dto/jobstatus.dto.enum"
import { JobStageDto } from "@/dto/jobstage.dto.enum"
import { STATUS_META } from "@/dto/status.const"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useState } from "react"

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Devuelve la meta del stage si el label coincide con uno conocido, o null */
function stageFromLabel(label: string): JobStageDto | null {
  const entry = (Object.entries(STAGE_META) as [JobStageDto, { label: string; step: number }][]).find(
    ([, meta]) => meta.label === label,
  )
  return entry ? entry[0] : null
}

/** Devuelve el step de una entrada de timeline (buscando por label o stage guardado) */
function stepForEntry(entry: Timeline_EntryDto & { stage?: string }): number | null {
  if (entry.stage && entry.stage in STAGE_META) {
    return STAGE_META[entry.stage as JobStageDto].step
  }
  const fromLabel = stageFromLabel(entry.label)
  return fromLabel !== null ? STAGE_META[fromLabel].step : null
}

// ─── StageProgress ────────────────────────────────────────────────────────────

function StageProgress({ job }: { job: JobDto }) {
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

// ─── Fact ─────────────────────────────────────────────────────────────────────

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

// ─── AddTimelineForm ──────────────────────────────────────────────────────────

function AddTimelineForm({
  onSave,
  onCancel,
  loading,
}: {
  onSave: (stage: JobStageDto, notes: string) => void
  onCancel: () => void
  loading: boolean
}) {
  const [stage, setStage] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stage) return
    onSave(stage as JobStageDto, notes.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3"
    >
      {/* Selector de etapa */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="timeline-stage-select"
          className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
        >
          Etapa <span className="text-destructive">*</span>
        </label>
        <Select
          value={stage}
          onValueChange={(v) => setStage(v as JobStageDto)}
          required
        >
          <SelectTrigger id="timeline-stage-select" className="w-full">
            <SelectValue placeholder="Selecciona una etapa…" />
          </SelectTrigger>
          <SelectContent>
            {STAGE_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-semibold text-muted-foreground">
                    {STAGE_META[s].step}
                  </span>
                  {STAGE_META[s].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notas */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="timeline-notes"
          className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
        >
          Notas
        </label>
        <textarea
          id="timeline-notes"
          placeholder="Detalles adicionales…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1"
          disabled={!stage || loading}
        >
          <Save data-icon="inline-start" />
          {loading ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}

// ─── TimelineList ─────────────────────────────────────────────────────────────

function TimelineList({ entries }: { entries: Timeline_EntryDto[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">Sin entradas en el historial.</p>
    )
  }

  return (
    <ol className="flex flex-col gap-0">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1
        const step = stepForEntry(entry as Timeline_EntryDto & { stage?: string })
        const hasStep = step !== null

        return (
          <li key={i} className="flex gap-3">
            {/* Indicador visual */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  hasStep
                    ? "size-6 border border-accent bg-accent/15 text-accent-foreground"
                    : "size-2 bg-accent",
                )}
              >
                {hasStep ? step : null}
              </span>
              {!isLast && (
                <span className="my-0.5 w-px flex-1 bg-border" />
              )}
            </div>

            {/* Contenido */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p className="text-sm font-medium">{entry.label}</p>
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                {formatDate(entry.date?.toISOString() || "")}
              </p>
              {entry.notes && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {entry.notes}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ─── JobDetailSheet ───────────────────────────────────────────────────────────

export function JobDetailSheet({
  job,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTimeline,
}: JobDetailSheetProps) {
  const [statusLoading, setStatusLoading] = useState(false)
  const [showTimelineForm, setShowTimelineForm] = useState(false)
  const [timelineLoading, setTimelineLoading] = useState(false)

  async function handleStatusChange(newStatus: string) {
    if (!job || !onStatusChange) return
    setStatusLoading(true)
    try {
      await onStatusChange(job, newStatus as JobStatusDto)
    } finally {
      setStatusLoading(false)
    }
  }

  async function handleSaveTimeline(stage: JobStageDto, notes: string) {
    if (!job?.id || !onAddTimeline) return
    setTimelineLoading(true)
    try {
      const label = STAGE_META[stage].label
      await onAddTimeline(job.id, { label, notes, stage })
      setShowTimelineForm(false)
    } finally {
      setTimelineLoading(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setShowTimelineForm(false)
        onOpenChange(v)
      }}
    >
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        {job && (
          <>
            {/* ── Header ── */}
            <SheetHeader className="gap-3 border-b p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <SheetTitle className="text-lg leading-tight">
                    {job.title ? job.title : job.role}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {job.company} {job.title && job.role ? `· ${job.role}` : ""}
                  </SheetDescription>
                </div>
              </div>

              {/* Selector de estado y Badges de etapa / estado previo */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Select
                  value={job.status}
                  onValueChange={handleStatusChange}
                  disabled={statusLoading}
                >
                  <SelectTrigger
                    id="job-status-select"
                    className="w-fit gap-2 border-0 bg-transparent px-0 shadow-none focus:ring-0 focus-visible:ring-0 font-medium"
                    aria-label="Cambiar estado"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_META) as JobStatusDto[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {job.stage && (
                  <span className="inline-flex items-center rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-foreground border border-accent/30">
                    Etapa: {STAGE_META[job.stage as JobStageDto]?.label ?? job.stage}
                  </span>
                )}

                {job.lastStatus && job.lastStatus !== job.status && (
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                    Previo: {STATUS_META[job.lastStatus as JobStatusDto]?.label ?? job.lastStatus}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* ── Body ── */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="flex flex-col gap-6 p-6">
                {/* Facts grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Fact icon={MapPin} label="Ubicación" value={job.location || "—"} />
                  <Fact icon={Building2} label="Modalidad" value={job.workMode || "—"} />
                  <Fact icon={Wallet} label="Salario" value={job.salary || "—"} />
                  <Fact icon={CalendarDays} label="Fuente" value={job.wheresApplied || "—"} />
                  <Fact
                    icon={CalendarDays}
                    label="Postulado"
                    value={formatDate(job.appliedAt || job.createdAt)}
                  />
                  <Fact
                    icon={CalendarDays}
                    label="Actualizado"
                    value={formatDate(job.updatedAt)}
                  />
                </div>

                {/* Descripción de la vacante */}
                {job.description && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                        Descripción de la oferta
                      </span>
                      <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {job.description}
                      </div>
                    </div>
                  </>
                )}

                {/* Stage progress (sólo en entrevista) */}
                {job.status === JobStatusDto.INTERVIEW && (
                  <>
                    <Separator />
                    <StageProgress job={job} />
                  </>
                )}

                <Separator />

                {/* Contacto */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Contacto
                  </span>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{job.contact || "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {job.contactEmail || "—"}
                      </span>
                    </div>
                    {job.contactEmail && job.contactEmail !== "—" && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Enviar correo"
                        nativeButton={false}
                        render={<a href={`mailto:${job.contactEmail}`} />}
                      >
                        <Mail />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Notas */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Notas
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {job.notes || "Sin notas adicionales."}
                  </p>
                </div>

                <Separator />

                {/* ── Historial / Timeline ── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                      Historial
                    </span>
                    {onAddTimeline && (
                      <Button
                        id="add-timeline-entry-btn"
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() => setShowTimelineForm((v) => !v)}
                        disabled={timelineLoading}
                      >
                        <Plus className="size-3.5" />
                        Entrada
                      </Button>
                    )}
                  </div>

                  {/* Formulario de nueva entrada */}
                  {showTimelineForm && (
                    <AddTimelineForm
                      onSave={handleSaveTimeline}
                      onCancel={() => setShowTimelineForm(false)}
                      loading={timelineLoading}
                    />
                  )}

                  {/* Lista del historial */}
                  <TimelineList entries={job.timeline ?? []} />
                </div>
              </div>
            </ScrollArea>

            {/* ── Footer ── */}
            <SheetFooter className="flex-row gap-2 border-t p-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(job)}
              >
                <Pencil data-icon="inline-start" />
                Editar
              </Button>
              {job.link && (
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href={job.link} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink data-icon="inline-start" />
                  Oferta
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Eliminar"
                onClick={() => onDelete?.(job)}
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
