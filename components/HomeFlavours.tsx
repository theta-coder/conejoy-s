"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import { CONE_PRICING, formatRupees } from "@/data/menu";
import FlavourFormatModal from "@/components/FlavourFormatModal";
import { ArrowRight } from "lucide-react";

// 6 featured/popular flavours for homepage
const FEATURED_IDS = [
  "mango",
  "chocolate",
  "kulfa",
  "pistachio",
  "strawberry",
  "blueberry",
];

export default function HomeFlavours() {
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourItem | null>(null);
  const [showAllFlavours, setShowAllFlavours] = useState(false);

  const featuredFlavours = FLAVOURS.filter((f) => FEATURED_IDS.includes(f.id));
  const displayedFlavours = showAllFlavours ? FLAVOURS : featuredFlavours;

  return (
    <section
      id="flavours"
      className="scroll-mt-[var(--header-height)] border-t border-[rgba(74,38,24,0.08)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] py-[clamp(64px,8vw,120px)]"
      aria-labelledby="flavours-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        {/* Eyebrow */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.15)] bg-white/70 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">
            Featured Flavours
          </span>
        </div>

        {/* Section Headline */}
        <h2
          id="flavours-title"
          className="max-w-[860px] font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[var(--home-brown)]"
        >
          Famous scoops. Pure delight.
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="max-w-[540px] text-[clamp(0.95rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.75)]">
            Pick your favourite flavour to get started, or browse our full 12-flavour collection.
          </p>

          <p className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[rgba(74,38,24,0.15)] bg-[var(--home-golden)] px-5 py-2.5 shadow-[0_10px_28px_rgba(74,38,24,0.12)]">
            <span className="text-xs sm:text-sm font-black text-[var(--home-brown)]">
              From {formatRupees(CONE_PRICING.price)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[rgba(74,38,24,0.6)] line-through">
              {formatRupees(CONE_PRICING.originalPrice)}
            </span>
          </p>
        </div>

        {/* 6 Featured Flavour Cards Grid (Clean, Premium 3x2 on mobile / 6-cols responsive) */}
        <ul className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedFlavours.map((flavour) => (
            <li key={flavour.id}>
              <button
                type="button"
                onClick={() => setSelectedFlavour(flavour)}
                aria-label={`Select ${flavour.name} flavour`}
                className="group relative flex w-full h-full flex-col items-center overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[rgba(74,38,24,0.15)] pb-4 pt-5 shadow-[0_12px_36px_rgba(74,38,24,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(74,38,24,0.14)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] cursor-pointer text-left"
                style={{
                  backgroundColor: `color-mix(in srgb, ${flavour.color} 22%, white)`,
                }}
              >
                <div className="relative flex h-[110px] sm:h-[128px] md:h-[136px] w-full items-center justify-center">
                  <Image
                    src={flavour.webpSrc}
                    alt={flavour.alt}
                    width={540}
                    height={1500}
                    sizes="(max-width: 639px) 42vw, (max-width: 1023px) 28vw, 190px"
                    className="h-full w-auto object-contain drop-shadow-[0_10px_16px_rgba(74,38,24,0.18)] transition-transform duration-500 group-hover:scale-[1.08]"
                    loading="lazy"
                  />
                </div>

                <h3 className="mt-3 px-2 text-center font-display text-[0.88rem] sm:text-[0.96rem] font-extrabold leading-tight tracking-[-0.03em] text-[var(--home-brown)] line-clamp-1">
                  {flavour.name}
                </h3>

                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--home-brown)]/10 px-2.5 py-0.5 text-[0.65rem] font-black uppercase text-[var(--home-brown)] group-hover:bg-[var(--home-brown)] group-hover:text-white transition-colors">
                  Choose format
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* CTA: View all 12 flavours */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(74,38,24,0.12)] pt-6">
          <button
            type="button"
            onClick={() => setShowAllFlavours((prev) => !prev)}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-[var(--home-brown)] bg-white px-8 text-sm font-black text-[var(--home-brown)] shadow-sm transition-all duration-200 hover:bg-[var(--home-brown)] hover:text-white active:scale-95 cursor-pointer"
          >
            <span>{showAllFlavours ? "Show featured 6" : "View all 12 flavours"}</span>
            <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${showAllFlavours ? "rotate-90" : ""}`} />
          </button>

          <Link
            href="/cones"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--home-brown)] hover:underline"
          >
            <span>Explore full cone catalogue &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Flavour Format Selection Modal / Bottom Sheet */}
      <FlavourFormatModal
        flavour={selectedFlavour}
        onClose={() => setSelectedFlavour(null)}
      />
    </section>
  );
}
