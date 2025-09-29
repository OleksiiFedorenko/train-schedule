"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";

export default function ConfirmModal({
                                       open,
                                       message,
                                       onConfirm,
                                       onCancel,
                                       confirmText = "Yes",
                                       cancelText = "No",
                                     }: {
  open: boolean;
  message: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (loading) return;
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") doConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loading]);

  if (!open) return null;

  const doConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const safeBackdropClick = () => {
    if (!loading) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      role="dialog"
      aria-modal
      onClick={safeBackdropClick}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-board-line bg-board-cell p-5 shadow-glow-error"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 font-board text-lg tracking-wider text-uzg-500 board-glow">
          Confirm action
        </h3>

        <div className="mb-5 text-sm text-uzg-400 whitespace-pre-wrap break-words">
          {message}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            callback={onCancel}
            text={cancelText}
            disabled={loading}
          />
          <Button
            type="button"
            variant="danger"
            callback={doConfirm}
            text={confirmText}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}