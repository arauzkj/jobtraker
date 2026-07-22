import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DistributionBarProps, JobStatus } from "@/types/components"


export const STATUS_META: Record<
  JobStatus,
  { label: string; description: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pendiente",
    description: "Postulación enviada, esperando respuesta",
    badge: "bg-info/10 text-info-foreground border-info/20",
    dot: "bg-info",
  },
  no_response: {
    label: "Sin respuesta",
    description: "Sin novedades tras varios días (fantasma)",
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  interview: {
    label: "En entrevista",
    description: "En algún proceso de entrevista",
    badge: "bg-warning/15 text-warning-foreground border-warning/25",
    dot: "bg-warning",
  },
  offer: {
    label: "Oferta",
    description: "Recibiste una oferta",
    badge: "bg-success/15 text-success-foreground border-success/25",
    dot: "bg-success",
  },
  rejected: {
    label: "Rechazado",
    description: "Respondieron para avisar que no continúan",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  withdrawn: {
    label: "Retirado",
    description: "Retiraste tu postulación",
    badge: "bg-secondary text-secondary-foreground border-border",
    dot: "bg-muted-foreground",
  },
}

export function DistributionBar({ counts, total }: DistributionBarProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
        Distribución por estado
      </span>

      {/* Barra */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {(Object.keys(STATUS_META) as JobStatus[]).map((s) => {
          const pct = ((counts[s] ?? 0) / total) * 100
          if (!pct) return null
          return (
            <span
              key={s}
              className={cn("h-full", STATUS_META[s].dot)}
              style={{ width: `${pct}%` }}
              title={`${STATUS_META[s].label}: ${counts[s]}`}
            />
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {(Object.keys(STATUS_META) as JobStatus[]).map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className={cn("size-2 rounded-full", STATUS_META[s].dot)} />
            {STATUS_META[s].label}
            <span className="font-medium text-foreground">{counts[s] ?? 0}</span>
          </span>
        ))}
      </div>
    </Card>
  )
}