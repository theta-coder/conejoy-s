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

  // Touch and drag refs
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeFlavour: FlavourItem = FLAVOURS[activeIdx];
  const currentQuantity = quantities[activeFlavour.id] || 1;

  useEffect(() => {
    if (selectedIndex === undefined) return;
    setActiveIdx(Math.max(0, Math.min(FLAVOURS.length - 1, selectedIndex)));
  }, [selectedIndex]);

  // Next and Previous Index (Bounded, non-looping)
  const prevIdx = activeIdx > 0 ? activeIdx - 1 : null;
  const nextIdx = activeIdx < FLAVOURS.length - 1 ? activeIdx + 1 : null;

  const goToPrev = useCallback(() => {
    setActiveIdx((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIdx((prev) => Math.min(FLAVOURS.length - 1, prev + 1));
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

  // Keyboard Navigation (Left / Right Arrows) when in Section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if section is visible in viewport
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

  // Wheel Scroll Handler (Pin wheel in Cups until 1st cup is reached scrolling UP, or last cup scrolling DOWN)
  const lastScrollTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top <= 120 && rect.bottom >= window.innerHeight - 120;
      if (!isVisible) return;

      const delta = e.deltaY;

      if (delta < -20 && activeIdx > 0) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTimeRef.current >= 450) {
          lastScrollTimeRef.current = now;
          goToPrev();
        }
      } else if (delta > 20 && activeIdx < FLAVOURS.length - 1) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTimeRef.current >= 450) {
          lastScrollTimeRef.current = now;
          goToNext();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev, activeIdx]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaXRef.current) > 40) {
      if (touchDeltaXRef.current > 0 && activeIdx > 0) {
        goToPrev();
      } else if (touchDeltaXRef.current < 0 && activeIdx < FLAVOURS.length - 1) {
        goToNext();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  return (
    <section
      ref={sectionRef}
      id="cups"
      style={{ backgroundColor: activeFlavour.color }}
      className="relative min-h-[100svh] pt-[126px] max-md:pt-[110px] max-sm:pt-[102px] pb-12 max-md:pb-8 flex flex-col items-center justify-center overflow-hidden isolate transition-colors duration-700 ease-custom text-ink"
      aria-label="Cups Collection"
    >
      {/* 1. Header Info (Heading + Description) */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10">
        <p className="kicker mb-1 text-[0.72rem] max-md:text-[0.66rem] font-extrabold tracking-[0.18em] uppercase opacity-80">
          <span className="inline-block w-6 h-[2px] mr-2 bg-current align-middle" aria-hidden="true" />
          CUPS COLLECTION
        </p>
        <h2 className="font-display text-[clamp(1.8rem,3.6vw,3.2rem)] max-sm:text-[clamp(1.5rem,6.5vw,2rem)] leading-[0.95] tracking-[-0.06em] m-0 font-extrabold">
          Your flavour, served your way.
        </h2>
        <p className="mt-3.5 max-sm:mt-3 text-[0.9rem] max-md:text-[0.78rem] max-sm:text-[0.72rem] opacity-75 max-w-[480px] mx-auto leading-relaxed">
          Explore all 12 signature flavours in a perfectly chilled cup.
        </p>
      </div>

      {/* 2. Flavour Counter & Prominent Flavour Name */}
      <div className="mt-4 max-sm:mt-3 flex flex-col items-center justify-center text-center z-10 transition-all duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink/10 text-[0.72rem] max-sm:text-[0.66rem] font-black tracking-widest uppercase">
          <span>{activeFlavour.indexLabel}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
          <span>Single Scoop</span>
        </div>
        <h3 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] max-sm:text-[clamp(1.8rem,7.5vw,2.8rem)] font-black uppercase tracking-tight m-0 mt-3.5 max-sm:mt-2.5 text-ink leading-tight">
          {activeFlavour.name}
        </h3>
      </div>

      {/* 3. Carousel Stage Container */}
      <div
        className="relative my-6 max-sm:my-4 w-full max-w-[1100px] mx-auto flex items-center justify-center min-h-[clamp(330px,42svh,480px)] max-md:min-h-[clamp(250px,36svh,320px)] select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={goToPrev}
          disabled={activeIdx === 0}
          aria-label={prevIdx !== null ? `Previous cup: ${FLAVOURS[prevIdx].name}` : "First cup reached"}
          className={`absolute left-4 max-md:left-2 z-30 w-12 h-12 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeIdx === 0
              ? "opacity-25 pointer-events-none"
              : "hover:bg-white active:scale-95 cursor-pointer"
          }`}
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Items Viewport Stage */}
        <div className="relative w-full h-[clamp(330px,42svh,480px)] max-md:h-[clamp(250px,36svh,320px)] flex items-center justify-center">
          {/* White Halo Centered EXACTLY behind the Active Center Cup */}
          <div
            className="absolute w-[clamp(280px,24vw,390px)] max-md:w-[clamp(200px,60vw,270px)] aspect-square rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_20px_60px_rgba(21,21,15,0.1)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
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
              // Exact center anchor: left: 50%, top: 50%, translate(-50%, -50%) scale(1)
              transformStyle = "translate(-50%, -50%) scale(1) rotate(0deg)";
            } else if (isPrev) {
              opacity = 0.32;
              zIndex = 10;
              // Pixel/viewport-based horizontal offset from true center
              transformStyle =
                typeof window !== "undefined" && window.innerWidth <= 640
                  ? "translate(-50%, -50%) translateX(clamp(-260px, -62vw, -180px)) scale(0.58) rotate(-3deg)"
                  : "translate(-50%, -50%) translateX(clamp(-420px, -28vw, -280px)) scale(0.62) rotate(-3deg)";
            } else if (isNext) {
              opacity = 0.32;
              zIndex = 10;
              // Pixel/viewport-based horizontal offset from true center
              transformStyle =
                typeof window !== "undefined" && window.innerWidth <= 640
                  ? "translate(-50%, -50%) translateX(clamp(180px, 62vw, 260px)) scale(0.58) rotate(3deg)"
                  : "translate(-50%, -50%) translateX(clamp(280px, 28vw, 420px)) scale(0.62) rotate(3deg)";
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
                className={`w-[clamp(340px,26vw,460px)] max-md:w-[clamp(230px,72vw,310px)] h-full flex items-center justify-center ${
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
          className={`absolute right-4 max-md:right-2 z-30 w-12 h-12 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
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

      {/* 4. Bottom Action Panel (Quantity Control + Add to Cart + Progress Dots) */}
      <div className="mt-5 max-sm:mt-4 w-[min(1100px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex flex-col items-center justify-center gap-4 max-sm:gap-3 z-10">
        {/* Quantity Controls + Add to Cart Button Row */}
        <div className="flex max-sm:flex-col items-center justify-center gap-3 w-full max-w-[380px]">
          {/* Quantity Modifier */}
          <div className="flex items-center justify-between px-3 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[rgba(21,21,15,0.18)] shadow-sm w-[130px] max-sm:w-full">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={currentQuantity <= 1}
              aria-label={`Decrease ${activeFlavour.name} quantity`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-base font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              −
            </button>
            <span className="text-base font-black tabular-nums">{currentQuantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={currentQuantity >= 10}
              aria-label={`Increase ${activeFlavour.name} quantity`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-base font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 w-full min-h-[48px] px-6 rounded-full font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] ${
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

        {/* Carousel Dots Indicator */}
        <div className="mt-3.5 max-sm:mt-3 flex items-center justify-center gap-1.5">
          {FLAVOURS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`Go to ${item.name} cup`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIdx ? "w-6 bg-ink opacity-100" : "w-2 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
