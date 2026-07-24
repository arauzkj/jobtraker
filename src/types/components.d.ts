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



