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
  const [selectedServingIndex, setSelectedServingIndex] = useState(0);
  const [servingQuantity, setServingQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [upsellHint, setUpsellHint] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Touch refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIdxRef = useRef(0);
  const lastWheelNavigationRef = useRef(0);
  const upsellTimerRef = useRef<number | null>(null);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const selectedServing = SERVING_OPTIONS[selectedServingIndex];
  const selectedServingTotal = selectedServing.price * servingQuantity;

  useEffect(() => {
    if (selectedIndex === undefined) return;
    const nextIndex = Math.max(0, Math.min(FLAVOURS.length - 1, selectedIndex));
    activeIdxRef.current = nextIndex;
    setActiveIdx(nextIndex);
  }, [selectedIndex, selectionRequestKey]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => () => {
    if (upsellTimerRef.current !== null) window.clearTimeout(upsellTimerRef.current);
  }, []);

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

  const handleServingTierChange = (direction: -1 | 1) => {
    const nextIndex = Math.max(0, Math.min(SERVING_OPTIONS.length - 1, selectedServingIndex + direction));
    if (nextIndex === selectedServingIndex) return;

    const currentServing = SERVING_OPTIONS[selectedServingIndex];
    const nextServing = SERVING_OPTIONS[nextIndex];
    setSelectedServingIndex(nextIndex);

    if (upsellTimerRef.current !== null) window.clearTimeout(upsellTimerRef.current);
    if (direction === 1) {
      const extraScoops = nextServing.scoops - currentServing.scoops;
      const extraPrice = nextServing.price - currentServing.price;
      const isBetterValue = nextServing.price / nextServing.scoops < currentServing.price / currentServing.scoops;
      setUpsellHint(
        `+${extraScoops} scoop${extraScoops === 1 ? "" : "s"} for ${formatRupees(extraPrice)} more${isBetterValue ? " · better value" : ""}`
      );
      upsellTimerRef.current = window.setTimeout(() => setUpsellHint(null), 2500);
    } else {
      setUpsellHint(null);
    }
  };

  const handleAddServing = () => {
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

      <aside className="relative z-30 w-[min(920px,calc(100%-24px))] mx-auto rounded-[22px] border border-ink/15 bg-white/[0.82] backdrop-blur-md shadow-[0_18px_55px_rgba(21,21,15,0.12)] px-6 py-5 max-sm:p-4" aria-labelledby="serving-heading">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 id="serving-heading" className="text-[0.78rem] font-black uppercase tracking-[0.1em]">Choose your serving</h4>
            <p className="mt-1 text-[0.74rem] font-semibold text-ink/55">All scoops will be {activeFlavour.name}</p>
          </div>
          <span className="pt-0.5 text-[0.7rem] font-black tabular-nums text-ink/45" aria-live="polite">
            {selectedServingIndex + 1} / {SERVING_OPTIONS.length}
          </span>
        </div>

        <div className="mt-4 grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="grid grid-cols-[48px_minmax(0,1fr)_48px] items-center gap-4">
            <button
              type="button"
              onClick={() => handleServingTierChange(-1)}
              disabled={selectedServingIndex === 0}
              aria-label={
                selectedServingIndex > 0
                  ? `Select smaller serving: ${SERVING_OPTIONS[selectedServingIndex - 1].name}, ${SERVING_OPTIONS[selectedServingIndex - 1].scoops} scoops`
                  : "Small Cup is the smallest serving"
              }
              className="w-12 h-12 rounded-full border border-ink/20 bg-transparent text-xl font-black text-ink transition-[transform,background-color,opacity] hover:bg-ink/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2"
            >
              −
            </button>

            <div className="min-w-0 text-center" aria-live="polite" aria-atomic="true">
              <strong className="block truncate font-display text-[clamp(1.2rem,2.2vw,1.55rem)] font-black tracking-[-0.03em] text-ink">
                {selectedServing.name}
              </strong>
              <span className="mt-0.5 block text-[0.72rem] font-black uppercase tracking-[0.12em] text-ink/50">
                {selectedServing.scoops} Scoops
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleServingTierChange(1)}
              disabled={selectedServingIndex === SERVING_OPTIONS.length - 1}
              aria-label={
                selectedServingIndex < SERVING_OPTIONS.length - 1
                  ? `Select larger serving: ${SERVING_OPTIONS[selectedServingIndex + 1].name}, ${SERVING_OPTIONS[selectedServingIndex + 1].scoops} scoops`
                  : "Family Pack is the largest serving"
              }
              className="w-12 h-12 rounded-full border border-ink/20 bg-transparent text-xl font-black text-ink transition-[transform,background-color,opacity] hover:bg-ink/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2"
            >
              +
            </button>
            </div>

            <div className="mt-2 min-h-[1.1rem] text-center text-[0.7rem] font-bold text-ink/55" aria-live="polite" aria-atomic="true">
              {upsellHint ?? "\u00a0"}
            </div>
          </div>

          <div className="min-w-[190px] text-center md:border-l md:border-ink/10 md:pl-6">
            <div className="flex items-baseline justify-center gap-2">
              <strong className="font-display text-[1.65rem] font-black tracking-[-0.04em] leading-none">
                {formatRupees(selectedServing.price)}
              </strong>
              <span className="text-[0.72rem] font-bold line-through text-ink/35">{formatRupees(selectedServing.originalPrice)}</span>
            </div>
            <p className="mt-2 text-[0.7rem] font-black text-green-800">You save {formatRupees(selectedServing.saving)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-ink/10 pt-4 max-sm:flex-col max-sm:items-stretch">
          <div className="flex items-center justify-between gap-3 max-sm:w-full">
            <span className="text-[0.7rem] font-black uppercase tracking-[0.08em] text-ink/50">Quantity</span>
            <div className="flex items-center rounded-full border border-ink/20 bg-white/85 p-1 shadow-sm">
              <button type="button" onClick={() => handleServingQuantityChange(-1)} disabled={servingQuantity <= 1} className="w-9 h-9 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Decrease serving quantity">−</button>
              <span className="w-10 text-center text-sm font-black tabular-nums" aria-live="polite">{servingQuantity}</span>
              <button type="button" onClick={() => handleServingQuantityChange(1)} disabled={servingQuantity >= 20} className="w-9 h-9 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Increase serving quantity">+</button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddServing}
            className="min-h-[48px] flex-1 rounded-full bg-ink px-6 text-panel text-[0.8rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            {successMessage ?? `Add to Cart · ${formatRupees(selectedServingTotal)}`}
          </button>
        </div>
      </aside>
      </div>
    </section>
  );
}
