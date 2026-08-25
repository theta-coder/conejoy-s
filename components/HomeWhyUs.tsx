import { BRAND } from "@/data/brand";
import Image from "next/image";
import Link from "next/link";

const PROOF_POINTS = [
  {
    title: "12 flavours",
    subtitle: "Cones, cups & shakes",
  },
  {
    title: "12 PM — 12 AM",
    subtitle: "Open every day",
  },
  {
    title: "WhatsApp delivery",
    subtitle: "Simple. Quick. No app.",
  },
] as const;

export default function HomeWhyUs() {
  return (
    <section
      id="about"
      className="relative scroll-mt-[var(--header-height)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] py-[clamp(64px,8vw,120px)] border-t border-[rgba(74,38,24,0.08)] overflow-hidden"
      aria-labelledby="why-us-headline"
    >
      {/* Background Mascot Watermark — positioned to show behind proof points on mobile & bottom right on desktop */}
      <div
        className="absolute top-[28%] -right-8 max-sm:w-[220px] w-[280px] opacity-[0.14] sm:top-1/3 sm:right-0 md:opacity-[0.11] lg:top-auto lg:bottom-[-20px] lg:right-12 lg:w-[480px] z-0 pointer-events-none select-none -rotate-6 transition-all"
        aria-hidden="true"
      >
        <Image
          src={BRAND.logo}
          alt=""
          width={500}
          height={500}
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="mx-auto w-full max-w-[1380px] relative z-10">
        <div className="grid grid-cols-1 items-center gap-[clamp(40px,6vw,96px)] lg:grid-cols-12">
          {/* Left Column: Editorial Copy & Proof Points */}
          <div className="lg:col-span-7 space-y-8 relative">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(74,38,24,0.15)] bg-white/70 px-4 py-1.5 backdrop-blur-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--home-golden)]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--home-brown)]">
                LOCAL · LATE · MADE TO SCOOP
              </span>
            </div>

            {/* Headline */}
            <h2
              id="why-us-headline"
              className="font-display text-[clamp(2.5rem,4.8vw,4.8rem)] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--home-brown)] max-w-[700px]"
            >
              Chung’s late-night scoop stop.
            </h2>

            {/* Body */}
            <p className="text-[clamp(1.05rem,1.4vw,1.25rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.78)] max-w-[580px]">
              Cones, cups and thick shakes in 12 flavours — served every day from noon till midnight. Drop by in Chung or order straight on WhatsApp.
            </p>

            {/* Compact Proof Points (Subtle Border Separators) */}
            <div className="my-8 border-y border-[rgba(74,38,24,0.15)] py-2 relative z-10 backdrop-blur-[1px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(74,38,24,0.12)]">
                {PROOF_POINTS.map((point, index) => (
                  <div
                    key={point.title}
                    className={`py-4 ${
                      index === 0
                        ? "sm:pr-6"
                        : index === 1
                        ? "sm:px-6"
                        : "sm:pl-6"
                    }`}
                  >
                    <div className="font-display text-xl font-extrabold text-[var(--home-brown)] tracking-tight">
                      {point.title}
                    </div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-[rgba(74,38,24,0.65)]">
                      {point.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
              <Link
                href="#categories"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--home-brown)] px-8 text-sm font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(74,38,24,0.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
              >
                Explore Menu
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Product Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6">
            {/* Soft Ambient Golden Arch Backdrop */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[40px] bg-gradient-to-b from-[var(--home-golden)]/30 to-white/60 p-6 border border-[rgba(74,38,24,0.12)] shadow-[0_24px_60px_rgba(74,38,24,0.08)] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,169,38,0.25),transparent_70%)] pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.1)] bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[0.68rem] font-black uppercase tracking-wider text-[var(--home-brown)]">
                  Fresh Daily · Chung
                </span>
              </div>

              {/* Product Cone Image */}
              <div className="relative z-10 h-[88%] w-full flex items-center justify-center">
                <Image
                  src="/assets/cones/mango.webp"
                  alt="ConeJoy's Mango Ice Cream Cone"
                  width={480}
                  height={1200}
                  sizes="(max-width: 768px) 65vw, 360px"
                  className="h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(74,38,24,0.25)] transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute bottom-4 inset-x-4 z-20 rounded-2xl bg-white/80 border border-[rgba(74,38,24,0.1)] p-3 text-center backdrop-blur-md shadow-sm">
                <span className="font-display text-sm font-extrabold text-[var(--home-brown)]">
                  Hand-crafted scoops, served till 12 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
