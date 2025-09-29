"use client";

import { useEffect, useState } from "react";
import type { TrainRow } from "@/lib/types";
import { TrainPutSchema, type TrainPut } from "@/lib/schemas";
import Button from "@/components/ui/button";

export default function EditModal({ open, row, onClose, onSave}: {
  open: boolean;
  row: TrainRow | null;
  onClose: () => void;
  onSave: (put: TrainPut) => void; // will call PUT /train/:id
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open || !row) return null;

  const fields: (keyof TrainPut)[] = ["number", "from", "to", "departure", "arrival"];
  const submit = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const put = Object.fromEntries(fields.map(f => [f, String(fd.get(f) ?? "")])) as unknown as TrainPut;

    const parsed = TrainPutSchema.safeParse(put);
    if (!parsed.success) {
      const es: Record<string, string> = {};
      parsed.error.issues.forEach(i => { if (i.path[0]) es[String(i.path[0])] = i.message; });
      setErrors(es);
      return;
    }
    onSave(parsed.data);
    onClose();
  };

  const inputCls = "rounded-lg border border-board-line bg-board-soft px-3 py-2 text-uzg-400 focus:border-uzg-500";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      <form
        onSubmit={(e)=>{e.preventDefault(); submit(e.currentTarget);}}
        onClick={(e)=>e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-board-line bg-board-cell p-5 shadow-glow"
      >
        <h3 className="mb-4 font-board text-lg tracking-wider text-uzg-500 board-glow">Edit train route</h3>
        <div className="grid gap-3">
          {fields.map(f=>(
            <label key={f} className="grid gap-1 text-sm">
              <span className="text-uzg-300 capitalize">{f}</span>
              <input name={f} defaultValue={(row as any)[f] ?? ""} className={inputCls}/>
              {errors[f] && <span className="text-xs text-red-400">{errors[f]}</span>}
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            callback={onClose}
            variant="secondary"
            text="Cancel"
            largeFont={true}
          />
          <Button
            variant="primary"
            text="Save"
            largeFont={true}
          />
        </div>
      </form>
    </div>
  );
}