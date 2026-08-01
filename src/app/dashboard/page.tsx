import { SceneBackground } from "@/components/background";
import { Dashboard } from "@/components/dashboard/dashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  function getInitials(name?: string | null) {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const displayName =
    session.user.displayUsername ?? session.user.name ?? session.user.username;

  const initials = getInitials(displayName);

  return (
    <div className="relative">
      <SceneBackground
        intensity={0.3}
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
      />
      <Dashboard userInitials={initials}/>
    </div>
  );
}
