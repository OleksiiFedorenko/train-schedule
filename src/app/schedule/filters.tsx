"use client";

import {Filters} from "@/lib/types";

export default function FiltersBar({ value, onChange }: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  const onCity = (v: string) => onChange({ city: v, number: "" });
  const onNumber = (v: string) => onChange({ city: "", number: v });

  const baseInput =
    "rounded-lg border px-3 py-2 text-sm bg-board-soft border-board-line text-uzg-400 placeholder:text-uzg-300/60 focus:ring-0 focus:border-uzg-500";

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <input
        className={baseInput}
        placeholder="Train number"
        value={value.number ?? ""}
        onChange={(e) => onNumber(e.target.value)}
      />
      <input
        className={baseInput}
        placeholder="City (from/to)"
        value={value.city ?? ""}
        onChange={(e) => onCity(e.target.value)}
      />
    </div>
  );
}