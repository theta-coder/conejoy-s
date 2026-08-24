"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Package, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Cones",
    subtitle: "Single flavour",
    href: "/cones",
    poster: "/assets/cones/chocolate-bliss-poster.webp",
    alt: "Cone Joy's Chocolate Bliss cone poster",
  },
  {
    name: "Cups",
    subtitle: "Single flavour",
    href: "/cups",
    poster: "/assets/cups/mango-magic-poster.webp",
    alt: "Cone Joy's Mango Magic cup poster",
  },
  {
    name: "Shakes",
    subtitle: "Single flavour",
    href: "/shakes",
    poster: "/assets/shakes/mango-shake-poster.webp",
    alt: "Cone Joy's Mango Shake poster",
  },
] as const;

export default function HomeCategories() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const centerSecondCard = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        rail.scrollLeft = 0;
        return;
      }

      const secondCard = rail.children.item(1) as HTMLElement | null;
      if (!secondCard) return;

      rail.scrollLeft =
        secondCard.offsetLeft - (rail.clientWidth - secondCard.clientWidth) / 2;
    };

    const frame = window.requestAnimationFrame(centerSecondCard);
    window.addEventListener("resize", centerSecondCard);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", centerSecondCard);
    };
  }, []);

  return (
    <section
      id="categories"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] pb-[clamp(36px,4.5vw,64px)] pt-[clamp(72px,9vw,128px)]"
      aria-labelledby="categories-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <h2
          id="categories-title"
          className="max-w-[780px] font-display text-[clamp(2.5rem,5.2vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.065em]"
        >
          Pick your kind of joy.
        </h2>
        <p className="mt-5 max-w-[560px] text-base font-semibold leading-relaxed text-[rgba(74,38,24,0.7)]">
          Start with a cone, choose a cup, or make it a shake. Want multiple flavours? Build a pack.
        </p>

        <div
          ref={railRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-80px)] pb-4 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:mt-8 sm:px-[calc(50%-120px)] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative isolate aspect-[2/3] w-[160px] shrink-0 snap-center overflow-hidden rounded-[20px] border border-[rgba(74,38,24,0.5)] bg-transparent text-[var(--home-brown)] shadow-[0_16px_45px_rgba(74,38,24,0.1)] transition-[transform,box-shadow] duration-300 ease-custom hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(74,38,24,0.16)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] sm:w-[240px] lg:w-auto lg:max-w-none lg:rounded-[28px]"
              aria-label={`Browse ${category.name}`}
            >
              <Image
                src={category.poster}
                alt={category.alt}
                fill
                sizes="(max-width: 639px) 160px, (max-width: 1023px) 240px, (min-width: 1380px) 447px, 32vw"
                className="absolute inset-0 z-10 object-cover transition-transform duration-500 ease-custom group-hover:scale-[1.012]"
              />
              <span className="absolute right-3 top-3 z-30 inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--home-brown)] px-3 text-[0.68rem] font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.28)] lg:right-5 lg:top-5 lg:min-h-11 lg:px-6 lg:text-sm">
                View all {category.name.toLowerCase()}
              </span>
            </Link>
          ))}
        </div>

        {/* Compact "Can't pick just one? Build a Pack" Banner */}
        <div className="mt-8 rounded-[24px] border border-[#4a2618]/15 bg-white/80 p-5 sm:p-6 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#faa926]/20 text-[#4a2618]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-[#4a2618]">
                Can&apos;t pick just one flavour?
              </h3>
              <p className="text-xs font-semibold text-[#4a2618]/70">
                Build a 6 or 12-scoop pack with your favourite flavours.
              </p>
            </div>
          </div>

          <Link
            href="/cups?pack=6"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#4a2618] hover:bg-[#381c11] px-6 text-xs font-black uppercase text-white transition-transform hover:-translate-y-0.5 shadow-md"
          >
            <span>Build a Pack</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
