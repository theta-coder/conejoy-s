"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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

    const interval = window.setInterval(() => {
      showNext();
    }, 7000);

    return () => window.clearInterval(interval);
  }, [isPaused, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#fdf6e3] pt-3 pb-8 max-sm:py-0"
      aria-label="Promotional Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        key={`hero-backdrop-${activeIndex}`}
        src={HERO_BANNERS[activeIndex].src}
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="hidden scale-110 object-cover object-center opacity-60 blur-2xl saturate-75 lg:block"
      />
      <span
        className="absolute inset-0 hidden bg-[rgba(253,246,227,0.2)] lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1380px] px-[clamp(16px,4vw,64px)] max-sm:px-0">
        {/* Banner Frame (Aspect 16:9 / 21:9 responsive) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-[#4a2618]/10 bg-[#4a2618]/5 shadow-xl transition-all sm:aspect-[21/9] max-sm:rounded-none max-sm:border-x-0 max-sm:shadow-none">
          {HERO_BANNERS.map((banner, index) => {
            const isCurrent = index === activeIndex;
            return (
              <div
                key={banner.src}
                aria-hidden={!isCurrent}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1380px"
                  className="object-cover object-center"
                />
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous promotional slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#4a2618] backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4a2618] max-sm:left-2"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next promotional slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#4a2618] backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4a2618] max-sm:right-2"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Pagination Indicators & Pause Toggle */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md max-sm:border max-sm:border-[#4a2618]/20 max-sm:bg-[#fdf6e3]/90 max-sm:px-2 max-sm:py-1">
            {HERO_BANNERS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-white max-sm:bg-[#4a2618]"
                    : "w-2 bg-white/50 hover:bg-white/75 max-sm:bg-[#4a2618]/30 max-sm:hover:bg-[#4a2618]/50"
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
              className="ml-1 text-white/80 hover:text-white max-sm:hidden"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
