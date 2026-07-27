import { Card } from "@/components/ui/card";
import { JobStatusDto } from "@/dto/jobstatus.dto.enum";
import { STATUS_META } from "@/dto/status.const";
import { cn } from "@/lib/utils";

export function DistributionBar({ counts, total }: DistributionBarProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
        Distribución por estado
      </span>

      {/* Barra */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {(Object.keys(STATUS_META) as JobStatusDto[]).map((s) => {
          const pct = ((counts[s] ?? 0) / total) * 100;
          if (!pct) return null;
          return (
            <span
              key={s}
              className={cn("h-full", STATUS_META[s].dot)}
              style={{ width: `${pct}%` }}
              title={`${STATUS_META[s].label}: ${counts[s]}`}
            />
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {(Object.keys(STATUS_META) as JobStatusDto[]).map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className={cn("size-2 rounded-full", STATUS_META[s].dot)} />
            {STATUS_META[s].label}
            <span className="font-medium text-foreground">
              {counts[s] ?? 0}
            </span>
          </span>
        ))}
      </div>
    </Card>
  );
}
