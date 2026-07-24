import { JobStageDto } from "@/dto/jobstage.dto.enum";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { TableCell, TableRow } from "../ui/table";
import { StatusBadge } from "./status-badge";

export const STAGE_META: Record<JobStageDto, { label: string; step: number }> =
  {
    APPLIED: { label: "Aplicado", step: 0 },
    PHONE_SCREEN: { label: "Screening RRHH", step: 1 },
    TECHNICAL_INTERVIEW: { label: "Entrevista técnica", step: 2 },
    TEAM_INTERVIEW: { label: "Entrevista con el equipo", step: 3 },
    FINAL_INTERVIEW: { label: "Entrevista final / Manager", step: 4 },
    OFFER: { label: "Oferta", step: 5 },
    REJECTED: { label: "Rechazado", step: 6 },
    WITHDRAWN: { label: "Retirado", step: 7 },
  };

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatDate(iso: string): string {
  if (!iso || iso === "—") return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function JobRow({ job, onClick }: JobRowProps) {
  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell className="pl-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 rounded-lg">
            <AvatarFallback className="rounded-lg bg-secondary text-xs font-semibold">
              {getInitials(job.company)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{job.role}</span>
            <span className="text-xs text-muted-foreground">{job.company}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden text-muted-foreground md:table-cell">
        {job.location}
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <span className="text-muted-foreground">{job.workMode}</span>
      </TableCell>

      <TableCell>
        <StatusBadge status={job.status} />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {job.stage ? (
          <span className="text-sm text-muted-foreground">
            {STAGE_META[job.stage as JobStageDto].label}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground/50">—</span>
        )}
      </TableCell>

      <TableCell className="hidden pr-4 text-right font-mono text-xs text-muted-foreground sm:table-cell">
        {formatDate(job.lastUpdate)}
      </TableCell>
    </TableRow>
  );
}
