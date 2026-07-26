"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-ink text-panel shadow-2xl flex items-center gap-2.5 text-xs font-black tracking-wide animate-bounce-short border border-white/20"
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span>{toastMessage}</span>
    </div>
  );
}
