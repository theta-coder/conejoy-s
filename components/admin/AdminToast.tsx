"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

interface AdminToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function AdminToast({ toasts, onDismiss }: AdminToastProps) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        const bg = isSuccess
          ? "bg-emerald-600 text-white"
          : isError
          ? "bg-red-600 text-white"
          : "bg-amber-500 text-white";

        const Icon = isSuccess
          ? CheckCircle2
          : isError
          ? AlertCircle
          : AlertTriangle;

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-3.5 rounded-xl shadow-lg border border-white/20 text-xs font-bold animate-slide-up ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:opacity-80 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
