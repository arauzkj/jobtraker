import { cn } from "@/lib/utils";
import { FilterBarProps } from "@/types/components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Search } from "lucide-react";
import { FILTERS } from "./dashboard";

export function FilterBar({
  filter,
  query,
  onFilterChange,
  onQueryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

      <div className="lg:w-72">
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
  )
}