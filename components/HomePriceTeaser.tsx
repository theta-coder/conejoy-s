import Link from "next/link";
import { ArrowRight, IceCream, Utensils, GlassWater } from "lucide-react";
import { CONE_PRICING, CUP_SERVING_OPTIONS, SHAKE_SIZES, formatRupees } from "@/data/menu";

export default function HomePriceTeaser() {
  const minConePrice = CONE_PRICING.price;
  const minCupPrice = Math.min(...CUP_SERVING_OPTIONS.map((c) => c.price));
  const minShakePrice = Math.min(
    ...Object.values(SHAKE_SIZES).map((s) => s.price)
  );

  return (
    <section
      id="prices-teaser"
      className="scroll-mt-[var(--header-height)] border-t border-[#4a2618]/10 bg-[#4a2618] px-[clamp(16px,5vw,72px)] py-[clamp(48px,6vw,88px)] text-white"
      aria-labelledby="price-teaser-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Intro Text */}
          <div className="max-w-[560px] space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white">
                Simple &amp; Transparent Rates
              </span>
            </div>

            <h2
              id="price-teaser-title"
              className="font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[0.96] tracking-[-0.05em] text-white"
            >
              Good scoops, simple prices.
            </h2>

            <p className="text-sm sm:text-base font-semibold leading-relaxed text-white/80">
              Honest rates with no small print. Check our starting prices below or view the complete official menu list.
            </p>
          </div>

          {/* Right Compact Starting Price Strip */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 lg:gap-4 flex-1 max-w-[720px]">
            {/* Cone Card */}
            <div className="flex-1 flex items-center justify-between sm:flex-col sm:justify-center p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm text-left sm:text-center">
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#faa926]">
                  <IceCream className="h-5 w-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  Cone
                </span>
              </div>
              <span className="font-display text-xl sm:text-2xl font-black text-white mt-0 sm:mt-1">
                From {formatRupees(minConePrice)}
              </span>
            </div>

            {/* Cup Card */}
            <div className="flex-1 flex items-center justify-between sm:flex-col sm:justify-center p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm text-left sm:text-center">
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#faa926]">
                  <Utensils className="h-5 w-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  Cups
                </span>
              </div>
              <span className="font-display text-xl sm:text-2xl font-black text-white mt-0 sm:mt-1">
                From {formatRupees(minCupPrice)}
              </span>
            </div>

            {/* Shake Card */}
            <div className="flex-1 flex items-center justify-between sm:flex-col sm:justify-center p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm text-left sm:text-center">
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#faa926]/20 text-[#faa926]">
                  <GlassWater className="h-5 w-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  Shakes
                </span>
              </div>
              <span className="font-display text-xl sm:text-2xl font-black text-white mt-0 sm:mt-1">
                From {formatRupees(minShakePrice)}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <Link
            href="/menu"
            className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-[#faa926] hover:bg-[#e0921a] px-8 text-sm font-black text-[#4a2618] shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span>View full menu &amp; prices</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
