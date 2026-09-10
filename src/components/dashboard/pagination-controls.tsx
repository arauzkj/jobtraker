"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  maxVisible = 5,
): (number | "...")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Si estamos cerca del inicio
  if (currentPage <= 3) {
    const items: (number | "...")[] = [];
    const count = Math.min(maxVisible - 1, totalPages - 1);
    for (let i = 1; i <= count; i++) {
      items.push(i);
    }
    items.push("...");
    items.push(totalPages);
    return items;
  }

  // Si estamos cerca del final
  if (currentPage >= totalPages - 2) {
    const items: (number | "...")[] = [1, "..."];
    const start = totalPages - (maxVisible - 2);
    for (let i = start; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }

  // En el medio: 1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function PaginationControls({
  page,
  totalPages,
  total,
  loading = false,
  maxVisible = 5,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages, maxVisible);

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || loading}
        className="h-8 gap-1 px-2.5 text-xs"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <div className="flex items-center gap-1">
        {items.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-6 items-center justify-center text-xs text-muted-foreground select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = item === page;
          return (
            <Button
              key={item}
              type="button"
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(item)}
              disabled={loading}
              aria-current={isCurrent ? "page" : undefined}
              className={`h-8 min-w-8 px-2 text-xs font-mono transition-colors ${
                isCurrent
                  ? "pointer-events-none font-semibold shadow-xs"
                  : "hover:bg-muted"
              }`}
            >
              {item}
            </Button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || loading}
        className="h-8 gap-1 px-2.5 text-xs"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
