"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FLAVOURS } from "@/data/flavours";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Check } from "lucide-react";

interface PackBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  packType: "small" | "family";
}

export default function PackBuilderModal({
  isOpen,
  onClose,
  packType,
}: PackBuilderModalProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const targetScoops = packType === "family" ? 12 : 6;
  const packName = packType === "family" ? "12-Scoop Family Pack" : "6-Scoop Pack";
  const packPrice = packType === "family" ? 820 : 420;

  // Track scoop count per flavour ID: { mango: 2, kulfa: 1, ... }
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Reset counts when modal opens or packType changes
  useEffect(() => {
    if (isOpen) {
      setCounts({});
    }
  }, [isOpen, packType]);

  if (!isOpen) return null;

  const currentTotalScoops = Object.values(counts).reduce((a, b) => a + b, 0);
  const isComplete = currentTotalScoops === targetScoops;
  const remaining = targetScoops - currentTotalScoops;

  const handleUpdate = (flavourId: string, delta: number) => {
    setCounts((prev) => {
      const current = prev[flavourId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (delta > 0 && currentTotalScoops >= targetScoops) return prev;

      const updated = { ...prev };
      if (next === 0) {
        delete updated[flavourId];
      } else {
        updated[flavourId] = next;
      }
      return updated;
    });
  };

  const handleTryAll12 = () => {
    if (packType !== "family") return;
    const allTwelveCounts: Record<string, number> = {};
    FLAVOURS.forEach((f) => {
      allTwelveCounts[f.id] = 1;
    });
    setCounts(allTwelveCounts);
  };

  const handleAddToCart = () => {
    if (!isComplete) return;

    // Generate readable flavour breakdown lines: e.g., "Mango × 2\nKulfa × 1"
    const breakdownLines = Object.entries(counts)
      .map(([id, count]) => {
        const f = FLAVOURS.find((item) => item.id === id);
        return `${f?.name || id} × ${count}`;
      })
      .join("\n");

    addToCart({
      type: "Pack",
      flavour: packName,
      size: `${targetScoops} scoops (Mix & Match)`,
      servingId: packType === "family" ? "family-pack" : "small-pack",
      scoopCount: targetScoops,
      unitPrice: packPrice,
      quantity: 1,
      image: "/assets/mascot-logo.png",
      color: "#faa926",
      flavourBreakdownText: breakdownLines,
    });

    onClose();
    setIsCartOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto isolate bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-[#fdf6e3] rounded-t-[32px] sm:rounded-[32px] border border-[#4a2618]/20 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden text-[#4a2618]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#4a2618]/10 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#faa926]/20 px-3 py-0.5 text-[0.68rem] font-black uppercase tracking-wider text-[#4a2618]">
              <span>Multi-Flavour Pack</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-[#4a2618]">
              Build your {targetScoops}-scoop pack
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-[#4a2618]/10 hover:bg-[#4a2618]/20 flex items-center justify-center text-[#4a2618] transition-colors"
            aria-label="Close builder"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Counter & Status Bar */}
        <div className="px-5 py-3 bg-[#4a2618] text-white flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#faa926] animate-pulse" />
            <span>
              {currentTotalScoops} / {targetScoops} scoops selected
            </span>
          </div>

          {remaining > 0 ? (
            <span className="text-[#faa926]">Select {remaining} more</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Pack ready!</span>
            </span>
          )}
        </div>

        {/* Shortcut Bar (Try All 12) for Family Pack */}
        {packType === "family" && (
          <div className="px-5 py-2.5 bg-[#faa926]/20 border-b border-[#4a2618]/10 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#4a2618]">
              Want 1 scoop of every flavour?
            </span>
            <button
              type="button"
              onClick={handleTryAll12}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4a2618] hover:bg-[#381c11] px-3.5 py-1 text-[0.7rem] font-black uppercase text-white transition-transform active:scale-95 shadow-sm"
            >
              <span>Try All 12 Flavours</span>
            </button>
          </div>
        )}

        {/* Flavours List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#4a2618]/10 bg-[#fdf6e3]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FLAVOURS.map((flavour) => {
              const qty = counts[flavour.id] || 0;
              const canAdd = currentTotalScoops < targetScoops;

              return (
                <div
                  key={flavour.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    qty > 0
                      ? "bg-white border-[#4a2618]/30 shadow-sm"
                      : "bg-white/60 border-[#4a2618]/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center p-1 border border-black/10 shadow-inner"
                      style={{ backgroundColor: flavour.color }}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={flavour.cupImageSrc}
                          alt={flavour.name}
                          fill
                          sizes="40px"
                          className="object-contain drop-shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-[#4a2618] truncate">
                        {flavour.name}
                      </h4>
                      <p className="text-[0.68rem] font-bold text-[#4a2618]/60 truncate">
                        {flavour.indexLabel}
                      </p>
                    </div>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(flavour.id, -1)}
                      disabled={qty === 0}
                      className="h-8 w-8 rounded-xl border border-[#4a2618]/20 bg-white flex items-center justify-center text-[#4a2618] font-black text-sm disabled:opacity-30 disabled:pointer-events-none hover:bg-[#4a2618]/10 active:scale-95 transition-all"
                      aria-label={`Decrease ${flavour.name} scoops`}
                    >
                      <Minus className="h-3.5 w-3.5 stroke-[3]" />
                    </button>

                    <span className="w-6 text-center font-display text-base font-black text-[#4a2618]">
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUpdate(flavour.id, 1)}
                      disabled={!canAdd}
                      className="h-8 w-8 rounded-xl border border-[#4a2618] bg-[#4a2618] text-white flex items-center justify-center font-black text-sm disabled:opacity-30 disabled:pointer-events-none hover:bg-[#381c11] active:scale-95 transition-all shadow-sm"
                      aria-label={`Increase ${flavour.name} scoops`}
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 border-t border-[#4a2618]/10 bg-white/95 backdrop-blur-md sticky bottom-0 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isComplete}
            className="w-full min-h-[52px] rounded-full bg-[#4a2618] hover:bg-[#381c11] disabled:opacity-40 disabled:pointer-events-none text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
          >
            <span>
              Add {packName} — Rs. {packPrice.toLocaleString("en-PK")}
            </span>
          </button>
          {!isComplete && (
            <p className="text-center text-xs font-semibold text-[#4a2618]/60">
              Please select exactly {targetScoops} scoops to add your pack to cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
