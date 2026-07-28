"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { useCart } from "@/context/CartContext";

interface CupsSectionProps {
  selectedIndex?: number;
}

interface ServingOption {
  id: string;
  name: string;
  scoops: number;
  price: number;
  originalPrice: number;
  saving: number;
}

interface TemporaryServing extends ServingOption {
  entryId: string;
  flavourId: string;
  flavourName: string;
  flavourColor: string;
  image: string;
  quantity: number;
}

const SERVING_OPTIONS: ServingOption[] = [
  { id: "single", name: "Single Scoop", scoops: 1, price: 100, originalPrice: 100, saving: 0 },
  { id: "small-cup", name: "Small Cup", scoops: 2, price: 160, originalPrice: 200, saving: 40 },
  { id: "medium-cup", name: "Medium Cup", scoops: 3, price: 220, originalPrice: 300, saving: 80 },
  { id: "large-cup", name: "Large Cup", scoops: 4, price: 290, originalPrice: 400, saving: 110 },
  { id: "small-pack", name: "Small Pack", scoops: 6, price: 420, originalPrice: 600, saving: 180 },
  { id: "family-pack", name: "Family Pack", scoops: 12, price: 820, originalPrice: 1200, saving: 380 },
];

const formatRupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

export default function CupsSection({ selectedIndex }: CupsSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedServingId, setSelectedServingId] = useState<string | null>(null);
  const [servingQuantity, setServingQuantity] = useState(1);
  const [temporaryOrder, setTemporaryOrder] = useState<TemporaryServing[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addManyToCart, setIsCartOpen } = useCart();

  // Touch refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIdxRef = useRef(0);
  const lastWheelNavigationRef = useRef(0);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const selectedServing = SERVING_OPTIONS.find((option) => option.id === selectedServingId) ?? null;
  const selectedServingPosition = selectedServing
    ? SERVING_OPTIONS.findIndex((option) => option.id === selectedServing.id) + 1
    : 0;
  const temporaryTotal = temporaryOrder.reduce(
    (total, entry) => total + entry.price * entry.quantity,
    0
  );

  useEffect(() => {
    if (selectedIndex === undefined) return;
    setActiveIdx(Math.max(0, Math.min(FLAVOURS.length - 1, selectedIndex)));
  }, [selectedIndex]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  // Next and Previous Index (Bounded, non-looping)
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
  const handleServingQuantityChange = (delta: number) => {
    setServingQuantity((current) => Math.max(1, Math.min(20, current + delta)));
  };

  const handleAddServing = () => {
    if (!selectedServing) return;

    const entryId = `${activeFlavour.id}-${selectedServing.id}`;
    setTemporaryOrder((currentOrder) => {
      const existingIndex = currentOrder.findIndex((entry) => entry.entryId === entryId);
      if (existingIndex < 0) {
        return [
          ...currentOrder,
          {
            ...selectedServing,
            entryId,
            flavourId: activeFlavour.id,
            flavourName: activeFlavour.name,
            flavourColor: activeFlavour.color,
            image: activeFlavour.cupImageSrc,
            quantity: servingQuantity,
          },
        ];
      }

      return currentOrder.map((entry, index) =>
        index === existingIndex
          ? { ...entry, quantity: Math.min(20, entry.quantity + servingQuantity) }
          : entry
      );
    });

    setSuccessMessage(`${selectedServing.name} added`);
    setServingQuantity(1);
    window.setTimeout(() => setSuccessMessage(null), 1800);
  };

  const updateTemporaryQuantity = (entryId: string, delta: number) => {
    setTemporaryOrder((currentOrder) =>
      currentOrder.map((entry) =>
        entry.entryId === entryId
          ? { ...entry, quantity: Math.max(1, Math.min(20, entry.quantity + delta)) }
          : entry
      )
    );
  };

  const removeTemporaryEntry = (entryId: string) => {
    setTemporaryOrder((currentOrder) => currentOrder.filter((entry) => entry.entryId !== entryId));
  };

  const handleAddAllToCart = () => {
    if (temporaryOrder.length === 0) return;

    addManyToCart(
      temporaryOrder.map((entry) => ({
        type: "Cup" as const,
        flavourId: entry.flavourId,
        flavour: entry.flavourName,
        quantity: entry.quantity,
        size: entry.name,
        servingId: entry.id,
        scoopCount: entry.scoops,
        unitPrice: entry.price,
        originalPrice: entry.originalPrice,
        saving: entry.saving,
        image: entry.image,
        color: entry.flavourColor,
      }))
    );
    setTemporaryOrder([]);
    setIsCartOpen(true);
  };

  // Keyboard Navigation (Left / Right Arrows)
  useEffect(() => {
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
  }, [goToPrev, goToNext]);



  // Mobile / Tablet Horizontal Touch Swipe Handler (Only on Cup Carousel Stage)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      // Do not trigger cup swipe if user is interacting with "Choose your serving" panel, buttons, or inputs
      if (target && target.closest("aside, button, input, a, [role='radiogroup']")) {
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

      const absX = Math.abs(touchDeltaXRef.current);
      const absY = Math.abs(touchDeltaYRef.current);

      if (absX > absY && absX > 20) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (touchStartXRef.current === null) return;

      const absX = Math.abs(touchDeltaXRef.current);
      const absY = Math.abs(touchDeltaYRef.current);

      if (absX > 20 && absX > absY) {
        if (touchDeltaXRef.current < 0 && activeIdx < FLAVOURS.length - 1) {
          goToNext();
        } else if (touchDeltaXRef.current > 0 && activeIdx > 0) {
          goToPrev();
        }
      }

      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    };

    sectionEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    sectionEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    sectionEl.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      sectionEl.removeEventListener("touchstart", handleTouchStart);
      sectionEl.removeEventListener("touchmove", handleTouchMove);
      sectionEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIdx, goToNext, goToPrev]);

  return (
    <section
      ref={sectionRef}
      id="cups"
      style={{ backgroundColor: activeFlavour.color }}
      className="relative min-h-[calc(100dvh-var(--header-height,126px))] pt-8 max-md:pt-5 max-sm:pt-4 pb-6 max-md:pb-5 flex flex-col items-center justify-center overflow-x-hidden isolate transition-colors duration-[380ms] ease-custom text-ink"
      aria-label="Cups Collection"
    >
      {/* 1. Collection Heading & Short Description */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10">
        <p className="kicker mb-1 text-[0.72rem] max-md:text-[0.66rem] font-extrabold tracking-[0.18em] uppercase opacity-80">
          <span className="inline-block w-6 h-[2px] mr-2 bg-current align-middle" aria-hidden="true" />
          CUPS COLLECTION
        </p>
        <h2 className="font-display text-[clamp(1.7rem,3.4vw,3rem)] max-sm:text-[clamp(1.4rem,6vw,1.9rem)] leading-[0.95] tracking-[-0.06em] m-0 font-extrabold">
          Your flavour, served your way.
        </h2>
        <p className="mt-2.5 max-sm:mt-2 text-[0.86rem] max-md:text-[0.76rem] max-sm:text-[0.7rem] opacity-75 max-w-[460px] mx-auto leading-relaxed">
          Explore all 12 signature flavours in a perfectly chilled cup.
        </p>
      </div>

      {/* 2. Flavour Counter & Flavour Name */}
      <div className="mt-3 max-sm:mt-2 flex flex-col items-center justify-center text-center z-10 transition-all duration-200">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-ink/10 text-[0.72rem] max-sm:text-[0.66rem] font-black tracking-widest uppercase">
          <span>{activeFlavour.indexLabel}</span>
        </div>
        <h3 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] max-sm:text-[clamp(1.5rem,5.8vw,2.3rem)] font-black uppercase tracking-tight m-0 mt-2 max-sm:mt-1.5 text-ink leading-tight whitespace-nowrap">
          {activeFlavour.name}
        </h3>
      </div>

      <div className="my-4 max-sm:my-2.5 w-[min(1480px,calc(100%-48px))] max-md:w-full mx-auto grid grid-cols-[minmax(0,1fr)_360px] max-xl:grid-cols-1 items-center gap-5 max-xl:gap-3">
      {/* 3. Cup Carousel Stage (HORIZONTAL MOTION TRANSITION) */}
      <div className="relative w-full flex items-center justify-center min-h-[clamp(280px,36svh,400px)] max-md:min-h-[clamp(190px,29svh,270px)] max-sm:min-h-[clamp(170px,28svh,230px)] select-none">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={goToPrev}
          disabled={activeIdx === 0}
          aria-label={prevIdx !== null ? `Previous cup: ${FLAVOURS[prevIdx].name}` : "First cup reached"}
          className={`absolute left-4 max-md:left-2 z-30 w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeIdx === 0
              ? "opacity-25 pointer-events-none"
              : "hover:bg-white active:scale-95 cursor-pointer"
          }`}
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cup Viewport Stage Container */}
        <div className="relative w-full h-[clamp(280px,36svh,400px)] max-md:h-[clamp(190px,29svh,270px)] max-sm:h-[clamp(170px,28svh,230px)] flex items-center justify-center">
          {/* White Backdrop Circle Centered Dead-Center behind Active Cup */}
          <div
            className="absolute w-[clamp(240px,19vw,320px)] max-md:w-[clamp(170px,44vw,230px)] aspect-square rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_20px_60px_rgba(21,21,15,0.1)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
            aria-hidden="true"
          />

          {FLAVOURS.map((item, idx) => {
            const isCurrent = idx === activeIdx;
            const isPrev = idx === prevIdx;
            const isNext = idx === nextIdx;

            // Render only current, prev, and next for max performance
            if (!isCurrent && !isPrev && !isNext) return null;

            let transformStyle = "";
            let opacity = 0;
            let zIndex = 0;

            if (isCurrent) {
              opacity = 1;
              zIndex = 20;
              // Active cup exact center anchor
              transformStyle = "translate(-50%, -50%) scale(1) rotate(0deg)";
            } else if (isPrev) {
              opacity = 0.20;
              zIndex = 10;
              // Horizontal slide left
              transformStyle =
                typeof window !== "undefined" && window.innerWidth <= 640
                  ? "translate(-50%, -50%) translateX(-105%) scale(0.6) rotate(-4deg)"
                  : "translate(-50%, -50%) translateX(-115%) scale(0.62) rotate(-4deg)";
            } else if (isNext) {
              opacity = 0.20;
              zIndex = 10;
              // Horizontal slide right
              transformStyle =
                typeof window !== "undefined" && window.innerWidth <= 640
                  ? "translate(-50%, -50%) translateX(105%) scale(0.6) rotate(4deg)"
                  : "translate(-50%, -50%) translateX(115%) scale(0.62) rotate(4deg)";
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
                  transform: transformStyle,
                  transformOrigin: "center center",
                  transition:
                    "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out",
                }}
                className={`w-[clamp(280px,21vw,380px)] max-md:w-[clamp(210px,50vw,290px)] max-sm:w-[clamp(160px,52vw,220px)] h-full flex items-center justify-center ${
                  !isCurrent ? "cursor-pointer" : ""
                }`}
              >
                <img
                  src={item.cupImageSrc}
                  alt={item.cupAlt}
                  width={500}
                  height={500}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_20px_rgba(40,30,15,0.22)] transition-transform duration-200"
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={goToNext}
          disabled={activeIdx === FLAVOURS.length - 1}
          aria-label={nextIdx !== null ? `Next cup: ${FLAVOURS[nextIdx].name}` : "Last cup reached"}
          className={`absolute right-4 max-md:right-2 z-30 w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeIdx === FLAVOURS.length - 1
              ? "opacity-25 pointer-events-none"
              : "hover:bg-white active:scale-95 cursor-pointer"
          }`}
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <aside className="relative z-30 w-full max-w-[360px] max-xl:max-w-[900px] max-xl:w-[calc(100%-24px)] max-xl:mx-auto rounded-2xl border border-ink/15 bg-white/75 backdrop-blur-md shadow-[0_18px_55px_rgba(21,21,15,0.12)] p-4 max-sm:p-3" aria-labelledby="serving-heading">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h4 id="serving-heading" className="text-sm font-black uppercase tracking-wide">Choose your serving</h4>
            <p className="text-[0.7rem] font-semibold text-ink/60 mt-0.5">All scoops use {activeFlavour.name}</p>
          </div>
          <span className="text-[0.65rem] font-black rounded-full bg-ink/10 px-2.5 py-1 whitespace-nowrap">
            {selectedServing
              ? `${selectedServingPosition} / ${SERVING_OPTIONS.length} · ${selectedServing.scoops} scoop${selectedServing.scoops === 1 ? "" : "s"}`
              : `0 / ${SERVING_OPTIONS.length}`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 max-xl:flex max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:pb-2 max-xl:pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Cup serving options">
          {SERVING_OPTIONS.map((option) => {
            const isSelected = selectedServingId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedServingId(option.id)}
                className={`relative min-h-[92px] rounded-xl border p-2.5 text-left transition-all active:scale-[0.98] max-xl:min-w-[155px] max-xl:snap-start ${
                  isSelected
                    ? "border-ink bg-ink text-panel shadow-md"
                    : "border-ink/15 bg-white/65 text-ink hover:border-ink/45"
                }`}
              >
                <span className="block pr-5 text-[0.76rem] font-black leading-tight">{option.name}</span>
                <span className={`block mt-1 text-[0.65rem] font-bold ${isSelected ? "text-panel/70" : "text-ink/55"}`}>
                  {option.scoops} scoop{option.scoops === 1 ? "" : "s"}
                </span>
                <span className="block mt-1.5 text-sm font-black">{formatRupees(option.price)}</span>
                {option.saving > 0 && (
                  <span className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[0.6rem] line-through ${isSelected ? "text-panel/55" : "text-ink/45"}`}>{formatRupees(option.originalPrice)}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[0.56rem] font-black ${isSelected ? "bg-panel text-ink" : "bg-green-700 text-white"}`}>
                      Save {formatRupees(option.saving)}
                    </span>
                  </span>
                )}
                {isSelected && <span className="absolute right-2.5 top-2 text-xs" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-black">Quantity</span>
          <div className="flex items-center rounded-full border border-ink/20 bg-white/80 p-1">
            <button type="button" onClick={() => handleServingQuantityChange(-1)} disabled={servingQuantity <= 1} className="w-8 h-8 rounded-full font-black hover:bg-ink/10 disabled:opacity-30" aria-label="Decrease serving quantity">−</button>
            <span className="w-9 text-center text-sm font-black tabular-nums">{servingQuantity}</span>
            <button type="button" onClick={() => handleServingQuantityChange(1)} disabled={servingQuantity >= 20} className="w-8 h-8 rounded-full font-black hover:bg-ink/10 disabled:opacity-30" aria-label="Increase serving quantity">+</button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddServing}
          disabled={!selectedServing}
          className="mt-3 w-full min-h-[44px] rounded-full bg-ink text-panel text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
        >
          {successMessage ?? "Add This Serving"}
        </button>
      </aside>
      </div>

      {/* 4. Temporary order summary */}
      <div className="w-[min(1100px,calc(100%-48px))] max-sm:w-[calc(100%-24px)] mx-auto z-10 rounded-2xl border border-ink/15 bg-white/70 backdrop-blur-md p-4 max-sm:p-3 shadow-sm">
        <div className="flex max-sm:flex-col max-sm:items-start items-center justify-between gap-1.5 sm:gap-3 mb-2.5">
          <h4 className="text-sm font-black uppercase tracking-wide">Your Order <span className="text-ink/50">· {temporaryOrder.length} {temporaryOrder.length === 1 ? "item" : "items"}</span></h4>
          <strong className="text-sm tabular-nums">Total: {formatRupees(temporaryTotal)}</strong>
        </div>

        {temporaryOrder.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/20 px-3 py-3 text-center text-xs font-semibold text-ink/55">Choose a serving above to start your order.</p>
        ) : (
          <div className="max-h-[190px] overflow-y-auto divide-y divide-ink/10 pr-1">
            {temporaryOrder.map((entry) => (
              <div key={entry.entryId} className="py-2.5 flex max-sm:flex-wrap items-center gap-3 max-sm:gap-2">
                <div className="min-w-0 flex-1 max-sm:basis-full">
                  <p className="text-xs font-black truncate">{entry.flavourName} · {entry.name}</p>
                  <p className="text-[0.68rem] font-semibold text-ink/55">{entry.scoops} scoop{entry.scoops === 1 ? "" : "s"} · {formatRupees(entry.price)} each</p>
                </div>
                <div className="flex items-center rounded-full border border-ink/15 bg-white/75 p-0.5">
                  <button type="button" onClick={() => updateTemporaryQuantity(entry.entryId, -1)} disabled={entry.quantity <= 1} className="w-7 h-7 rounded-full text-xs font-black hover:bg-ink/10 disabled:opacity-30" aria-label={`Decrease ${entry.flavourName} ${entry.name} quantity`}>−</button>
                  <span className="w-7 text-center text-xs font-black tabular-nums">{entry.quantity}</span>
                  <button type="button" onClick={() => updateTemporaryQuantity(entry.entryId, 1)} disabled={entry.quantity >= 20} className="w-7 h-7 rounded-full text-xs font-black hover:bg-ink/10 disabled:opacity-30" aria-label={`Increase ${entry.flavourName} ${entry.name} quantity`}>+</button>
                </div>
                <strong className="w-[82px] text-right text-xs tabular-nums">{formatRupees(entry.price * entry.quantity)}</strong>
                <button type="button" onClick={() => removeTemporaryEntry(entry.entryId)} className="text-[0.68rem] font-black text-red-700 hover:underline" aria-label={`Remove ${entry.flavourName} ${entry.name}`}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={handleAddAllToCart} disabled={temporaryOrder.length === 0} className="mt-3 ml-auto w-full max-w-[300px] max-sm:max-w-none min-h-[44px] rounded-full bg-ink text-panel text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 flex items-center justify-center">
          Add All to Cart
        </button>
      </div>

      {/* 6. Right-side Vertical Progress Scrollbar — syncs with cup index */}
      <div
        className="absolute right-3 max-sm:hidden top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        {/* Track */}
        <div className="relative w-[5px] max-sm:w-[4px] h-[120px] max-sm:h-[90px] rounded-full bg-ink/10 overflow-hidden">
          {/* Thumb — slides down as activeIdx increases */}
          <div
            className="absolute left-0 w-full rounded-full bg-ink/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              height: `${Math.max(18, 100 / FLAVOURS.length)}%`,
              top: `${(activeIdx / (FLAVOURS.length - 1)) * (100 - Math.max(18, 100 / FLAVOURS.length))}%`,
            }}
          />
        </div>
        {/* Counter label */}
        <span className="mt-1 text-[0.58rem] max-sm:text-[0.5rem] font-black tracking-wider text-ink/50 tabular-nums">
          {String(activeIdx + 1).padStart(2, "0")}/{FLAVOURS.length}
        </span>
      </div>
    </section>
  );
}
