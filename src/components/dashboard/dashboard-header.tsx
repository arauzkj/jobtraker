import { BriefcaseBusiness } from "lucide-react";

export function DashboardHeader({
  userInitials,
  onNewJob,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseBusiness className="size-4.5" />
          </span>
          <span className="font-mono text-sm font-medium tracking-widest uppercase">
            Trayecto
          </span>
        </div>
      </div>
        
    </header>
  );
}
