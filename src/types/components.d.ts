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
