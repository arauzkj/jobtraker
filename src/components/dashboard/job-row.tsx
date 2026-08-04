import { JobStageDto } from "@/dto/jobstage.dto.enum";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { TableCell, TableRow } from "../ui/table";
import { StatusBadge } from "./status-badge";
import { STAGE_META } from "@/dto/stage_meta.const";



export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatDate(val?: string | Date | null): string {
  if (!val || val === "—") return "—";
  const d = typeof val === "string" ? new Date(val) : val;
  if (isNaN(d.getTime())) return "—";
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
        {job.location || "—"}
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <span className="text-muted-foreground">{job.workMode || "—"}</span>
      </TableCell>

      <TableCell>
        <StatusBadge status={job.status} />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {job.stage ? (
          <span className="text-sm text-muted-foreground">
            {STAGE_META[job.stage as JobStageDto]?.label ?? job.stage}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground/50">—</span>
        )}
      </TableCell>

      <TableCell className="hidden pr-4 text-right font-mono text-xs text-muted-foreground sm:table-cell">
        {formatDate(job.updatedAt)}
      </TableCell>
    </TableRow>
  );
}
