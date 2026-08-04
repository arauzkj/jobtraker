"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Briefcase,
  CalendarClock,
  CircleSlash,
  FlaskConical,
  Send,
  BadgeCheck,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DistributionBar } from "./distribution-bar";
import { StatCards } from "./stat-cards";
import { FilterBar } from "./filter-bar";
import { JobTable } from "./job-table";
import { JobDetailSheet } from "./job-detail-sheet";
import { JobDto } from "@/dto/job.dto";
import { STATUS_META } from "@/dto/status.const";
import { NewJobSheet } from "./new_job";
import { authClient } from "@/lib/auth-client";
import { JobStatusDto } from "@/dto/jobstatus.dto.enum";
import { Timeline_EntryDto } from "@/dto/timeline_entry.dto";
import { toast } from "../ui/toast";

export const STAT_CARDS = [
  { key: "all" as const, label: "Total", icon: Briefcase },
  { key: JobStatusDto.APPLIED, label: "Postulados", icon: Send },
  { key: JobStatusDto.PENDENTING, label: "Pendientes", icon: CalendarClock },
  { key: JobStatusDto.INTERVIEW, label: "En entrevista", icon: Users },
  { key: JobStatusDto.TECHNICAL_TEST, label: "Prueba técnica", icon: FlaskConical },
  { key: JobStatusDto.UNANSWERED, label: "Sin respuesta", icon: CircleSlash },
  { key: JobStatusDto.OFFER, label: "Ofertas", icon: Trophy },
  { key: JobStatusDto.ACCEPTED, label: "Aceptados", icon: BadgeCheck },
  { key: JobStatusDto.REJECTED, label: "Rechazados", icon: XCircle },
  { key: JobStatusDto.WITHDRAWN, label: "Retirados", icon: CircleSlash },
] as const;

export const FILTERS = [
  { value: "all" as const, label: "Todos" },
  { value: JobStatusDto.APPLIED, label: "Postulado" },
  { value: JobStatusDto.PENDENTING, label: "Pendiente" },
  { value: JobStatusDto.INTERVIEW, label: "En entrevista" },
  { value: JobStatusDto.TECHNICAL_TEST, label: "Prueba técnica" },
  { value: JobStatusDto.UNANSWERED, label: "Sin respuesta" },
  { value: JobStatusDto.OFFER, label: "Oferta" },
  { value: JobStatusDto.ACCEPTED, label: "Aceptado" },
  { value: JobStatusDto.REJECTED, label: "Rechazado" },
  { value: JobStatusDto.WITHDRAWN, label: "Retirado" },
] as const;

export type FilterValue = (typeof FILTERS)[number]["value"];

export function Dashboard({ userInitials }: DashboardProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<JobDto | null>(null);
  const [open, setOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JobDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/jobs", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: no se pudieron cargar las postulaciones`,
          );
        }
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobsDto: JobDto[] = data.data.map((j: any) => new JobDto(j));
        setJobs(jobsDto);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
    return () => controller.abort(); // Cancelar la solicitud si el componente se desmonta
  }, []);

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter as FilterValue);
  };

  // Computed values (memoizados)
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: jobs.length };
    for (const s of Object.keys(STATUS_META)) {
      c[s] = jobs.filter((j) => j.status === s).length;
    }
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchStatus = filter === "all" || j.status === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [jobs, filter, query]);

  // Handlers
  const handleSelectJob = (job: JobDto) => {
    setSelected(job);
    setOpen(true);
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(job: JobDto) {
    setOpen(false);
    setEditing(job);
    setTimeout(() => setFormOpen(true), 250);
  }

  async function handleUpdate(dataForm: FormData): Promise<boolean> {
    if (!editing || !editing.id) return false;
    const formEntries = Object.fromEntries(dataForm.entries());
    const jobData = new JobDto({
      ...editing,
      ...formEntries,
    });

    try {
      const response = await fetch(`/api/jobs/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData.toJSON()),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: no se pudo actualizar la postulación`,
        );
      }

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated = new JobDto(data.data as any);

      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      setSelected((prev) => (prev && prev.id === updated.id ? updated : prev));

      toast.add({
        title: "Postulación actualizada",
        description: `${updated.role} en ${updated.company}`,
        type: "success",
      });

      return true;
    } catch (error) {
      toast.add({
        title: "No se pudo actualizar la postulación",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
        type: "error",
      });
      return false;
    }
  }

  async function handleDelete(job: JobDto) {
    await fetch(`/api/jobs/${job.id}`, {
      method: "DELETE",
    });
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    setOpen(false);
  }

  async function handleStatusChange(job: JobDto, status: JobStatusDto) {
    const response = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return;
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = new JobDto(data.data as any);
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setSelected(updated);
  }

  async function handleAddTimeline(
    jobId: bigint,
    entry: { label: string; notes: string; stage?: string },
  ) {
    const response = await fetch("/api/timeline_entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: jobId.toString(), ...entry }),
    });
    if (!response.ok) return;
    const data = await response.json();
    // Append the new entry to the selected job's timeline (keep stage for display)
    const newEntry = Object.assign(new Timeline_EntryDto(data.data), {
      stage: entry.stage,
    });
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return new JobDto({
          ...j,
          timeline: [...(j.timeline ?? []), newEntry],
        });
      }),
    );
    setSelected((prev) => {
      if (!prev || prev.id !== jobId) return prev;
      return new JobDto({
        ...prev,
        timeline: [...(prev.timeline ?? []), newEntry],
      });
    });
  }

  async function handleCreate(dataForm: FormData): Promise<boolean> {
    const newJob = new JobDto(
      Object.fromEntries(dataForm.entries()) as Partial<JobDto>,
    );

    try {
      const response = await fetch("/api/jobs", {
        body: JSON.stringify(newJob.toJSON()),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: no se pudo crear la postulación`,
        );
      }

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created = new JobDto(data.data as any);

      setJobs((prev) => [created, ...prev]);

      toast.add({
        title: "Postulación creada",
        description: `${created.role} en ${created.company}`,
        type: "success",
      });

      return true;
    } catch (error) {
      toast.add({
        title: "No se pudo crear la postulación",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
        type: "error",
      });
      return false;
    }
  }

  return (
    <div className="min-h-svh">
      <DashboardHeader
        userInitials={userInitials}
        onOpenChange={openNew}
        onLogout={handleLogout}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
            Tablero
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Seguimiento de postulaciones
          </h1>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <StatCards
          counts={counts}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />

        {/* Distribution Bar */}
        <DistributionBar counts={counts} total={jobs.length} />

        {/* Filters */}
        <FilterBar
          filter={filter}
          query={query}
          onFilterChange={handleFilterChange}
          onQueryChange={setQuery}
        />

        {/* Table */}
        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-10">
            Cargando postulaciones...
          </p>
        ) : (
          <JobTable jobs={filtered} onSelectJob={handleSelectJob} />
        )}

        <p className="text-center text-xs text-muted-foreground">
          Mostrando {filtered.length} de {jobs.length} postulaciones · Haz clic
          en una fila para ver el detalle
        </p>
      </main>

      <JobDetailSheet
        job={selected}
        open={open}
        onOpenChange={setOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAddTimeline={handleAddTimeline}
      />
      <NewJobSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        job={editing}
      />
    </div>
  );
}
