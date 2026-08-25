"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { useCart } from "@/context/CartContext";
import { NORMAL_CUP_OPTIONS as SERVING_OPTIONS, PACK_OPTIONS } from "@/data/menu";
import dynamic from "next/dynamic";
import { Package, X } from "lucide-react";

const PackBuilderModal = dynamic(() => import("@/components/PackBuilderModal"), {
  ssr: false,
});

interface CupsSectionProps {
  selectedIndex?: number;
  selectionRequestKey?: number;
}

const [SMALL_PACK, FAMILY_PACK] = PACK_OPTIONS;

const formatRupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

export default function CupsSection({ selectedIndex, selectionRequestKey }: CupsSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedServingId, setSelectedServingId] = useState<string | null>(null);
  const [servingQuantity, setServingQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addToCart } = useCart();

  // Pack Builder Modal State
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [activePackType, setActivePackType] = useState<"small" | "family">("small");

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetOpenerRef = useRef<HTMLButtonElement>(null);
  const activeIdxRef = useRef(0);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const selectedServing = SERVING_OPTIONS.find((option) => option.id === selectedServingId) ?? null;
  const selectedServingTotal = selectedServing ? selectedServing.price * servingQuantity : 0;
  const selectedServingSaving = selectedServing ? selectedServing.saving * servingQuantity : 0;

  // Auto-open pack builder if ?pack=6 or ?pack=12 query param is present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const pack = params.get("pack");
    if (pack === "6" || pack === "small") {
      setActivePackType("small");
      setPackModalOpen(true);
    } else if (pack === "12" || pack === "family") {
      setActivePackType("family");
      setPackModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (selectedIndex === undefined) return;
    const nextIndex = Math.max(0, Math.min(FLAVOURS.length - 1, selectedIndex));
    activeIdxRef.current = nextIndex;
    setActiveIdx(nextIndex);
  }, [selectedIndex, selectionRequestKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-accent", activeFlavour.color);
    return () => {
      root.style.removeProperty("--page-accent");
    };
  }, [activeFlavour.color]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  const prevIdx = activeIdx > 0 ? activeIdx - 1 : null;
  const nextIdx = activeIdx < FLAVOURS.length - 1 ? activeIdx + 1 : null;

  const goToPrev = useCallback(() => {
    setActiveIdx((prev) => {
      const next = Math.max(0, prev - 1);
      activeIdxRef.current = next;
      return next;
    });
  }, []);

  const goToNext = useCallback(() => {
    setActiveIdx((prev) => {
      const next = Math.min(FLAVOURS.length - 1, prev + 1);
      activeIdxRef.current = next;
      return next;
    });
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
    sheetOpenerRef.current?.focus();
  }, []);

  const handleServingQuantityChange = (delta: number) => {
    setServingQuantity((current) => Math.max(1, Math.min(20, current + delta)));
  };

  const handleServingKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    if (!back && !forward) return;
    event.preventDefault();
    event.stopPropagation();

    const nextIndex = Math.max(0, Math.min(SERVING_OPTIONS.length - 1, index + (forward ? 1 : -1)));
    setSelectedServingId(SERVING_OPTIONS[nextIndex].id);
    const group = event.currentTarget.parentElement;
    (group?.children[nextIndex] as HTMLElement | undefined)?.focus();
  };

  const handleAddServing = (fromSheet: boolean) => {
    if (!selectedServing) return;

    addToCart({
      type: "Cup",
      flavourId: activeFlavour.id,
      flavour: activeFlavour.name,
      quantity: servingQuantity,
      size: selectedServing.name,
      servingId: selectedServing.id,
      scoopCount: selectedServing.scoops,
      unitPrice: selectedServing.price,
      originalPrice: selectedServing.originalPrice,
      saving: selectedServing.saving,
      image: activeFlavour.cupImageSrc,
      color: activeFlavour.color,
    });

    setSuccessMessage(`${selectedServing.name} added to cart`);
    setServingQuantity(1);
    window.setTimeout(() => setSuccessMessage(null), 1800);
    if (fromSheet) window.setTimeout(() => closeSheet(), 550);
  };

  useEffect(() => {
    if (!isSheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSheet();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSheetOpen, closeSheet]);

  useEffect(() => {
    if (isSheetOpen || packModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, isSheetOpen, packModalOpen]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || isSheetOpen || packModalOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("aside, button, input, a, [role='radiogroup'], .cup-sheet")) {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        return;
      }

      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;
      touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
      touchDeltaYRef.current = e.touches[0].clientY - touchStartYRef.current;
    };

    const handleTouchEnd = () => {
      if (touchStartXRef.current === null) return;

      const absX = Math.abs(touchDeltaXRef.current);
      const absY = Math.abs(touchDeltaYRef.current);

      if (absX > 20 && absX > absY) {
        if (touchDeltaXRef.current < 0) goToNext();
        else goToPrev();
      }

      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    };

    sectionEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    sectionEl.addEventListener("touchmove", handleTouchMove, { passive: true });
    sectionEl.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      sectionEl.removeEventListener("touchstart", handleTouchStart);
      sectionEl.removeEventListener("touchmove", handleTouchMove);
      sectionEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrev, isSheetOpen, packModalOpen]);

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

  const openPackBuilder = (type: "small" | "family") => {
    setIsSheetOpen(false);
    setActivePackType(type);
    setPackModalOpen(true);
  };

  const buildControls = (inSheet: boolean, headingId: string) => (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 id={headingId} className="text-[0.86rem] font-black uppercase tracking-[0.08em]">
            Choose your cup size
          </h4>
          <p className="cup-serving-muted text-[0.78rem] font-semibold mt-1">
            Single flavour: all scoops will be {activeFlavour.name}
          </p>
        </div>
        <span className="cup-serving-status text-[0.72rem] font-black rounded-full border px-3 py-1.5 whitespace-nowrap self-start">
          {selectedServing ? selectedServing.name : "Select one"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Cup serving options">
        {SERVING_OPTIONS.map((option, optionIndex) => {
          const isSelected = selectedServingId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedServingId(option.id)}
              onKeyDown={(event) => handleServingKeyDown(event, optionIndex)}
              className={`cup-serving-card relative flex items-center gap-3 min-h-[64px] rounded-2xl border-2 p-3 pr-11 text-left cursor-pointer transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2 active:scale-[0.98] ${
                isSelected
                  ? "is-selected shadow-[0_10px_26px_rgba(21,21,15,0.13)]"
                  : "shadow-sm hover:shadow-md"
              }`}
            >
              <span className="flex-1 min-w-0">
                <span className="block text-[0.9rem] font-black leading-tight">{option.name}</span>
                <span className="cup-serving-muted block mt-0.5 text-[0.75rem] font-bold">
                  {option.scoops} scoops
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[1rem] font-black leading-none">{formatRupees(option.price)}</span>
                <span className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="cup-serving-muted text-[0.75rem] line-through">
                    {formatRupees(option.originalPrice)}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[0.72rem] font-black bg-green-700 text-white leading-tight">
                    Save {formatRupees(option.saving)}
                  </span>
                </span>
              </span>
              {isSelected && (
                <span
                  className="cup-serving-check absolute right-3 top-3 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow-sm"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.08em] cup-serving-muted">Quantity</span>
        <div className="cup-serving-quantity flex items-center rounded-full border p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleServingQuantityChange(-1)}
            disabled={servingQuantity <= 1}
            className="w-11 h-11 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Decrease serving quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-black tabular-nums" aria-live="polite">
            {servingQuantity}
          </span>
          <button
            type="button"
            onClick={() => handleServingQuantityChange(1)}
            disabled={servingQuantity >= 20}
            className="w-11 h-11 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Increase serving quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleAddServing(inSheet)}
        disabled={!selectedServing}
        className="mt-3 w-full min-h-[52px] rounded-full bg-ink text-panel text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55 disabled:shadow-none"
      >
        {successMessage ?? (selectedServing ? `Add to Cart · ${formatRupees(selectedServingTotal)}` : "Select a size first")}
      </button>
      {selectedServingSaving > 0 && (
        <p className="mt-2 text-center text-[0.72rem] font-black opacity-60">
          You save {formatRupees(selectedServingSaving)}
        </p>
      )}

      <div className="mt-4 border-t border-ink/15 pt-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <h4 className="text-[0.8rem] font-black uppercase tracking-[0.07em]">
              Mix &amp; Match Packs
            </h4>
            <p className="cup-serving-muted text-[0.72rem] font-semibold">
              Pick different flavours.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openPackBuilder("small")}
            className="cup-serving-card min-h-[68px] rounded-2xl border-2 p-3 text-left shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-200 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2"
          >
            <span className="block text-[0.8rem] font-black leading-tight">Small Pack</span>
            <span className="cup-serving-muted mt-1 block text-[0.72rem] font-bold">
              {SMALL_PACK.scoops} scoops &middot; {formatRupees(SMALL_PACK.price)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => openPackBuilder("family")}
            className="cup-serving-card min-h-[68px] rounded-2xl border-2 p-3 text-left shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-200 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2"
          >
            <span className="block text-[0.8rem] font-black leading-tight">Family Pack</span>
            <span className="cup-serving-muted mt-1 block text-[0.72rem] font-bold">
              {FAMILY_PACK.scoops} scoops &middot; {formatRupees(FAMILY_PACK.price)}
            </span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="cups"
        style={{ backgroundColor: activeFlavour.color }}
        className="cups-section relative min-h-[calc(100dvh-var(--header-height,126px))] pt-5 max-md:pt-4 max-sm:pt-3 pb-4 max-md:pb-3 flex flex-col items-center justify-center overflow-x-hidden isolate transition-colors duration-[380ms] ease-custom text-ink touch-pan-y"
        aria-label="Cups Collection"
      >
        {/* 1. Collection heading */}
        <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10 shrink-0">
          <p className="kicker mb-1 text-[0.72rem] max-md:text-[0.7rem] font-extrabold tracking-[0.18em] uppercase opacity-80">
            <span className="inline-block w-6 h-[2px] mr-2 bg-current align-middle" aria-hidden="true" />
            CUPS COLLECTION
          </p>
          <h2 className="max-sm:hidden font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[0.95] tracking-[-0.06em] m-0 font-extrabold">
            Single-flavour cups.
          </h2>
          <p className="mt-2 max-sm:hidden text-[0.86rem] max-md:text-[0.8rem] opacity-75 max-w-[460px] mx-auto leading-relaxed">
            Select one signature flavour in a Small (2 scoops), Medium (3 scoops), or Large (4 scoops) cup.
          </p>
        </div>

        <div className="my-3 max-sm:my-2 w-[min(1100px,calc(100%-48px))] xl:w-[min(1560px,calc(100%-72px))] max-md:w-full mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 xl:gap-9 max-xl:flex max-xl:flex-col max-xl:flex-1 max-xl:min-h-0 max-xl:w-full">
          {/* 2. Cup carousel stage */}
          <div className="relative w-full flex flex-col items-center justify-center min-h-[clamp(200px,30svh,360px)] xl:min-h-[clamp(320px,56svh,560px)] max-xl:flex-1 max-xl:min-h-[160px] select-none">
            <button
              type="button"
              onClick={goToPrev}
              disabled={activeIdx === 0}
              aria-label={prevIdx !== null ? `Previous cup: ${FLAVOURS[prevIdx].name}` : "First cup reached"}
              className={`${arrowClass} left-4 max-md:left-2 ${
                activeIdx === 0 ? "opacity-25 pointer-events-none" : "hover:bg-white active:scale-95 cursor-pointer"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="relative w-full h-[clamp(200px,30svh,360px)] xl:h-[clamp(320px,56svh,560px)] max-xl:h-auto max-xl:flex-1 max-xl:min-h-0 max-xl:max-h-[calc(100vw-24px)] flex items-center justify-center">
              <div
                className="cup-backdrop absolute w-[clamp(240px,19vw,320px)] max-md:w-[clamp(170px,44vw,230px)] aspect-square rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_20px_60px_rgba(21,21,15,0.1)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                aria-hidden="true"
              />

              {FLAVOURS.map((item, idx) => {
                const isCurrent = idx === activeIdx;
                const isPrev = idx === prevIdx;
                const isNext = idx === nextIdx;

                if (!isCurrent && !isPrev && !isNext) return null;

                let transform = "translate(-50%, -50%) scale(1)";
                let opacity = 1;
                let zIndex = 20;

                if (isPrev) {
                  transform = "translate(-50%, -50%) translateX(-104%) scale(0.62) rotate(-4deg)";
                  opacity = 0.2;
                  zIndex = 10;
                } else if (isNext) {
                  transform = "translate(-50%, -50%) translateX(104%) scale(0.62) rotate(4deg)";
                  opacity = 0.2;
                  zIndex = 10;
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isPrev) goToPrev();
                      if (isNext) goToNext();
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      opacity,
                      zIndex,
                      transform,
                      transformOrigin: "center center",
                      transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out",
                    }}
                    className={`h-full aspect-square flex items-center justify-center ${
                      !isCurrent ? "cursor-pointer" : ""
                    }`}
                  >
                    <Image
                      src={item.cupImageSrc}
                      alt={item.cupAlt}
                      fill
                      sizes="(max-width: 768px) min(calc(100vw - 24px), calc(100svh - 389px)), (max-width: 1279px) min(calc(100vw - 24px), calc(100svh - 421px)), min(56svh, 560px)"
                      loading={isCurrent ? "eager" : "lazy"}
                      fetchPriority={isCurrent ? "high" : "low"}
                      priority={isCurrent}
                      decoding="async"
                      className="cup-product-image w-full h-full object-contain filter drop-shadow-[0_25px_20px_rgba(40,30,15,0.22)]"
                    />
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToNext}
              disabled={activeIdx === FLAVOURS.length - 1}
              aria-label={nextIdx !== null ? `Next cup: ${FLAVOURS[nextIdx].name}` : "Last cup reached"}
              className={`${arrowClass} right-4 max-md:right-2 ${
                activeIdx === FLAVOURS.length - 1
                  ? "opacity-25 pointer-events-none"
                  : "hover:bg-white active:scale-95 cursor-pointer"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-3 max-sm:mt-2 text-center z-10 shrink-0">
              <h3 className="font-display text-[clamp(1.3rem,2.8vw,2.1rem)] max-sm:text-[clamp(1.15rem,5.2vw,1.7rem)] font-black uppercase tracking-tight m-0 text-ink leading-tight">
                {activeFlavour.name}
              </h3>
              <div
                className="mt-2 flex items-center justify-center gap-[10px] max-sm:gap-[7px]"
                role="tablist"
                aria-label="Flavour progress"
              >
                {FLAVOURS.map((item, idx) => {
                  const isCurrent = idx === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Go to ${item.name}`}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        width: isCurrent ? "30px" : "13px",
                        height: "3.5px",
                        backgroundColor: "#15150f",
                        opacity: isCurrent ? 1 : 0.25,
                      }}
                      className="progress-dot relative appearance-none cursor-pointer rounded-full border-0 p-0 transition-all duration-200 ease-custom after:absolute after:content-[''] after:-top-3 after:-bottom-3 after:-left-[3px] after:-right-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    />
                  );
                })}
              </div>
              <p className="sr-only" aria-live="polite">
                {activeFlavour.name}, {activeIdx + 1} of {FLAVOURS.length}
              </p>
            </div>
          </div>

          {/* 3a. Desktop: controls sit beside the cup */}
          <aside
            className="cup-serving-panel relative z-30 hidden xl:block w-full max-w-[600px] mx-auto shrink-0 rounded-[22px] border backdrop-blur-md p-5"
            style={{ "--cup-accent": activeFlavour.color } as React.CSSProperties}
            aria-labelledby="serving-heading"
          >
            {buildControls(false, "serving-heading")}
          </aside>
        </div>

        {/* 3b. Mobile & tablet: one button */}
        <div className="xl:hidden w-[calc(100%-24px)] mx-auto shrink-0 z-30">
          <button
            ref={sheetOpenerRef}
            type="button"
            onClick={() => setIsSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isSheetOpen}
            className="w-full min-h-[52px] rounded-full bg-ink text-panel text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {selectedServing ? (
              <span>
                {selectedServing.name} · {formatRupees(selectedServingTotal)}
              </span>
            ) : (
              <span>Choose size or pack</span>
            )}
          </button>
        </div>

        {/* Site credit */}
        <p className="site-credit w-[calc(100%-24px)] mx-auto shrink-0 pt-2 text-center text-[0.66rem] font-bold tracking-wide opacity-55">
          Designed by{" "}
          <a href="https://mavplo.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            MAVPLO &bull; mavplo.com
          </a>
        </p>

        {isSheetOpen && (
          <div
            className="xl:hidden fixed inset-0 z-[70]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cup-sheet-heading"
          >
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Close serving options"
              className="absolute inset-0 w-full h-full bg-ink/55 backdrop-blur-[2px] cursor-default"
            />
            <div
              ref={sheetRef}
              tabIndex={-1}
              style={{ "--cup-accent": activeFlavour.color } as React.CSSProperties}
              className="cup-sheet cup-serving-panel absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-[26px] border-t p-4 pb-6 outline-none animate-sheet-up motion-reduce:animate-none"
            >
              <div className="relative flex min-h-11 items-center justify-center mb-2">
                <span className="h-1.5 w-12 rounded-full bg-ink/20" aria-hidden="true" />
                <button
                  type="button"
                  onClick={closeSheet}
                  aria-label="Close serving options"
                  className="absolute right-0 top-0 w-11 h-11 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center text-lg font-black transition-colors"
                >
                  <X className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
                </button>
              </div>
              {buildControls(true, "cup-sheet-heading")}
            </div>
          </div>
        )}
      </section>

      {/* Pack Builder Interactive Modal */}
      <PackBuilderModal
        isOpen={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        packType={activePackType}
      />
    </>
  );
}
