import Image from "next/image";
import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";
import {
  CONE_PRICING,
  NORMAL_CUP_OPTIONS,
  PACK_OPTIONS,
  SHAKE_SIZES,
  formatRupees,
} from "@/data/menu";
import { ArrowRight, Sparkles, IceCream, Utensils, GlassWater, Package } from "lucide-react";

export const metadata = {
  title: "Menu & Prices | ConeJoy's Ice Cream Lahore",
  description:
    "Explore ConeJoy's official menu and prices. Fresh ice cream cones from Rs. 100, cups from Rs. 160, multi-flavour packs from Rs. 420, and thick shakes from Rs. 420 in Lahore.",
};

export default function MenuPage() {
  const coneSaving = CONE_PRICING.originalPrice - CONE_PRICING.price;

  return (
    <div className="min-h-[100dvh] bg-[#fdf6e3] text-[#4a2618]">
      <HomeHeader />

      <main className="py-[clamp(40px,6vw,80px)] px-[clamp(16px,5vw,72px)]">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Page Intro Header */}
          <div className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4a2618]/15 bg-white/70 px-4 py-1.5 backdrop-blur-sm shadow-sm mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#faa926]" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#4a2618]">
                MENU &amp; PRICES
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#4a2618]">
              Good scoops, simple prices.
            </h1>

            <p className="mt-4 text-[clamp(1rem,1.4vw,1.2rem)] font-semibold leading-relaxed text-[#4a2618]/75">
              Choose single-flavour cones, cups and shakes, or build a multi-flavour pack. What you see here is what you pay.
            </p>

            {/* Quick Category Anchors */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#4a2618]/15 bg-white/80 p-1.5 shadow-sm backdrop-blur-md">
              <a
                href="#menu-cones"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#4a2618] hover:bg-[#4a2618] hover:text-white transition-colors"
              >
                <IceCream className="h-4 w-4" />
                <span>Cones</span>
              </a>
              <a
                href="#menu-cups"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#4a2618] hover:bg-[#4a2618] hover:text-white transition-colors"
              >
                <Utensils className="h-4 w-4" />
                <span>Cups</span>
              </a>
              <a
                href="#menu-packs"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#4a2618] hover:bg-[#4a2618] hover:text-white transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Build a Pack</span>
              </a>
              <a
                href="#menu-shakes"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#4a2618] hover:bg-[#4a2618] hover:text-white transition-colors"
              >
                <GlassWater className="h-4 w-4" />
                <span>Shakes</span>
              </a>
            </div>
          </div>

          {/* Menu Sections Container */}
          <div className="space-y-16">
            {/* Category 1: Cones */}
            <section
              id="menu-cones"
              className="scroll-mt-28 rounded-[32px] border border-[#4a2618]/15 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(74,38,24,0.05)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#4a2618]/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#faa926]/20 text-[#4a2618]">
                    <IceCream className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4a2618]">
                      Crispy Cones (Single Flavour)
                    </h2>
                    <p className="text-sm font-semibold text-[#4a2618]/70">
                      Hand-rolled waffle cones baked fresh daily in Chung
                    </p>
                  </div>
                </div>

                <Link
                  href="/cones"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#4a2618] px-6 text-xs font-black uppercase text-white shadow-md transition-all hover:bg-[#381c11] hover:-translate-y-0.5"
                >
                  <span>Choose a cone</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#fdf6e3] border border-[#4a2618]/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl font-black text-[#4a2618]">
                        Single Cone
                      </h3>
                      <span className="rounded-full bg-[#faa926] px-3 py-0.5 text-[0.68rem] font-black uppercase text-[#4a2618]">
                        Popular
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#4a2618]/75 mt-1">
                      1 scoop in crispy waffle cone, choose any of our 12 signature flavours
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="font-display text-2xl font-black text-[#4a2618]">
                      {formatRupees(CONE_PRICING.price)}
                    </div>
                    <div className="text-xs font-bold text-[#4a2618]/60 line-through">
                      {formatRupees(CONE_PRICING.originalPrice)}
                    </div>
                    <div className="text-xs font-black text-[#faa926] bg-[#4a2618] rounded-md px-2 py-0.5 mt-1 inline-block">
                      Save {formatRupees(coneSaving)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Category 2: Cups */}
            <section
              id="menu-cups"
              className="scroll-mt-28 rounded-[32px] border border-[#4a2618]/15 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(74,38,24,0.05)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#4a2618]/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#faa926]/20 text-[#4a2618]">
                    <Utensils className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4a2618]">
                      Single-Flavour Cups
                    </h2>
                    <p className="text-sm font-semibold text-[#4a2618]/70">
                      Chilled serving cups in Small, Medium, and Large sizes
                    </p>
                  </div>
                </div>

                <Link
                  href="/cups"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#4a2618] px-6 text-xs font-black uppercase text-white shadow-md transition-all hover:bg-[#381c11] hover:-translate-y-0.5"
                >
                  <span>Choose cups</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {NORMAL_CUP_OPTIONS.map((option) => {
                  const saving = option.originalPrice - option.price;
                  return (
                    <div
                      key={option.id}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-[#fdf6e3] border border-[#4a2618]/10 hover:border-[#4a2618]/30 transition-colors"
                    >
                      <div>
                        <h3 className="font-display text-lg font-extrabold text-[#4a2618]">
                          {option.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#4a2618]/70 mt-1">
                          {option.scoops} scoops &bull; single flavour
                        </p>
                      </div>

                      <div className="mt-4 flex items-end justify-between pt-3 border-t border-[#4a2618]/10">
                        <div>
                          <span className="text-xs font-bold text-[#4a2618]/60 line-through block">
                            {formatRupees(option.originalPrice)}
                          </span>
                          <span className="text-xs font-black text-[#e63946]">
                            Save {formatRupees(saving)}
                          </span>
                        </div>
                        <span className="font-display text-2xl font-black text-[#4a2618]">
                          {formatRupees(option.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Category 3: Build a Pack (Multi-Flavour) */}
            <section
              id="menu-packs"
              className="scroll-mt-28 rounded-[32px] border-2 border-[#faa926] bg-[#4a2618] text-white p-6 sm:p-10 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/15">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#faa926]/20 text-[#faa926]">
                    <Package className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#faa926] px-3 py-0.5 text-[0.65rem] font-black uppercase text-[#4a2618] mb-1">
                      Multi-Flavour Mix &amp; Match
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      Build a Pack
                    </h2>
                    <p className="text-sm font-semibold text-white/75">
                      Choose multiple flavours, repeat your favourites, and build your own pack.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 6-Scoop Pack */}
                <div className="flex flex-col justify-between p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-xl font-extrabold text-white">
                        6-Scoop Pack
                      </h3>
                      <span className="font-display text-2xl font-black text-[#faa926]">
                        Rs. 420
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white/75 mt-2">
                      Mix &amp; match any 6 scoops from our 12 signature flavours.
                    </p>
                  </div>

                  <Link
                    href="/cups?pack=6"
                    className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#faa926] hover:bg-[#e0921a] px-6 text-xs font-black uppercase text-[#4a2618] transition-transform hover:-translate-y-0.5 shadow-md"
                  >
                    <span>Build your pack &rarr;</span>
                  </Link>
                </div>

                {/* 12-Scoop Family Pack */}
                <div className="flex flex-col justify-between p-6 rounded-2xl bg-white/10 border border-[#faa926]/40 backdrop-blur-sm relative">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-extrabold text-white">
                          12-Scoop Family Pack
                        </h3>
                      </div>
                      <span className="font-display text-2xl font-black text-[#faa926]">
                        Rs. 820
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white/75 mt-2">
                      Choose any 12 scoops or click <strong className="text-[#faa926]">"Try all 12 flavours"</strong> for a full sampler.
                    </p>
                  </div>

                  <Link
                    href="/cups?pack=12"
                    className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#faa926] hover:bg-[#e0921a] px-6 text-xs font-black uppercase text-[#4a2618] transition-transform hover:-translate-y-0.5 shadow-md"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Build your Family Pack &rarr;</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Category 4: Shakes */}
            <section
              id="menu-shakes"
              className="scroll-mt-28 rounded-[32px] border border-[#4a2618]/15 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(74,38,24,0.05)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#4a2618]/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#faa926]/20 text-[#4a2618]">
                    <GlassWater className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4a2618]">
                      Thick Shakes (Single Flavour)
                    </h2>
                    <p className="text-sm font-semibold text-[#4a2618]/70">
                      Real ice cream blended with fresh milk &amp; toppings
                    </p>
                  </div>
                </div>

                <Link
                  href="/shakes"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#4a2618] px-6 text-xs font-black uppercase text-white shadow-md transition-all hover:bg-[#381c11] hover:-translate-y-0.5"
                >
                  <span>Choose a shake</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  Object.entries(SHAKE_SIZES) as [
                    string,
                    (typeof SHAKE_SIZES)[keyof typeof SHAKE_SIZES]
                  ][]
                ).map(([size, value]) => {
                  const saving = value.originalPrice - value.price;
                  return (
                    <div
                      key={size}
                      className="flex flex-col justify-between p-5 rounded-2xl bg-[#fdf6e3] border border-[#4a2618]/10"
                    >
                      <div>
                        <h3 className="font-display text-xl font-extrabold text-[#4a2618]">
                          {size} Shake
                        </h3>
                        <p className="text-xs font-semibold text-[#4a2618]/70 mt-1">
                          {value.volume} &bull; Thick blended shake
                        </p>
                      </div>

                      <div className="mt-4 flex items-end justify-between pt-3 border-t border-[#4a2618]/10">
                        <div>
                          <span className="text-xs font-bold text-[#4a2618]/60 line-through block">
                            {formatRupees(value.originalPrice)}
                          </span>
                          <span className="text-xs font-black text-[#e63946]">
                            Save {formatRupees(saving)}
                          </span>
                        </div>
                        <span className="font-display text-2xl font-black text-[#4a2618]">
                          {formatRupees(value.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
