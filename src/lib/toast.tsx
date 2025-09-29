"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useCallback } from "react";

type Toast = { id: string; title?: string; description?: string; variant?: "success"|"error"|"info" };
type Ctx = { toast: (t: Omit<Toast, "id">) => void };

const ToastCtx = createContext<Ctx | null>(null);
export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast,"id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((xs) => [...xs, { id, ...t }]);
    // auto-hide
    setTimeout(() => setItems((xs) => xs.filter(i => i.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-[92vw] max-w-sm flex-col gap-2">
        {items.map(i => (
          <div
            key={i.id}
            role="status"
            aria-live="polite"
            className={[
              "pointer-events-auto rounded-xl border px-4 py-3",
              "bg-board-cell border-board-line",
              i.variant === "success" ? "border-uzg-500 shadow-glow-success" : "",
              i.variant === "info" ? "border-uzg-300 shadow-glow-info" : "",
              i.variant === "error" ? "border-red-500/60 shadow-glow-error" : "",
            ].join(" ")}
          >
            {i.title && (
              <div className={i.variant === "error" ? "font-medium text-red-300" : "font-medium text-uzg-500"}>
                {i.title}
              </div>
            )}
            {i.description && (
              <div className={i.variant === "error" ? "text-sm text-red-300" : "text-sm text-uzg-400 opacity-90"}>
                {i.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}