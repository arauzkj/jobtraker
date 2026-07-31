type SceneBackgroundProps = {
  /** 0 = calm/dashboard, 1 = more visible/login */
  intensity?: number;
  className?: string;
};

interface DashboardHeaderProps {
  userInitials: string;
  onOpenChange: (open: boolean) => void
  onLogout: () => void;
}

interface StatCardsProps {
  counts: Record<string, number>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

interface DistributionBarProps {
  counts: Record<string, number>;
  total: number;
}

interface FilterBarProps {
  filter: FilterValue;
  query: string;
  onFilterChange: (filter: FilterValue) => void;
  onQueryChange: (query: string) => void;
}

interface JobTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

interface JobRowProps {
  job: Job;
  onClick: () => void;
}

interface AuthBrandPanelProps {
  icon: LucideIcon;
  brandName: string;
  title: string;
  description: string;
  features: string[];
}

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

interface PasswordFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  name?: string;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}


interface RegisterProps{
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  available: boolean | null;
  loading: boolean;
  onSubmit: (data: FormData) => void;
  submitting: boolean;
  shake: boolean;
}

interface NewJobProps{
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (job: JobDto) => void
  onUpdate?: (job: JobDto) => void
  job?: JobDto | null
}

interface JobDetailSheetProps{
  job: JobDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (job: JobDto) => void
  onDelete?: (job: JobDto) => void
  onStatusChange?: (job: JobDto, status: JobStatusDto) => Promise<void>
  onAddTimeline?: (jobId: bigint, entry: { label: string; notes: string; stage?: string }) => Promise<void>
}