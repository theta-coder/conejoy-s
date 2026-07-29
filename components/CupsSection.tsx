"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { useCart } from "@/context/CartContext";

interface CupsSectionProps {
  selectedIndex?: number;
  selectionRequestKey?: number;
}

interface ServingOption {
  id: string;
  name: string;
  scoops: number;
  price: number;
  originalPrice: number;
  saving: number;
}

const SERVING_OPTIONS: ServingOption[] = [
  { id: "small-cup", name: "Small Cup", scoops: 2, price: 160, originalPrice: 200, saving: 40 },
  { id: "medium-cup", name: "Medium Cup", scoops: 3, price: 220, originalPrice: 300, saving: 80 },
  { id: "large-cup", name: "Large Cup", scoops: 4, price: 290, originalPrice: 400, saving: 110 },
  { id: "small-pack", name: "Small Pack", scoops: 6, price: 420, originalPrice: 600, saving: 180 },
  { id: "family-pack", name: "Family Pack", scoops: 12, price: 820, originalPrice: 1200, saving: 380 },
];

const formatRupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

export default function CupsSection({ selectedIndex, selectionRequestKey }: CupsSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedServingId, setSelectedServingId] = useState<string | null>(null);
  const [servingQuantity, setServingQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Touch refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const servingCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdxRef = useRef(0);
  const lastWheelNavigationRef = useRef(0);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const selectedServing = SERVING_OPTIONS.find((option) => option.id === selectedServingId) ?? null;
  const selectedServingPosition = selectedServing
    ? SERVING_OPTIONS.findIndex((option) => option.id === selectedServing.id) + 1
    : 0;
  const selectedServingTotal = selectedServing ? selectedServing.price * servingQuantity : 0;

  useEffect(() => {
    if (selectedIndex === undefined) return;
    const nextIndex = Math.max(0, Math.min(FLAVOURS.length - 1, selectedIndex));
    activeIdxRef.current = nextIndex;
    setActiveIdx(nextIndex);
  }, [selectedIndex, selectionRequestKey]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    if (!selectedServingId || typeof window === "undefined" || window.innerWidth >= 768) return;
    const selectedIndex = SERVING_OPTIONS.findIndex((option) => option.id === selectedServingId);
    if (selectedIndex < 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    servingCardRefs.current[selectedIndex]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedServingId]);

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

  const handleServingKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(SERVING_OPTIONS.length - 1, index + direction));
    setSelectedServingId(SERVING_OPTIONS[nextIndex].id);
    servingCardRefs.current[nextIndex]?.focus();
  };

  const handleAddServing = () => {
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

      <div className="my-4 max-sm:my-2.5 w-[min(1100px,calc(100%-48px))] max-md:w-full mx-auto grid grid-cols-1 items-center gap-3">
      {/* 3. Cup Carousel Stage (HORIZONTAL MOTION TRANSITION) */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[clamp(280px,36svh,400px)] max-md:min-h-[clamp(190px,29svh,270px)] max-sm:min-h-[clamp(170px,28svh,230px)] select-none">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={goToPrev}
          disabled={activeIdx === 0}
          aria-label={prevIdx !== null ? `Previous cup: ${FLAVOURS[prevIdx].name}` : "First cup reached"}
          className={`absolute left-4 max-md:left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
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
          className={`absolute right-4 max-md:right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeIdx === FLAVOURS.length - 1
              ? "opacity-25 pointer-events-none"
              : "hover:bg-white active:scale-95 cursor-pointer"
          }`}
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Active Flavour Name directly below Cup */}
        <div className="mt-3 max-sm:mt-2 text-center z-10 transition-all duration-200">
          <h3 className="font-display text-[clamp(1.3rem,2.8vw,2.1rem)] max-sm:text-[clamp(1.1rem,4.8vw,1.6rem)] font-black uppercase tracking-tight m-0 text-ink leading-tight">
            {activeFlavour.name}
          </h3>
        </div>
      </div>

      <aside className="relative z-30 w-[min(1120px,calc(100%-24px))] mx-auto rounded-[22px] border border-ink/15 bg-white/[0.78] backdrop-blur-md shadow-[0_18px_55px_rgba(21,21,15,0.12)] p-6 max-lg:p-5 max-sm:p-4" aria-labelledby="serving-heading">
        <div className="flex items-start justify-between gap-3 mb-5 max-sm:mb-4">
          <div>
            <h4 id="serving-heading" className="text-[0.86rem] max-sm:text-[0.8rem] font-black uppercase tracking-[0.08em]">Choose your serving</h4>
            <p className="text-[0.76rem] max-sm:text-[0.7rem] font-semibold text-ink/60 mt-1">All scoops will be {activeFlavour.name}</p>
          </div>
          <span className="text-[0.68rem] max-sm:text-[0.62rem] font-black rounded-full border border-ink/10 bg-ink/10 px-3 py-1.5 whitespace-nowrap">
            {selectedServing ? `${selectedServing.name} selected` : "Select one"}
          </span>
        </div>

        <div className="flex md:grid md:grid-cols-3 xl:grid-cols-6 gap-3 max-sm:gap-2.5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2 md:pb-0 pr-8 md:pr-0 scroll-px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Cup serving options">
          {SERVING_OPTIONS.map((option, optionIndex) => {
            const isSelected = selectedServingId === option.id;
            return (
              <button
                key={option.id}
                ref={(element) => {
                  servingCardRefs.current[optionIndex] = element;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedServingId(option.id)}
                onKeyDown={(event) => handleServingKeyDown(event, optionIndex)}
                className={`relative min-h-[148px] min-w-[78vw] max-w-[300px] flex-none md:min-w-0 md:max-w-none snap-start rounded-2xl border-2 p-4 max-lg:p-3.5 text-left flex flex-col cursor-pointer transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2 active:scale-[0.98] ${
                  isSelected
                    ? "border-ink bg-white/95 text-ink shadow-[0_10px_26px_rgba(21,21,15,0.14)] scale-[1.01]"
                    : "border-ink/12 bg-white/60 text-ink shadow-sm hover:-translate-y-0.5 hover:border-ink/40 hover:bg-white/85 hover:shadow-md"
                }`}
              >
                <span className="block pr-7 text-[0.9rem] max-lg:text-[0.84rem] font-black leading-tight">{option.name}</span>
                <span className="block mt-2 text-[0.72rem] font-bold text-ink/55">
                  {option.scoops} scoop{option.scoops === 1 ? "" : "s"}
                </span>
                <span className="mt-auto pt-4">
                  <span className="block text-[1.08rem] font-black leading-none">{formatRupees(option.price)}</span>
                  {option.saving > 0 && (
                    <span className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[0.7rem] line-through text-ink/40">{formatRupees(option.originalPrice)}</span>
                      <span className="rounded-full px-2 py-1 text-[0.64rem] font-black bg-green-700 text-white leading-none">
                        Save {formatRupees(option.saving)}
                      </span>
                    </span>
                  )}
                </span>
                {isSelected && <span className="absolute right-3 top-3 w-6 h-6 rounded-full bg-ink text-panel text-xs font-black flex items-center justify-center shadow-sm" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="hidden max-sm:block mt-2 text-center text-[0.66rem] font-black text-ink/50" aria-live="polite">
          {selectedServing ? `${selectedServingPosition} of ${SERVING_OPTIONS.length}` : `Swipe to explore · ${SERVING_OPTIONS.length} options`}
        </div>

        <div className="mt-5 max-sm:mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[0.68rem] font-black uppercase tracking-[0.08em] text-ink/50">Selected serving</span>
            <strong className="block mt-1 text-[0.84rem] max-sm:text-[0.76rem] truncate">
              {selectedServing
                ? `${selectedServing.name} · ${selectedServing.scoops} scoop${selectedServing.scoops === 1 ? "" : "s"}`
                : "Choose a size above"}
            </strong>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-black max-sm:hidden">Quantity</span>
            <div className="flex items-center rounded-full border border-ink/20 bg-white/85 p-1 shadow-sm">
              <button type="button" onClick={() => handleServingQuantityChange(-1)} disabled={servingQuantity <= 1} className="w-9 h-9 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Decrease serving quantity">−</button>
              <span className="w-10 text-center text-sm font-black tabular-nums" aria-live="polite">{servingQuantity}</span>
              <button type="button" onClick={() => handleServingQuantityChange(1)} disabled={servingQuantity >= 20} className="w-9 h-9 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Increase serving quantity">+</button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddServing}
          disabled={!selectedServing}
          className="mt-3 w-full min-h-[48px] rounded-full bg-ink text-panel text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55 disabled:shadow-none"
        >
          {successMessage ?? (selectedServing ? `Add to Cart · ${formatRupees(selectedServingTotal)}` : "Select a serving first")}
        </button>
      </aside>
      </div>
    </section>
  );
}
