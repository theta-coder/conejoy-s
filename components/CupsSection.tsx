"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { useCart } from "@/context/CartContext";

interface CupsSectionProps {
  selectedIndex?: number;
}

export default function CupsSection({ selectedIndex }: CupsSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // Touch refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIdxRef = useRef(0);
  const wheelGestureActiveRef = useRef(false);
  const wheelGestureEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const currentQuantity = quantities[activeFlavour.id] || 1;

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



  const handleQuantityChange = (delta: number) => {
    setQuantities((prev) => {
      const current = prev[activeFlavour.id] || 1;
      const nextQty = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [activeFlavour.id]: nextQty };
    });
  };

  const handleAddToCart = () => {
    addToCart({
      type: "Cup",
      flavour: activeFlavour.name,
      quantity: currentQuantity,
      size: "Single Scoop",
      image: activeFlavour.cupImageSrc,
      color: activeFlavour.color,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
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

  // Desktop Wheel Scroll Handler
  useEffect(() => {
    const scheduleGestureEnd = () => {
      if (wheelGestureEndTimerRef.current) {
        clearTimeout(wheelGestureEndTimerRef.current);
      }

      wheelGestureEndTimerRef.current = setTimeout(() => {
        wheelGestureActiveRef.current = false;
        wheelGestureEndTimerRef.current = null;
      }, 180);
    };

    const handleWheel = (e: WheelEvent) => {
      if ((window as any).__BYPASS_CUPS_LOCK__) return;

      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Only take over the wheel while the Cups product stage is the active screen.
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      if (visibleHeight < Math.min(rect.height, window.innerHeight) * 0.55) return;

      const currentIndex = activeIdxRef.current;
      if (Math.abs(e.deltaY) < 0.5) return;
      const direction: -1 | 1 = e.deltaY > 0 ? 1 : -1;

      // Momentum from a gesture that already changed a cup must never move the page.
      if (wheelGestureActiveRef.current) {
        if (e.cancelable) e.preventDefault();
        scheduleGestureEnd();
        return;
      }

      const leavingAtFirstCup = direction === -1 && currentIndex === 0;
      const leavingAtLastCup = direction === 1 && currentIndex === FLAVOURS.length - 1;

      // Normal page scrolling is released only when a fresh gesture starts at a boundary.
      if (leavingAtFirstCup || leavingAtLastCup) {
        scheduleGestureEnd();
        return;
      }

      // Prevent the page itself from moving while there are more cups in this direction.
      if (e.cancelable) e.preventDefault();
      scheduleGestureEnd();

      // A burst of wheel/trackpad events is one gesture and may change only one cup.
      wheelGestureActiveRef.current = true;

      if (direction === 1) goToNext();
      else goToPrev();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelGestureEndTimerRef.current) {
        clearTimeout(wheelGestureEndTimerRef.current);
        wheelGestureEndTimerRef.current = null;
      }
    };
  }, [goToNext, goToPrev]);

  // Mobile / Tablet Horizontal Touch Swipe Handler
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
        touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
        touchDeltaYRef.current = e.touches[0].clientY - touchStartYRef.current;

        const absX = Math.abs(touchDeltaXRef.current);
        const absY = Math.abs(touchDeltaYRef.current);

        // Prevent page scroll when user is intentionally swiping horizontally left/right across cups
        if (absX > absY && absX > 20) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      const absX = Math.abs(touchDeltaXRef.current);
      const absY = Math.abs(touchDeltaYRef.current);

      if (absX > 30 && absX > absY) {
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
      className="relative min-h-[calc(100dvh-var(--header-height,126px))] pt-8 max-md:pt-6 max-sm:pt-5 pb-6 max-md:pb-4 flex flex-col items-center justify-center overflow-hidden isolate transition-colors duration-700 ease-custom text-ink"
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
      <div className="mt-3 max-sm:mt-2 flex flex-col items-center justify-center text-center z-10 transition-all duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink/10 text-[0.72rem] max-sm:text-[0.66rem] font-black tracking-widest uppercase">
          <span>{activeFlavour.indexLabel}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
          <span>Single Scoop</span>
        </div>
        <h3 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] max-sm:text-[clamp(1.5rem,5.8vw,2.3rem)] font-black uppercase tracking-tight m-0 mt-2 max-sm:mt-1.5 text-ink leading-tight whitespace-nowrap">
          {activeFlavour.name}
        </h3>
      </div>

      {/* 3. Cup Carousel Stage (HORIZONTAL MOTION TRANSITION) */}
      <div className="relative my-4 max-sm:my-3 w-full max-w-[1100px] mx-auto flex items-center justify-center min-h-[clamp(280px,36svh,400px)] max-md:min-h-[clamp(210px,32svh,290px)] select-none">
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
        <div className="relative w-full h-[clamp(280px,36svh,400px)] max-md:h-[clamp(210px,32svh,290px)] flex items-center justify-center">
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
                  transition: "all 650ms cubic-bezier(0.22, 1, 0.36, 1)",
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
                  loading={isCurrent ? "eager" : "lazy"}
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_20px_rgba(40,30,15,0.22)] transition-transform duration-300"
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

      {/* 4. Quantity Selector and Add to Cart Button */}
      <div className="mt-3 max-sm:mt-2 w-[min(1100px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex flex-col items-center justify-center gap-3 max-sm:gap-2.5 z-10">
        <div className="flex max-sm:flex-col items-center justify-center gap-3 w-full max-w-[380px]">
          {/* Quantity Modifier */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[rgba(21,21,15,0.18)] shadow-sm w-[130px] max-sm:w-full">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={currentQuantity <= 1}
              aria-label={`Decrease ${activeFlavour.name} quantity`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-base font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              −
            </button>
            <span className="text-base font-black tabular-nums">{currentQuantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={currentQuantity >= 10}
              aria-label={`Increase ${activeFlavour.name} quantity`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-base font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 w-full min-h-[46px] px-6 rounded-full font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isAdded
                ? "bg-green-700 text-white shadow-green-700/30 scale-[1.02]"
                : "bg-ink text-panel hover:opacity-95"
            }`}
          >
            {isAdded ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Added ✓</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* 5. Carousel Progress Tiles Indicator */}
        <div className="mt-3.5 max-sm:mt-3 flex items-center justify-center gap-1.5">
          {FLAVOURS.map((item, idx) => (
            <div key={item.id} className="group relative flex flex-col items-center">
              {/* Tooltip Label on Hover */}
              <span className="pointer-events-none absolute bottom-full mb-2 px-2.5 py-1 rounded-lg bg-ink text-panel text-[0.7rem] max-sm:text-[0.62rem] font-black tracking-wide uppercase whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 ease-custom shadow-lg z-40">
                {item.name}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-ink" />
              </span>
              <button
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to ${item.name} cup`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIdx
                    ? "w-[36px] bg-ink opacity-100 shadow-sm scale-105"
                    : "w-[18px] bg-ink/30 hover:bg-ink/75 hover:scale-110"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Completion Badge on 12th Cup */}
        {activeIdx === FLAVOURS.length - 1 && (
          <div className="mt-2 text-[0.7rem] max-sm:text-[0.64rem] font-black tracking-widest uppercase opacity-80 animate-badge-pop flex items-center gap-1.5 bg-ink/10 text-ink px-4 py-1 rounded-full shadow-sm">
            <svg className="w-3.5 h-3.5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>All 12 Cups Explored</span>
          </div>
        )}
      </div>

      {/* 6. Right-side Vertical Progress Scrollbar — syncs with cup index */}
      <div
        className="absolute right-3 max-sm:right-1.5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        {/* Track */}
        <div className="relative w-[5px] max-sm:w-[4px] h-[120px] max-sm:h-[90px] rounded-full bg-ink/10 overflow-hidden">
          {/* Thumb — slides down as activeIdx increases */}
          <div
            className="absolute left-0 w-full rounded-full bg-ink/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
