"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const SIZE_KEYS = Object.keys(SIZES) as ShakeSize[];
const MIN_PRICE = Math.min(...SIZE_KEYS.map((key) => SIZES[key].price));

const formatRupees = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

export default function ShakeLab({ selectedIndex, selectionRequestKey }: ShakeLabProps) {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState<ShakeSize>("Regular");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetOpenerRef = useRef<HTMLButtonElement>(null);
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

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
    sheetOpenerRef.current?.focus();
  }, []);

  // Modal behaviour for the mobile sheet: lock the page behind it, close on
  // Escape, and keep Tab inside the sheet while it is open.
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

  // Carousel keyboard nav, only while the section is on screen and the sheet
  // is closed (otherwise arrows would change the shake behind the sheet).
  useEffect(() => {
    if (isSheetOpen) return;

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
  }, [goToPrev, goToNext, isSheetOpen]);

  // Horizontal swipe on the stage. Listeners stay passive; `touch-action: pan-y`
  // lets the browser own vertical scrolling.
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || isSheetOpen) return;

    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.closest("aside, button, input, a, [role='radiogroup'], .shake-sheet")) {
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
  }, [goToNext, goToPrev, isSheetOpen]);

  const handleAdd = (fromSheet: boolean) => {
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
    if (fromSheet) window.setTimeout(() => closeSheet(), 550);
  };

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-ink transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

  // One source of truth for the controls: rendered inline beside the image on
  // desktop, and inside the bottom sheet on phones and tablets.
  const buildControls = (inSheet: boolean, headingId: string) => (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 id={headingId} className="text-[0.86rem] font-black uppercase tracking-[0.08em]">
            Build your {activeShake.name} shake
          </h4>
          <p className="shake-muted text-[0.78rem] font-semibold mt-1">{activeShake.note}</p>
        </div>
        <span className="shake-status text-[0.72rem] font-black rounded-full border px-3 py-1.5 whitespace-nowrap self-start">
          {size} · {activeSize.volume}
        </span>
      </div>

      <fieldset>
        <legend className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.12em] mb-2">Size</legend>
        <div className="grid grid-cols-2 gap-3">
          {SIZE_KEYS.map((item) => {
            const option = SIZES[item];
            const isSelected = size === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setSize(item)}
                aria-pressed={isSelected}
                className={`shake-option shake-size-card relative min-h-[86px] rounded-2xl border-2 p-3.5 text-left flex flex-col cursor-pointer transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/35 focus-visible:ring-offset-2 active:scale-[0.98] ${
                  isSelected
                    ? "is-active shadow-[0_10px_26px_rgba(21,21,15,0.13)]"
                    : "shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <span className="block pr-7 text-[0.88rem] font-black leading-tight">{item}</span>
                <span className="shake-muted block mt-1 text-[0.75rem] font-bold">{option.volume}</span>
                <span className="mt-2 block">
                  <span className="block text-[1.08rem] font-black leading-none">{formatRupees(option.price)}</span>
                  <span className="flex flex-wrap items-center gap-1.5 mt-1.5">
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

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.08em] shake-muted">Quantity</span>
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
        onClick={() => handleAdd(inSheet)}
        className={`mt-3 w-full min-h-[52px] rounded-full text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
          added ? "bg-green-700 text-white" : "bg-ink text-panel"
        }`}
      >
        {added ? "Added to your order" : `Add to Cart · ${formatRupees(total)}`}
      </button>
      {saving > 0 && (
        <p className="mt-2 text-center text-[0.72rem] font-black opacity-60">You save {formatRupees(saving)}</p>
      )}
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="shakes"
      className="shake-lab relative min-h-[calc(100dvh-var(--header-height,126px))] pt-5 max-md:pt-4 max-sm:pt-3 pb-4 max-md:pb-3 flex flex-col items-center justify-center overflow-x-hidden isolate text-ink transition-colors duration-[380ms] ease-custom touch-pan-y"
      style={{ "--shake-accent": activeShake.accent } as React.CSSProperties}
      aria-label="Shakes Collection"
    >
      {/* 1. Collection heading */}
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto text-center z-10 shrink-0">
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
        <p className="hidden max-sm:block mt-0.5 font-display text-[1.2rem] font-extrabold tracking-[-0.04em] leading-tight">
          Cold, thick and fresh.
        </p>
      </div>

      <div className="my-3 max-sm:my-2 w-[min(1100px,calc(100%-48px))] xl:w-[min(1560px,calc(100%-72px))] max-md:w-full mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 xl:gap-9 max-xl:flex max-xl:flex-col max-xl:flex-1 max-xl:min-h-0 max-xl:w-full">
        {/* 2. Shake carousel stage — takes the whole screen below xl */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[clamp(200px,30svh,360px)] xl:min-h-[clamp(320px,56svh,560px)] max-xl:flex-1 max-xl:min-h-[160px] select-none">
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

          <div className="relative w-full h-[clamp(200px,30svh,360px)] xl:h-[clamp(320px,56svh,560px)] max-xl:h-auto max-xl:flex-1 max-xl:min-h-0 max-xl:max-h-[calc(100vw-24px)] flex items-center justify-center">
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
                  className={`shake-stage relative h-full aspect-square overflow-hidden rounded-[26px] max-sm:rounded-[20px] ${
                    !isCurrent ? "cursor-pointer" : ""
                  }`}
                >
                  <Image
                    src={shake.fallback}
                    alt={`${shake.name} premium ice-cream shake`}
                    fill
                    sizes="(max-width: 768px) min(calc(100vw - 24px), calc(100svh - 389px)), (max-width: 1279px) min(calc(100vw - 24px), calc(100svh - 421px)), min(56svh, 560px)"
                    loading={isCurrent ? "eager" : "lazy"}
                    fetchPriority={isCurrent ? "high" : "low"}
                    priority={isCurrent}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
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

          <div className="mt-3 max-sm:mt-2 text-center z-10 shrink-0">
            <h3 className="font-display text-[clamp(1.3rem,2.8vw,2.1rem)] max-sm:text-[clamp(1.15rem,5.2vw,1.7rem)] font-black uppercase tracking-tight m-0 leading-tight">
              {activeShake.name}
            </h3>
            {/* Horizontal flavour rail — the Cones page rail, laid on its side */}
            <div
              className="mt-2 flex items-center justify-center gap-[10px] max-sm:gap-[7px]"
              role="tablist"
              aria-label="Shake progress"
            >
              {SHAKES.map((shake, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={shake.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to ${shake.name}`}
                    onClick={() => setActiveIndex(idx)}
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
              {activeShake.name}, {activeIndex + 1} of {SHAKES.length}
            </p>
          </div>
        </div>

        {/* 3a. Desktop: controls sit beside the image */}
        <aside
          className="shake-panel relative z-30 hidden xl:block w-full max-w-[600px] mx-auto shrink-0 rounded-[22px] border p-5"
          aria-labelledby="shake-build-heading"
        >
          {buildControls(false, "shake-build-heading")}
        </aside>
      </div>

      {/* 3b. Mobile & tablet: one button, so the image keeps the whole screen */}
      <div className="xl:hidden w-[calc(100%-24px)] mx-auto shrink-0 z-30">
        <button
          ref={sheetOpenerRef}
          type="button"
          onClick={() => setIsSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
          className="w-full min-h-[52px] rounded-full bg-ink text-panel text-[0.82rem] font-black uppercase tracking-wider shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Select size</span>
          <span className="opacity-60" aria-hidden="true">
            ·
          </span>
          <span>from {formatRupees(MIN_PRICE)}</span>
        </button>
      </div>


      {/* Site credit */}
      <p className="site-credit w-[calc(100%-24px)] mx-auto shrink-0 pt-2 text-center text-[0.66rem] font-bold tracking-wide opacity-55">
        Designed by{" "}
        <a href="https://mavplo.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          MAVPLO · mavplo.com
        </a>
      </p>

      {isSheetOpen && (
        <div className="xl:hidden fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="shake-sheet-heading">
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close size options"
            className="absolute inset-0 w-full h-full bg-ink/55 backdrop-blur-[2px] cursor-default"
          />
          <div
            ref={sheetRef}
            tabIndex={-1}
            style={{ "--shake-accent": activeShake.accent } as React.CSSProperties}
            className="shake-sheet shake-panel absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-[26px] border-t p-4 pb-6 outline-none animate-sheet-up motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="mx-auto h-1.5 w-12 rounded-full bg-ink/20" aria-hidden="true" />
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close size options"
                className="absolute right-4 top-4 w-11 h-11 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center text-lg font-black transition-colors"
              >
                ✕
              </button>
            </div>
            {buildControls(true, "shake-sheet-heading")}
          </div>
        </div>
      )}
    </section>
  );
}
