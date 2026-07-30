import { SceneBackground } from "@/components/background";
import { Dashboard } from "@/components/dashboard/dashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/");
  }

  return (
    <div className="relative">
      <SceneBackground
        intensity={0.3}
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
      />
      <Dashboard />
    </div>
  );
}
