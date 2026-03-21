"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  };

  const icons: Record<ToastType, typeof Check> = {
    success: Check,
    error: AlertCircle,
    info: Info,
  };

  const colors: Record<ToastType, string> = {
    success: "border-green-500/40 bg-green-950/60",
    error: "border-red-500/40 bg-red-950/60",
    info: "border-[var(--border-strong)] bg-[var(--bg-card-hover)]",
  };

  const iconColors: Record<ToastType, string> = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-[var(--text-secondary)]",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {items.map((item) => {
          const Icon = icons[item.type];
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 border backdrop-blur-xl text-sm text-[var(--text-primary)] animate-[slideInRight_0.3s_ease-out] ${colors[item.type]}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${iconColors[item.type]}`} strokeWidth={1.5} />
              <span className="flex-1 text-[13px]">{item.message}</span>
              <button
                onClick={() => remove(item.id)}
                className="shrink-0 p-0.5 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" strokeWidth={1.5} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
