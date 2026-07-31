"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Briefcase,
  CalendarClock,
  CircleSlash,
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

export const STAT_CARDS = [
  { key: "all" as const, label: "Total", icon: Briefcase },
  { key: JobStatusDto.PENDENTING, label: "Pendientes", icon: CalendarClock },
  { key: JobStatusDto.INTERVIEW, label: "En entrevista", icon: Users },
  { key: JobStatusDto.UNANSWERED, label: "Sin respuesta", icon: CircleSlash },
  { key: JobStatusDto.OFFER, label: "Ofertas", icon: Trophy },
  { key: JobStatusDto.REJECTED, label: "Rechazados", icon: XCircle },
] as const;

export const FILTERS = [
  { value: "all" as const, label: "Todos" },
  { value: JobStatusDto.PENDENTING, label: "Pendiente" },
  { value: JobStatusDto.INTERVIEW, label: "En entrevista" },
  { value: JobStatusDto.UNANSWERED, label: "Sin respuesta" },
  { value: JobStatusDto.OFFER, label: "Oferta" },
  { value: JobStatusDto.REJECTED, label: "Rechazado" },
  { value: JobStatusDto.WITHDRAWN, label: "Retirado" },
] as const;

export type FilterValue = (typeof FILTERS)[number]["value"];

export function Dashboard() {
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

  async function handleUpdate(updated: JobDto) {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setSelected((prev) => (prev && prev.id === updated.id ? updated : prev));
  }

  function handleDelete(job: JobDto) {
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    setOpen(false);
  }

  async function handleCreate(dataForm: FormData) {
    const newJob = new JobDto(
      Object.fromEntries(dataForm.entries()) as Partial<JobDto>,
    );

    const response = await fetch("/api/jobs",{
      body: JSON.stringify(newJob.toJSON()),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return (
    <div className="min-h-svh">
      <DashboardHeader
        userInitials="JC"
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
