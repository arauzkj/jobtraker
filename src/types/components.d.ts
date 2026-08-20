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
  jobs: import("@/lib/validation/job.schema").Job[];
  onSelectJob: (job: import("@/lib/validation/job.schema").Job) => void;
}

interface JobRowProps {
  job: import("@/lib/validation/job.schema").Job;
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
  onCreate?: (data: FormData) => Promise<boolean>;
  onUpdate?: (data: FormData) => Promise<boolean>;
  job?: import("@/lib/validation/job.schema").Job | null
}

interface JobDetailSheetProps{
  job: import("@/lib/validation/job.schema").Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (job: import("@/lib/validation/job.schema").Job) => void
  onDelete?: (job: import("@/lib/validation/job.schema").Job) => void
  onStatusChange?: (
    job: import("@/lib/validation/job.schema").Job,
    status: import("@/lib/validation/job.schema").JobStatus,
  ) => Promise<void>
  onAddTimeline?: (
    jobId: string,
    entry: {
      label: string;
      notes: string;
      stage?: import("@/lib/validation/job.schema").JobStage;
    },
  ) => Promise<void>
}

interface DashboardProps {
  userInitials: string;
}

type LegalSection = {
  title: string;
  body: string;
};

type LegalDocumentLayoutProps = {
  title: string;
  lastUpdated: string;
  jurisdiction: string;
  sections: readonly LegalSection[];
};
