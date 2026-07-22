interface LoginProps {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: FormData) => void;
}

type SceneBackgroundProps = {
  /** 0 = calm/dashboard, 1 = more visible/login */
  intensity?: number;
  className?: string;
};

interface DashboardHeaderProps {
  userInitials: string
  onNewJob: () => void
  onLogout: () => void
}

interface StatCardsProps {
  counts: Record<string, number>
  activeFilter: string
  onFilterChange: (filter: string) => void
}


interface DistributionBarProps {
  counts: Record<string, number>
  total: number
}

export type JobStatus =
  | "pending"
  | "no_response"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn"

export type InterviewStage =
  | "screening"
  | "technical"
  | "team"
  | "final"

export type TimelineEntry = {
  date: string
  label: string
  note?: string
}

export type Job = {
  id: string
  company: string
  role: string
  location: string
  workMode: "Remoto" | "Híbrido" | "Presencial"
  salary: string
  source: string
  appliedDate: string
  lastUpdate: string
  status: JobStatus
  stage?: InterviewStage
  contact: string
  contactEmail: string
  url: string
  notes: string
  timeline: TimelineEntry[]
}

interface FilterBarProps {
  filter: FilterValue
  query: string
  onFilterChange: (filter: FilterValue) => void
  onQueryChange: (query: string) => void
}


interface JobTableProps {
  jobs: Job[]
  onSelectJob: (job: Job) => void
}

interface JobRowProps {
  job: Job
  onClick: () => void
}



