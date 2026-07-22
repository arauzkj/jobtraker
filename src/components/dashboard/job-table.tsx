import { CircleSlash } from "lucide-react";
import { Card } from "../ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { JobTableProps } from "@/types/components";
import { JobRow } from "./job-row";

export function JobTable({ jobs, onSelectJob }: JobTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Empresa / Puesto</TableHead>
            <TableHead className="hidden md:table-cell">Ubicación</TableHead>
            <TableHead className="hidden lg:table-cell">Modalidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden md:table-cell">Etapa</TableHead>
            <TableHead className="hidden pr-4 text-right sm:table-cell">
              Actualizado
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} onClick={() => onSelectJob(job)} />
          ))}
        </TableBody>
      </Table>

      {jobs.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <CircleSlash className="size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Sin resultados</p>
          <p className="text-sm text-muted-foreground">
            Prueba con otro filtro o término de búsqueda.
          </p>
        </div>
      )}
    </Card>
  )
}