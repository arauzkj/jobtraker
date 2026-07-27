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

export const STAT_CARDS = [
  { key: "all" as const, label: "Total", icon: Briefcase },
  { key: "pending" as const, label: "Pendientes", icon: CalendarClock },
  { key: "interview" as const, label: "En entrevista", icon: Users },
  { key: "no_response" as const, label: "Sin respuesta", icon: CircleSlash },
  { key: "offer" as const, label: "Ofertas", icon: Trophy },
  { key: "rejected" as const, label: "Rechazados", icon: XCircle },
] as const;

export const FILTERS = [
  { value: "all" as const, label: "Todos" },
  { value: "pending" as const, label: "Pendiente" },
  { value: "interview" as const, label: "En entrevista" },
  { value: "no_response" as const, label: "Sin respuesta" },
  { value: "offer" as const, label: "Oferta" },
  { value: "rejected" as const, label: "Rechazado" },
  { value: "withdrawn" as const, label: "Retirado" },
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
      const matchStatus = filter === "all" || j.status.toString() === filter;
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

  const handleNewJob = () => {
    // router.push("/jobs/new") o abrir un modal
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-svh">
      <DashboardHeader
        userInitials="JC"
        onNewJob={handleNewJob}
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

      <JobDetailSheet job={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
