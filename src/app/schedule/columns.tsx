"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { TrainRow } from "@/lib/types";
import { useState } from "react";
import Button from "@/components/ui/button";

const h = createColumnHelper<TrainRow>();

export const columns = (
  canEdit: boolean,
  onEdit: (row: TrainRow) => void,
  onDelete: (row: TrainRow) => void,
  onCellCommit: (id: string, patch: Partial<TrainRow>) => void
): ColumnDef<TrainRow, any>[] => {
  const cols: ColumnDef<TrainRow, any>[] = [
    h.accessor("number", {
      id: "number",
      header: () => "Number",
      cell: (ctx) => (
        <EditableCell
          value={ctx.getValue()}
          canEdit={canEdit}
          onCommit={(v) => onCellCommit(ctx.row.original.id, { number: v })}
          className="tabular-nums"
        />
      ),
      sortingFn: "alphanumeric",
    }),
    h.accessor((row) => `${row.from} → ${row.to}`, {
      id: "route",
      header: () => "Route",
      cell: (ctx) => <span className="whitespace-normal break-words">{ctx.getValue()}</span>,
      sortingFn: (a, b) =>
        String(a.original.from).localeCompare(String(b.original.from), "uk"),
    }),
    h.accessor("departure", {
      id: "departure",
      header: () => "Departure",
      cell: (ctx) => (
        <EditableCell
          value={ctx.getValue()}
          canEdit={canEdit}
          onCommit={(v) => onCellCommit(ctx.row.original.id, { departure: v })}
          className="tabular-nums board-glow"
        />
      ),
      sortingFn: "alphanumeric",
    }),
    h.accessor("arrival", {
      id: "arrival",
      header: () => "Arrival",
      cell: (ctx) => (
        <EditableCell
          value={ctx.getValue()}
          canEdit={canEdit}
          onCommit={(v) => onCellCommit(ctx.row.original.id, { arrival: v })}
          className="tabular-nums"
        />
      ),
      sortingFn: "alphanumeric",
    }),
  ];

  // Add actions column ONLY when canEdit
  if (canEdit) {
    cols.push(
      h.display({
        id: "actions",
        header: () => "",
        enableSorting: false,
        cell: (ctx) => (
          <div className="flex flex-wrap gap-2 whitespace-normal break-words items-start">
            <Button
              type="button"
              variant="ghost"
              callback={() => onEdit(ctx.row.original)}
              text="Edit"
            />
            <Button
              type="button"
              variant="danger"
              callback={() => onDelete(ctx.row.original)}
              text="Delete"
            />
          </div>
        ),
      })
    );
  }

  return cols;
};

function EditableCell({
                        value,
                        canEdit,
                        onCommit,
                        className = "",
                      }: {
  value: string;
  canEdit: boolean;
  onCommit: (v: string) => void;
  className?: string;
}) {
  const [local, setLocal] = useState(value);
  const [initial, setInitial] = useState(value);

  // keep local in sync if row changes externally
  if (initial !== value) {
    setInitial(value);
    setLocal(value);
  }

  const commit = () => {
    const trimmed = local.trim();
    if (trimmed !== initial) onCommit(trimmed);
  };

  if (!canEdit) return <span className={`text-sm ${className}`}>{value}</span>;

  return (
    <input
      className={
        "w-full rounded border border-board-line bg-transparent px-2 py-1 text-sm text-uzg-400 focus:border-uzg-500 " + className
      }
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur(); // triggers onBlur → commit
        } else if (e.key === "Escape") {
          setLocal(initial); // revert without commit
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}