"use client";

import { cn } from "@/lib/utils";
import { STAT_CARDS } from "./dashboard";
import { StatCardsProps } from "@/types/components";

export function StatCards({
  counts,
  activeFilter,
  onFilterChange,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {STAT_CARDS.map((stat) => {
        const value = stat.key === "all" ? counts.all : (counts[stat.key] ?? 0);
        const active = activeFilter === stat.key;
        const Icon = stat.icon;

        return (
          <button
            key={stat.key}
            type="button"
            onClick={() => onFilterChange(stat.key)}
            className={cn(
              "group flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
              active
                ? "border-accent ring-1 ring-accent/40"
                : "border-border hover:border-accent/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                {stat.label}
              </span>
              <Icon
                className={cn(
                  "size-4",
                  active ? "text-accent-foreground" : "text-muted-foreground",
                )}
              />
            </div>
            <span className="text-3xl font-semibold tabular-nums">{value}</span>
          </button>
        );
      })}
    </div>
  );
}
