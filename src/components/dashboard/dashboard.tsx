"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useState } from "react";

export function Dashboard() {

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <>
      <DashboardHeader userInitials="KJ" onNewJob={() => {}} onLogout={() => {}} />
    </>
  );
}
