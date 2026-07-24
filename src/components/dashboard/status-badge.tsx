import { cn } from "@/lib/utils"
import { STATUS_META } from "./distribution-bar"
import { JobStatusDto } from "@/dto/jobstatus.dto.enum"

export function StatusBadge({
  status,
  className,
}: {
  status: JobStatusDto
  className?: string
}) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}