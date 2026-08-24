"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const HERO_BANNERS = [
  {
    src: "/assets/banners/scoops-of-happiness.webp",
    alt: "Cone Joy's Scoops of Happiness banner featuring the mascot, ice cream cones and a branded cup",
  },
  {
    src: "/assets/banners/pure-happiness-every-scoop.webp",
    alt: "Cone Joy's Pure Happiness in Every Scoop banner featuring the mascot and three ice cream flavours",
  },
  {
    src: "/assets/banners/real-ingredients-pure-joy.webp",
    alt: "Cone Joy's Real Ingredients, Pure Joy banner featuring the mascot and a caramel ice cream cup",
  },
] as const;

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? HERO_BANNERS.length - 1 : current - 1,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % HERO_BANNERS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reducedMotion.matches) return;

    const timer = window.setInterval(showNext, 7000);
    return () => window.clearInterval(timer);
  }, [isPaused, showNext]);

  return (
    <section
      className="relative touch-pan-y bg-[#f7f1e5]"
      aria-roledescription="carousel"
      aria-label="Cone Joy's promotional banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = endX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(distance) < 40) return;
        if (distance < 0) showNext();
        else showPrevious();
      }}
    >
      <h1 className="sr-only">Cone Joy&apos;s Ice Cream in Chung, Lahore</h1>

      <div className="relative mx-auto aspect-[8/3] max-h-[720px] w-full max-w-[1920px] overflow-hidden max-lg:aspect-[16/9]">
        <div
          className="flex h-full transition-transform duration-500 ease-custom motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {HERO_BANNERS.map((banner, index) => (
            <div
              key={banner.src}
              className="relative h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${HERO_BANNERS.length}`}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                sizes="100vw"
                className="object-contain object-top"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={showPrevious}
          aria-label="Show previous banner"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(74,38,24,0.35)] bg-[rgba(253,246,227,0.88)] text-3xl leading-none text-[var(--home-brown)] shadow-[0_8px_24px_rgba(74,38,24,0.16)] backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] max-sm:left-2"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Show next banner"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(74,38,24,0.35)] bg-[rgba(253,246,227,0.88)] text-3xl leading-none text-[var(--home-brown)] shadow-[0_8px_24px_rgba(74,38,24,0.16)] backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] max-sm:right-2"
        >
          <span aria-hidden="true">›</span>
        </button>

        <div
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-[rgba(74,38,24,0.22)] bg-[rgba(253,246,227,0.88)] px-1 shadow-[0_6px_18px_rgba(74,38,24,0.12)] backdrop-blur-sm"
          aria-label="Choose a banner"
        >
          {HERO_BANNERS.map((banner, index) => (
            <button
              key={banner.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--home-brown)]"
            >
              <span
                aria-hidden="true"
                className={`h-2 rounded-full bg-[var(--home-brown)] transition-all motion-reduce:transition-none ${
                  index === activeIndex ? "w-6" : "w-2 opacity-35"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing banner {activeIndex + 1} of {HERO_BANNERS.length}
      </p>
    </section>
  );
}
