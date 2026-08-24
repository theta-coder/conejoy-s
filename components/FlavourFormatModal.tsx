"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Utensils, GlassWater, IceCream } from "lucide-react";
import { FlavourItem } from "@/data/flavours";

interface FlavourFormatModalProps {
  flavour: FlavourItem | null;
  onClose: () => void;
}

export default function FlavourFormatModal({ flavour, onClose }: FlavourFormatModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!flavour) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flavour, onClose]);

  if (!flavour) return null;

  const handleSelectFormat = (format: "cone" | "cup" | "shake") => {
    onClose();
    if (format === "cone") {
      router.push(`/cones?flavour=${flavour.id}`);
    } else if (format === "cup") {
      router.push(`/cups?flavour=${flavour.id}`);
    } else if (format === "shake") {
      router.push(`/shakes?flavour=${flavour.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="flavour-modal-title"
        className="relative z-10 w-full sm:max-w-[460px] bg-[#fdf6e3] rounded-t-[32px] sm:rounded-[36px] border border-[#4a2618]/15 shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
      >
        {/* Top Handle for mobile bottom sheet */}
        <div className="sm:hidden mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#4a2618]/20" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-[#4a2618]/15 text-[#4a2618] hover:bg-white transition-colors"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Flavour Header Preview */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#4a2618]/15 shadow-inner p-2"
            style={{
              backgroundColor: `color-mix(in srgb, ${flavour.color} 30%, white)`,
            }}
          >
            <Image
              src={flavour.webpSrc}
              alt={flavour.alt}
              width={160}
              height={320}
              className="h-full w-auto object-contain drop-shadow-md"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#4a2618]/10 px-3 py-0.5 text-[0.68rem] font-black uppercase tracking-wider text-[#4a2618]">
              {flavour.name} Selected
            </div>
            <h3
              id="flavour-modal-title"
              className="font-display text-2xl font-black text-[#4a2618] tracking-tight mt-1"
            >
              How would you like it?
            </h3>
            <p className="text-xs font-semibold text-[#4a2618]/70">
              Choose your format for {flavour.name}
            </p>
          </div>
        </div>

        {/* Format Options */}
        <div className="space-y-3">
          {/* Option 1: Cone */}
          <button
            type="button"
            onClick={() => handleSelectFormat("cone")}
            className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#4a2618]/15 bg-white p-4 transition-all duration-200 hover:border-[#4a2618] hover:shadow-md active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#4a2618] group-hover:bg-[#faa926] transition-colors">
                <IceCream className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-display text-base font-extrabold text-[#4a2618]">
                  Cone
                </span>
                <span className="block text-xs font-bold text-[#4a2618]/65">
                  Crispy waffle cone • Rs. 100
                </span>
              </div>
            </div>
            <span className="rounded-full bg-[#4a2618] px-4 py-1.5 text-xs font-black uppercase text-white group-hover:scale-105 transition-transform">
              Select
            </span>
          </button>

          {/* Option 2: Cup */}
          <button
            type="button"
            onClick={() => handleSelectFormat("cup")}
            className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#4a2618]/15 bg-white p-4 transition-all duration-200 hover:border-[#4a2618] hover:shadow-md active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#4a2618] group-hover:bg-[#faa926] transition-colors">
                <Utensils className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-display text-base font-extrabold text-[#4a2618]">
                  Cup
                </span>
                <span className="block text-xs font-bold text-[#4a2618]/65">
                  Chilled scoop cup • Rs. 100
                </span>
              </div>
            </div>
            <span className="rounded-full bg-[#4a2618] px-4 py-1.5 text-xs font-black uppercase text-white group-hover:scale-105 transition-transform">
              Select
            </span>
          </button>

          {/* Option 3: Shake */}
          <button
            type="button"
            onClick={() => handleSelectFormat("shake")}
            className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#4a2618]/15 bg-white p-4 transition-all duration-200 hover:border-[#4a2618] hover:shadow-md active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#4a2618] group-hover:bg-[#faa926] transition-colors">
                <GlassWater className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-display text-base font-extrabold text-[#4a2618]">
                  Shake
                </span>
                <span className="block text-xs font-bold text-[#4a2618]/65">
                  Thick blended shake • Rs. 280
                </span>
              </div>
            </div>
            <span className="rounded-full bg-[#4a2618] px-4 py-1.5 text-xs font-black uppercase text-white group-hover:scale-105 transition-transform">
              Select
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
