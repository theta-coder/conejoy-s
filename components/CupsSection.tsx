"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { useCart } from "@/context/CartContext";

export default function CupsSection() {
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

  // Next and Previous Index (Looping)
  const prevIdx = (activeIdx - 1 + FLAVOURS.length) % FLAVOURS.length;
  const nextIdx = (activeIdx + 1) % FLAVOURS.length;

  const goToPrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + FLAVOURS.length) % FLAVOURS.length);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % FLAVOURS.length);
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

  // Wheel Scroll Handler (throttled 650ms cooldown)
  const lastScrollTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isCentered = rect.top >= -80 && rect.bottom <= window.innerHeight + 80;
      if (!isCentered) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 650) return;

      if (e.deltaY > 40) {
        lastScrollTimeRef.current = now;
        goToNext();
      } else if (e.deltaY < -40) {
        lastScrollTimeRef.current = now;
        goToPrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev]);

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
      if (touchDeltaXRef.current > 0) {
        goToPrev();
      } else {
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
      className="relative min-h-[100svh] py-16 max-md:py-10 flex flex-col justify-between overflow-hidden isolate transition-colors duration-700 ease-custom text-ink"
      aria-label="Cups Collection"
    >
      {/* Background Subtle Accent Pattern */}
      <div
        className="absolute w-[60vw] aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 shadow-[0_0_120px_rgba(255,255,255,0.15)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header Info */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10">
        <p className="kicker mb-2 text-[0.72rem] max-md:text-[0.66rem] font-extrabold tracking-[0.18em] uppercase opacity-80">
          <span className="inline-block w-6 h-[2px] mr-2 bg-current align-middle" aria-hidden="true" />
          CUPS COLLECTION
        </p>
        <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.06em] m-0 font-extrabold">
          Your flavour, served your way.
        </h2>
        <p className="mt-2 text-[0.95rem] max-md:text-[0.84rem] opacity-75 max-w-[480px] mx-auto leading-relaxed">
          Explore all 12 signature flavours in a perfectly chilled cup.
        </p>
      </div>

      {/* Product Carousel Area */}
      <div
        className="relative my-8 max-md:my-4 w-full flex items-center justify-center min-h-[360px] max-md:min-h-[280px] select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label={`Previous cup: ${FLAVOURS[prevIdx].name}`}
          className="absolute left-[6%] max-md:left-2 z-30 w-12 h-12 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink hover:bg-white active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Items Container */}
        <div className="relative w-full max-w-[900px] h-[340px] max-md:h-[260px] flex items-center justify-center">
          {FLAVOURS.map((item, idx) => {
            const isCurrent = idx === activeIdx;
            const isPrev = idx === prevIdx;
            const isNext = idx === nextIdx;

            // Render only current, prev, and next for max performance
            if (!isCurrent && !isPrev && !isNext) return null;

            let positionClasses = "";
            let transformStyle = "";
            let opacity = 0;
            let zIndex = 0;

            if (isCurrent) {
              opacity = 1;
              zIndex = 20;
              transformStyle = "translate3d(0, 0, 0) scale(1) rotate(0deg)";
              positionClasses = "left-1/2 -translate-x-1/2";
            } else if (isPrev) {
              opacity = 0.4;
              zIndex = 10;
              transformStyle = "translate3d(-65%, 0, 0) scale(0.68) rotate(-4deg)";
              positionClasses = "left-1/2 -translate-x-1/2 cursor-pointer";
            } else if (isNext) {
              opacity = 0.4;
              zIndex = 10;
              transformStyle = "translate3d(65%, 0, 0) scale(0.68) rotate(4deg)";
              positionClasses = "left-1/2 -translate-x-1/2 cursor-pointer";
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isPrev) goToPrev();
                  if (isNext) goToNext();
                }}
                style={{
                  opacity,
                  zIndex,
                  transform: transformStyle,
                  transition: "all 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className={`absolute top-0 h-full w-[280px] max-md:w-[200px] flex items-center justify-center ${positionClasses}`}
              >
                {/* White Disc Backdrop for Cup */}
                <div
                  className="absolute w-[240px] max-md:w-[180px] aspect-square rounded-full bg-white/70 backdrop-blur-sm border border-white/80 shadow-[0_20px_60px_rgba(21,21,15,0.12)] -z-10"
                  aria-hidden="true"
                />
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
          aria-label={`Next cup: ${FLAVOURS[nextIdx].name}`}
          className="absolute right-[6%] max-md:right-2 z-30 w-12 h-12 max-md:w-9 max-md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink hover:bg-white active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg className="w-5 h-5 max-md:w-4 max-md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Info & Action Panel */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex flex-col items-center gap-4 z-10">
        {/* Flavour Title & Details */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-ink/10 text-[0.7rem] font-extrabold tracking-wider uppercase mb-1">
            {activeFlavour.indexLabel}
          </span>
          <h3 className="text-2xl max-md:text-xl font-black uppercase tracking-tight m-0">{activeFlavour.name}</h3>
          <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-0.5">Single Scoop</p>
        </div>

        {/* Quantity Controls + Add to Cart Button */}
        <div className="flex max-sm:flex-col items-center gap-3 w-full max-w-[380px]">
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
        <div className="flex items-center gap-1.5 mt-2">
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
