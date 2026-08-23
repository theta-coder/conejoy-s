"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { FLAVOURS } from "@/data/flavours";

type ShakeSize = "Regular" | "Large";

interface ShakeLabProps {
  selectedIndex?: number;
  selectionRequestKey?: number;
}

interface ShakeFlavour {
  id: string;
  name: string;
  note: string;
  image: string;
  fallback: string;
  accent: string;
}

const SHAKE_NOTES: Record<string, string> = {
  mango: "Golden mango, cream, pistachio finish",
  kulfa: "Cardamom kulfa, almond, pistachio",
  chocolate: "Deep cocoa, chocolate chips, cream",
  blueberry: "Black currant, berry ribbon, cream",
  "caramel-crunch": "Caramel ribbon, golden crunch, cream",
  "tutti-frutti": "Fruit cream, candied fruit, soft vanilla",
  "coffee-chino": "Espresso, ice cream, roasted coffee crumb",
  pistachio: "Pistachio cream, fine nut finish",
  vanilla: "Vanilla bean, chilled cream, soft whip",
  strawberry: "Strawberry cream, berry ribbon, fruit crumb",
  "coconut-delight": "Coconut cream, toasted coconut finish",
  "kit-kat": "Milk chocolate, wafer crunch, cocoa ribbon",
};

const SHAKE_FILE_IDS: Record<string, string> = {
  chocolate: "chocolate-chip",
  blueberry: "black-currant",
  pistachio: "pista",
};

const SHAKES: ShakeFlavour[] = FLAVOURS.map((flavour) => {
  const fileId = SHAKE_FILE_IDS[flavour.id] ?? flavour.id;
  return {
    id: flavour.id,
    name: flavour.name,
    note: SHAKE_NOTES[flavour.id],
    image: `/assets/shakes/${fileId}.webp`,
    fallback: `/assets/shakes/${fileId}.png`,
    accent: flavour.color,
  };
});

const SIZES: Record<ShakeSize, { volume: string; price: number; originalPrice: number }> = {
  Regular: { volume: "12 oz", price: 420, originalPrice: 520 },
  Large: { volume: "16 oz", price: 520, originalPrice: 650 },
};

const formatRupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

