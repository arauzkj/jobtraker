import { BriefcaseBusiness, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardHeaderProps } from "@/types/components";

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
            Job traker
          </span>
        </div>
        {/* Botones*/}
        <div className="flex items-center gap-2">
          <Button
            className="hidden font-mono text-xs tracking-wide uppercase sm:inline-flex"
            onClick={onNewJob}
          >
            <Plus data-icon="inline-start" />
            Nueva postulacion
          </Button>
          <Button
            size="icon"
            className="sm:hidden"
            aria-label="Nueva postulación"
            onClick={onNewJob}
          >
            <Plus />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />

          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cerrar sesión"
            onClick={onLogout}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
