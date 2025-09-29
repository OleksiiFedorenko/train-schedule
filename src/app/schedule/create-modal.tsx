"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/lib/toast";
import { TrainCreateSchema, type TrainCreate } from "@/lib/schemas";
import Button from "@/components/ui/button";

export default function CreateModal({ open, onClose, onCreate }: {
  open: boolean;
  onClose: () => void;
  onCreate: (draft: TrainCreate) => Promise<any>;
}) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrainCreate>({ resolver: zodResolver(TrainCreateSchema) });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  const submit = async (data: TrainCreate) => {
    try {
      await onCreate(data);
      toast({ variant: "success", title: "Train added" });
      reset();
      onClose();
    } catch (e: any) {
      const desc = typeof e.message === "string" ? e.message : "Something went wrong";
      toast({ variant: "error", title: "Create failed", description: desc });
    }
  };

  const inputCls =
    "w-full rounded border border-board-line bg-transparent px-3 py-2 text-sm text-uzg-400 focus:border-uzg-500 focus:ring-0";

  const safeClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={safeClose}
    >
      <form
        onSubmit={handleSubmit(submit)}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-board-line bg-board-cell p-5 shadow-glow-success"
      >
        <h3 className="mb-4 font-board text-lg tracking-wider text-uzg-500 board-glow">
          Add train route
        </h3>

        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-uzg-300">Number</span>
            <input
              className={inputCls}
              placeholder="Number"
              disabled={isSubmitting}
              {...register("number")}
            />
            {errors.number && (
              <span className="text-xs text-red-400">
                {errors.number.message}
              </span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-uzg-300">From</span>
            <input
              className={inputCls}
              placeholder="From"
              disabled={isSubmitting}
              {...register("from")}
            />
            {errors.from && (
              <span className="text-xs text-red-400">
                {errors.from.message}
              </span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-uzg-300">To</span>
            <input
              className={inputCls}
              placeholder="To"
              disabled={isSubmitting}
              {...register("to")}
            />
            {errors.to && (
              <span className="text-xs text-red-400">{errors.to.message}</span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-uzg-300">Departure</span>
            <input
              className={inputCls}
              placeholder="Departure HH:MM"
              disabled={isSubmitting}
              {...register("departure")}
            />
            {errors.departure && (
              <span className="text-xs text-red-400">{errors.departure.message}</span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-uzg-300">Arrival</span>
            <input
              className={inputCls}
              placeholder="Arrival HH:MM"
              disabled={isSubmitting}
              {...register("arrival")}
            />
            {errors.arrival && (
              <span className="text-xs text-red-400">{errors.arrival.message}</span>
            )}
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            callback={safeClose}
            variant="secondary"
            disabled={isSubmitting}
            text="Cancel"
            largeFont={true}
          />
          <Button
            variant="primary"
            disabled={isSubmitting}
            text={isSubmitting ? "Creating..." : "Create"}
            largeFont={true}
          />
        </div>
      </form>
    </div>
  );
}