export default function ShakeLab({ selectedIndex, selectionRequestKey }: ShakeLabProps) {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState<ShakeSize>("Regular");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const touchDeltaYRef = useRef(0);

  const activeShake = SHAKES[activeIndex];
  const prevIdx = activeIndex > 0 ? activeIndex - 1 : null;
  const nextIdx = activeIndex < SHAKES.length - 1 ? activeIndex + 1 : null;
  const activeSize = SIZES[size];
  const total = activeSize.price * quantity;
  const saving = (activeSize.originalPrice - activeSize.price) * quantity;

  useEffect(() => {
    if (selectedIndex === undefined) return;
    setActiveIndex(Math.max(0, Math.min(SHAKES.length - 1, selectedIndex)));
  }, [selectedIndex, selectionRequestKey]);

  // Match the page canvas to the active pour, so the area beside the page and
  // the mobile overscroll never show a colour that clashes with the section.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-accent", activeShake.accent);
    return () => {
      root.style.removeProperty("--page-accent");
    };
  }, [activeShake.accent]);

  const goToPrev = useCallback(() => {
    setActiveIndex((current) => Math.max(0, current - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => Math.min(SHAKES.length - 1, current + 1));
  }, []);

  // Keyboard navigation, only while the section is on screen.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Horizontal swipe on the stage. Listeners stay passive; `touch-action: pan-y`
  // lets the browser own vertical scrolling.
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.closest("aside, button, input, a, [role='radiogroup']")) {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        return;
      }
      touchStartXRef.current = event.touches[0].clientX;
      touchStartYRef.current = event.touches[0].clientY;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;
      touchDeltaXRef.current = event.touches[0].clientX - touchStartXRef.current;
      touchDeltaYRef.current = event.touches[0].clientY - touchStartYRef.current;
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
  }, [goToNext, goToPrev]);

  const handleAdd = () => {
    addToCart({
      type: "Shake",
      flavourId: activeShake.id,
      flavour: activeShake.name,
      quantity,
      size,
      servingId: `${activeShake.id}-${size.toLowerCase()}`,
      unitPrice: activeSize.price,
      originalPrice: activeSize.originalPrice,
      saving: activeSize.originalPrice - activeSize.price,
      image: activeShake.image,
      color: activeShake.accent,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

  return (
    <section
      ref={sectionRef}
      id="shakes"
      className="shake-lab relative min-h-[calc(100dvh-var(--header-height,126px))] pt-5 max-md:pt-4 max-sm:pt-3 pb-4 max-md:pb-3 flex flex-col items-center justify-center overflow-x-hidden isolate text-ink transition-colors duration-[380ms] ease-custom touch-pan-y"
      style={{ "--shake-accent": activeShake.accent } as React.CSSProperties}
      aria-label="Shakes Collection"
    >
      {/* 1. Collection heading */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10">
        <p className="kicker mb-1 text-[0.72rem] max-md:text-[0.7rem] font-extrabold tracking-[0.18em] uppercase opacity-80">
          <span className="inline-block w-6 h-[2px] mr-2 bg-current align-middle" aria-hidden="true" />
          SHAKES COLLECTION
        </p>
        <h2 className="max-sm:hidden font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[0.95] tracking-[-0.06em] m-0 font-extrabold">
          Blended cold, poured your way.
        </h2>
        <p className="mt-2 max-sm:hidden text-[0.86rem] max-md:text-[0.8rem] opacity-75 max-w-[460px] mx-auto leading-relaxed">
          All 12 signature flavours, hand-blended to order.
        </p>
      </div>

      <div className="my-3 max-sm:my-2 w-[min(1100px,calc(100%-48px))] xl:w-[min(1560px,calc(100%-72px))] max-md:w-full mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 xl:gap-9 max-xl:flex max-xl:flex-col max-xl:flex-1 max-xl:min-h-0 max-xl:w-full">
        {/* 2. Shake carousel stage */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[clamp(200px,30svh,360px)] xl:min-h-[clamp(320px,54svh,560px)] max-xl:flex-1 max-xl:min-h-[clamp(170px,30svh,420px)] select-none">
          <button
            type="button"
            onClick={goToPrev}
            disabled={activeIndex === 0}
            aria-label={prevIdx !== null ? `Previous shake: ${SHAKES[prevIdx].name}` : "First shake reached"}
            className={`${arrowClass} left-4 max-md:left-2 ${
              activeIndex === 0 ? "opacity-25 pointer-events-none" : "hover:bg-white active:scale-95 cursor-pointer"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative w-full h-[clamp(200px,30svh,360px)] xl:h-[clamp(320px,54svh,560px)] max-xl:h-auto max-xl:flex-1 max-xl:min-h-0 max-xl:max-h-[calc(100vw-116px)] flex items-center justify-center">
            {SHAKES.map((shake, idx) => {
              const isCurrent = idx === activeIndex;
              const isPrev = idx === prevIdx;
              const isNext = idx === nextIdx;

              // Only the visible three are mounted, same as the cups carousel.
              if (!isCurrent && !isPrev && !isNext) return null;

              let transform = "translate(-50%, -50%) scale(1)";
              let opacity = 1;
              let zIndex = 20;

              if (isPrev) {
                transform = "translate(-50%, -50%) translateX(-104%) scale(0.62) rotate(-4deg)";
                opacity = 0.22;
                zIndex = 10;
              } else if (isNext) {
                transform = "translate(-50%, -50%) translateX(104%) scale(0.62) rotate(4deg)";
                opacity = 0.22;
                zIndex = 10;
              }

              return (
                <div
                  key={shake.id}
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
                  className={`shake-stage relative h-full aspect-square overflow-hidden rounded-[26px] max-sm:rounded-[18px] ${
                    !isCurrent ? "cursor-pointer" : ""
                  }`}
                >
                  <picture>
                    <source srcSet={shake.image} type="image/webp" />
                    <img
                      src={shake.fallback}
                      alt={`${shake.name} premium ice-cream shake`}
                      width={900}
                      height={900}
                      sizes="(max-width: 768px) 60vw, (max-width: 1280px) 40vw, 26vw"
                      loading={isCurrent ? "eager" : "lazy"}
                      fetchPriority={isCurrent ? "high" : "low"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goToNext}
            disabled={activeIndex === SHAKES.length - 1}
            aria-label={nextIdx !== null ? `Next shake: ${SHAKES[nextIdx].name}` : "Last shake reached"}
            className={`${arrowClass} right-4 max-md:right-2 ${
              activeIndex === SHAKES.length - 1
                ? "opacity-25 pointer-events-none"
                : "hover:bg-white active:scale-95 cursor-pointer"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mt-3 max-sm:mt-2 text-center z-10">
            <h3 className="font-display text-[clamp(1.3rem,2.8vw,2.1rem)] max-sm:text-[clamp(1.1rem,4.8vw,1.6rem)] font-black uppercase tracking-tight m-0 leading-tight">
              {activeShake.name}
            </h3>
            <p className="shake-muted mt-1 text-[0.76rem] max-sm:text-[0.72rem] font-semibold max-sm:hidden">
              {activeShake.note}
            </p>
            <p className="mt-1 text-[0.72rem] font-black tabular-nums opacity-60" aria-live="polite">
              {activeIndex + 1} of {SHAKES.length}
            </p>
          </div>
        </div>

        {/* 3. Build panel */}
        <aside
          className="shake-panel relative z-30 w-[min(1120px,calc(100%-24px))] xl:w-full mx-auto shrink-0 rounded-[22px] border p-5 max-lg:p-4 max-sm:p-3"
          aria-labelledby="shake-build-heading"
        >
          <div className="flex items-start justify-between gap-3 mb-4 max-sm:mb-2.5">
            <div>
              <h4 id="shake-build-heading" className="text-[0.86rem] max-sm:text-[0.8rem] font-black uppercase tracking-[0.08em]">
                Build your <span className="hidden max-sm:inline">{activeShake.name} </span>shake
              </h4>
              <p className="shake-sub shake-muted max-sm:hidden text-[0.78rem] font-semibold mt-1">
                Blended with {activeShake.name}
              </p>
            </div>
            <span className="shake-status text-[0.72rem] font-black rounded-full border px-3 py-1.5 whitespace-nowrap">
              {size} · {activeSize.volume}
            </span>
          </div>

          <fieldset>
            <legend className="shake-legend shake-muted text-[0.72rem] font-black uppercase tracking-[0.12em] mb-2">Size</legend>
            <div className="grid grid-cols-2 gap-3 max-sm:gap-2.5">
              {(Object.keys(SIZES) as ShakeSize[]).map((item) => {
                const option = SIZES[item];
                const isSelected = size === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    aria-pressed={isSelected}
                    className={`shake-option shake-size-card relative min-h-[86px] max-sm:min-h-[80px] rounded-2xl border-2 p-3.5 max-sm:p-3 text-left flex flex-col cursor-pointer transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2 active:scale-[0.98] ${
                      isSelected
                        ? "is-active shadow-[0_10px_26px_rgba(21,21,15,0.13)] scale-[1.01]"
                        : "shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    <span className="block pr-7 text-[0.88rem] font-black leading-tight">{item}</span>
                    <span className="shake-muted block mt-1 text-[0.75rem] font-bold">{option.volume}</span>
                    <span className="shake-size-price mt-2.5">
                      <span className="block text-[1.08rem] font-black leading-none">{formatRupees(option.price)}</span>
                      <span className="shake-size-extra flex flex-wrap items-center gap-2 mt-2">
                        <span className="shake-muted text-[0.75rem] line-through">{formatRupees(option.originalPrice)}</span>
                        <span className="rounded-full px-2 py-1 text-[0.75rem] font-black bg-green-700 text-white leading-none">
                          Save {formatRupees(option.originalPrice - option.price)}
                        </span>
                      </span>
                    </span>
                    {isSelected && (
                      <span
                        className="shake-check absolute right-3 top-3 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow-sm"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="shake-actions mt-4 max-sm:mt-2.5 flex flex-wrap items-center gap-3">
            <div className="shake-summary min-w-0 flex-1">
              <span className="shake-sub block text-[0.72rem] font-black uppercase tracking-[0.08em] opacity-60">Your shake</span>
              <strong className="block mt-1 text-[0.84rem] max-sm:text-[0.78rem] truncate">
                {activeShake.name} · {size} · {activeSize.volume}
              </strong>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-black max-sm:hidden">Quantity</span>
              <div className="shake-quantity flex items-center rounded-full border p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  className="w-11 h-11 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Decrease shake quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-black tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                  disabled={quantity >= 10}
                  className="w-11 h-11 rounded-full font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Increase shake quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`shake-cta-btn mt-3 max-sm:mt-2 w-full min-h-[48px] rounded-full text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
              added ? "bg-green-700 text-white" : "bg-ink text-panel"
            }`}
          >
              {added ? "Added to your order" : `Add to Cart · ${formatRupees(total)}`}
            </button>
          </div>

          {saving > 0 && (
            <p className="mt-2 max-sm:hidden text-center text-[0.72rem] font-black opacity-60">
              You save {formatRupees(saving)}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
