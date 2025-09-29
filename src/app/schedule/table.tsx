"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type {Filters, TrainRow} from "@/lib/types";
import FiltersBar from "./filters";
import Button from "@/components/ui/button";

export default function ScheduleTable({
                                        data,
                                        columns,
                                        isLoading = false,
                                        canEdit = false,
                                        filters,
                                        onFiltersChange,
                                        onAdd,
                                      }: {
  data: TrainRow[];
  columns: ColumnDef<TrainRow, any>[];
  isLoading?: boolean;
  canEdit?: boolean;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  onAdd: () => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-transparent">
      <div className="p-3">
        <FiltersBar value={filters} onChange={onFiltersChange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed font-board text-uzg-400">
          <thead className="text-uzg-500">
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="[&>th]:px-3 [&>th]:py-3 [&>th]:text-left [&>th]:text-sm [&>th]:uppercase [&>th]:tracking-widest"
            >
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="select-none cursor-pointer hover:text-uzg-500/90"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {({ asc: " ▲", desc: " ▼" })[h.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
          </thead>

          <tbody className="divide-y divide-board-line">
          {/* Loading skeleton rows */}
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <tr key={`sk-${i}`} className="animate-pulse">
              {columns.map((col, j) => (
                <td key={j} className="px-3 py-3">
                  <div className="h-4 w-full rounded bg-board-soft/70" />
                </td>
              ))}
            </tr>
          ))}

          {/* Actual rows */}
          {!isLoading && table.getRowModel().rows.map(r => (
            <tr key={r.id} className="odd:bg-board-bg/40 hover:bg-board-soft">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-3 py-3 align-middle tabular-nums">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {/* Empty states (only when not loading) */}
          {!isLoading && table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="text-center text-uzg-300">
                    {data.length === 0 ? "No trains yet." : "No results with current filters."}
                  </div>
                </div>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Bottom action bar: show only for authenticated */}
      {canEdit && (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="primary"
            callback={onAdd}
            text="Add new train route"
          />
        </div>
      )}
    </div>
  );
}