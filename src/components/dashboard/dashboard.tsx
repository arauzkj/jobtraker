"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Job } from "@/types/components";
import {
  Briefcase,
  CalendarClock,
  CircleSlash,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DistributionBar, STATUS_META } from "./distribution-bar";
import { StatCards } from "./stat-cards";
import { FilterBar } from "./filter-bar";
import { JobTable } from "./job-table";
import { JobDetailSheet } from "./job-detail-sheet";

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

export const JOBS: Job[] = [
  {
    id: "job-1",
    company: "Nebula Labs",
    role: "Frontend Engineer",
    location: "Ciudad de México",
    workMode: "Remoto",
    salary: "$4,500 - $5,500 USD",
    source: "LinkedIn",
    appliedDate: "2026-06-28",
    lastUpdate: "2026-07-14",
    status: "interview",
    stage: "technical",
    contact: "Laura Méndez",
    contactEmail: "laura@nebulalabs.io",
    url: "https://example.com/nebula",
    notes:
      "El challenge técnico fue sobre optimización de renders en React. Quedaron en avisar para la entrevista con el equipo.",
    timeline: [
      { date: "2026-06-28", label: "Postulación enviada" },
      {
        date: "2026-07-02",
        label: "Screening con RRHH",
        note: "Llamada de 30 min con Laura",
      },
      {
        date: "2026-07-14",
        label: "Entrevista técnica",
        note: "Live coding + preguntas de arquitectura",
      },
    ],
  },
  {
    id: "job-2",
    company: "Corvus Fintech",
    role: "Senior React Developer",
    location: "Remoto (LATAM)",
    workMode: "Remoto",
    salary: "$5,000 - $6,500 USD",
    source: "Referido",
    appliedDate: "2026-07-01",
    lastUpdate: "2026-07-16",
    status: "offer",
    contact: "Diego Ramírez",
    contactEmail: "diego@corvus.com",
    url: "https://example.com/corvus",
    notes:
      "Recibí la oferta formal por correo. Tengo hasta el 25 de julio para responder.",
    timeline: [
      { date: "2026-07-01", label: "Postulación enviada" },
      { date: "2026-07-05", label: "Screening con RRHH" },
      { date: "2026-07-10", label: "Entrevista técnica" },
      { date: "2026-07-15", label: "Entrevista final" },
      {
        date: "2026-07-16",
        label: "Oferta recibida",
        note: "$6,000 USD + equity",
      },
    ],
  },
];

export function Dashboard() {
  const router = useRouter();

  // Estado centralizado aquí
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter as FilterValue);
  };

  // Computed values (memoizados)
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: JOBS.length };
    for (const s of Object.keys(STATUS_META)) {
      c[s] = JOBS.filter((j) => j.status === s).length;
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      const matchStatus = filter === "all" || j.status === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [filter, query]);

  // Handlers
  const handleSelectJob = (job: Job) => {
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

        {/* Stat Cards */}
        <StatCards
          counts={counts}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />

        {/* Distribution Bar */}
        <DistributionBar counts={counts} total={JOBS.length} />

        {/* Filters */}
        <FilterBar
          filter={filter}
          query={query}
          onFilterChange={handleFilterChange}
          onQueryChange={setQuery}
        />

        {/* Table */}
        <JobTable jobs={filtered} onSelectJob={handleSelectJob} />

        <p className="text-center text-xs text-muted-foreground">
          Mostrando {filtered.length} de {JOBS.length} postulaciones · Haz clic
          en una fila para ver el detalle
        </p>
      </main>

      <JobDetailSheet job={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
