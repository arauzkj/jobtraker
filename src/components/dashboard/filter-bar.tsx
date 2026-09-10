"use client";

import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar, Search, X } from "lucide-react";
import { FILTERS } from "./dashboard";
import { Button } from "../ui/button";

export const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "all", label: "Todas las fechas" },
  { value: "today", label: "Hoy" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "month", label: "Este mes" },
  { value: "custom", label: "Personalizado" },
];

function getDateRangeForPreset(preset: DatePreset): {
  startDate?: string;
  endDate?: string;
} {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatYMD = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const todayStr = formatYMD(now);

  switch (preset) {
    case "today":
      return { startDate: todayStr, endDate: todayStr };
    case "7d": {
      const past = new Date(now);
      past.setDate(past.getDate() - 7);
      return { startDate: formatYMD(past), endDate: todayStr };
    }
    case "30d": {
      const past = new Date(now);
      past.setDate(past.getDate() - 30);
      return { startDate: formatYMD(past), endDate: todayStr };
    }
    case "month": {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: formatYMD(firstDay), endDate: todayStr };
    }
    case "all":
    default:
      return { startDate: undefined, endDate: undefined };
  }
}

export function FilterBar({
  filter,
  query,
  dateFilter,
  onFilterChange,
  onQueryChange,
  onDateFilterChange,
}: FilterBarProps) {
  const handlePresetChange = (value: string | null) => {
    const preset = (value ?? "all") as DatePreset;
    if (preset === "custom") {
      onDateFilterChange({
        preset: "custom",
        startDate: dateFilter.startDate ?? "",
        endDate: dateFilter.endDate ?? "",
      });
    } else {
      const range = getDateRangeForPreset(preset);
      onDateFilterChange({
        preset,
        startDate: range.startDate,
        endDate: range.endDate,
      });
    }
  };

  const handleClearDate = () => {
    onDateFilterChange({
      preset: "all",
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Primera fila: Filtros de estado y Controles de Búsqueda / Fecha */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Pills de estado */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFilterChange(f.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Controles de Búsqueda y Fecha */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Fecha */}
          <div className="flex items-center gap-1.5">
            <Select
              value={dateFilter.preset}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger
                size="default"
                className="h-9 min-w-40 bg-card text-xs"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por fecha" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {dateFilter.preset !== "all" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearDate}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Quitar filtro de fecha"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          {/* Búsqueda */}
          <div className="w-full sm:w-64 lg:w-72">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Buscar empresa o puesto…"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Rango de fechas personalizado cuando está seleccionado */}
      {dateFilter.preset === "custom" && (
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-xs">
          <span className="font-medium text-muted-foreground">
            Rango personalizado:
          </span>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="date-from"
              className="text-muted-foreground"
            >
              Desde:
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFilter.startDate ?? ""}
              onChange={(e) =>
                onDateFilterChange({
                  ...dateFilter,
                  startDate: e.target.value,
                })
              }
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="date-to"
              className="text-muted-foreground"
            >
              Hasta:
            </label>
            <input
              id="date-to"
              type="date"
              value={dateFilter.endDate ?? ""}
              onChange={(e) =>
                onDateFilterChange({
                  ...dateFilter,
                  endDate: e.target.value,
                })
              }
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}
    </div>
  );
}