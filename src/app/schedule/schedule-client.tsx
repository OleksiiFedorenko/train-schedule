"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/lib/toast";
import type { TrainRow, Filters } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { columns as makeColumns } from "./columns";
import ScheduleTable from "./table";
import EditModal from "./edit-modal";
import CreateModal from "./create-modal";
import { api } from "@/lib/api";
import type { TrainCreate, TrainPut } from "@/lib/schemas";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function ScheduleClient() {
  const { status } = useSession();
  const canEdit = status === "authenticated";
  const { toast } = useToast();

  const [rows, setRows] = useState<TrainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TrainRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<TrainRow | null>(null);

  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const city = (search.get("city") || "").trim();
    const number = (search.get("number") || "").trim();
    // only one filter can be active
    if (city) setFilters({ city, number: "" });
    else if (number) setFilters({ city: "", number });
    else setFilters({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.toString()]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("train").json<TrainRow[]>()
      .then(data => { if (mounted) setRows(data); })
      .catch(() => {
        toast({ title: "Load failed", description: "Could not fetch trains.", variant: "error" });
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [toast]);

  // PATCH (inline)
  const onCellCommit = async (id: string, patch: Partial<TrainRow>) => {
    const prev = rows;
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await api.patch(`train/${id}`, { json: patch });
    } catch {
      setRows(prev);
      toast({ title: "Update failed", variant: "error" });
    }
  };

  // PUT (modal)
  const onSavePut = async (id: string, put: TrainPut) => {
    if (!canEdit) return;
    const prev = rows;
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...put } : r));
    try { await api.put(`train/${id}`, { json: put }); }
    catch {
      setRows(prev);
      toast({ title: "Update failed", variant: "error" });
    }
  };

  // POST (create)
  const openCreate = () => setCreateOpen(true);

  const onCreate = async (draft: TrainCreate) => {
    try {
      const created = await api.post("train", { json: draft }).json<TrainRow>();
      setRows(rs => [created, ...rs]);
      return created;
    } catch (e: any) {
      let message = "Something went wrong";
      const res: Response | undefined = e?.response;
      if (res) {
        try {
          const data = await res.clone().json();
          const m =
            Array.isArray(data?.message) ? data.message.join("\n")
              : data?.message
          if (m) message = m;
        } catch {
          // ignore
        }
      }
      throw new Error(message);
    }
  };

  // DELETE
  const onDelete = async (row: TrainRow) => {
    if (!canEdit) return;
    setToDelete(row);
  };

  const confirmDelete = async () => {
    const row = toDelete!;
    const prev = rows;
    setRows(rs => rs.filter(r => r.id !== row.id)); // оптимістично
    try {
      await api.delete(`train/${row.id}`);
    } catch {
      setRows(prev);
      toast({ title: "Delete failed", variant: "error" });
    } finally {
      setToDelete(null);
    }
  };

  const cols: ColumnDef<TrainRow, any>[] = useMemo(
    () => makeColumns(
      canEdit,
      (row) => setEditing(row),
      (row) => onDelete(row),
      onCellCommit
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canEdit, rows]
  );

  const filteredRows = useMemo(() => {
    if (filters.city?.trim()) {
      const q = filters.city.trim().toLowerCase();
      return rows.filter(r => r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q));
    }
    if (filters.number?.trim()) {
      const q = filters.number.trim().toLowerCase();
      return rows.filter(r => r.number.toLowerCase().includes(q));
    }
    return rows;
  }, [rows, filters]);

  const onFiltersChange = (f: Filters) => {
    const city = (f.city ?? "").trim();
    const number = (f.number ?? "").trim();
    const next: Filters = city ? { city, number: "" } : number ? { city: "", number } : {};
    setFilters(next);

    const params = new URLSearchParams();
    if (next.city) params.set("city", next.city);
    if (next.number) params.set("number", next.number);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      <ScheduleTable
        data={filteredRows}
        columns={cols}
        isLoading={loading}
        canEdit={canEdit}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onAdd={() => { if (canEdit) openCreate(); }}
      />

      <EditModal
        open={!!editing && canEdit}
        row={editing}
        onClose={() => setEditing(null)}
        onSave={async (put) => { if (editing) await onSavePut(editing.id, put); }}
      />

      <CreateModal
        open={createOpen && canEdit}
        onClose={() => setCreateOpen(false)}
        onCreate={async (draft) => { await onCreate(draft); setCreateOpen(false); }}
      />

      <ConfirmModal
        open={!!toDelete && canEdit}
        message={
          toDelete
            ? `Delete train ${toDelete.number}?`
            : ""
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}