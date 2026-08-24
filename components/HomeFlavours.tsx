import Image from "next/image";
import Link from "next/link";
import { FLAVOURS } from "@/data/flavours";
import { CONE_PRICING, formatRupees } from "@/data/menu";

export default function HomeFlavours() {
  return (
    <section
      id="flavours"
      className="scroll-mt-[var(--header-height)] border-t border-[rgba(74,38,24,0.08)] bg-[var(--home-cream)] px-[clamp(12px,4vw,72px)] py-[clamp(48px,7vw,120px)]"
      aria-labelledby="flavours-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.15)] bg-white/70 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--home-golden)]" />
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">
            The full flavour list
          </span>
        </div>

        <h2
          id="flavours-title"
          className="max-w-[860px] font-display text-[clamp(2rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[var(--home-brown)]"
        >
          Twelve flavours. One hard choice.
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="max-w-[520px] text-[clamp(0.92rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.75)]">
            Every one of them comes as a cone, a cup or a thick blended shake.
          </p>

          <p className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[rgba(74,38,24,0.15)] bg-[var(--home-golden)] px-4 py-2 sm:px-5 sm:py-2.5 shadow-[0_10px_28px_rgba(74,38,24,0.12)]">
            <span className="text-xs sm:text-sm font-black text-[var(--home-brown)]">
              Every cone {formatRupees(CONE_PRICING.price)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[rgba(74,38,24,0.6)] line-through">
              {formatRupees(CONE_PRICING.originalPrice)}
            </span>
          </p>
        </div>

        {/* 3x4 grid on mobile (grid-cols-3), 4 cols on sm/md, 6 cols on lg/xl */}
        <ul className="mt-8 sm:mt-10 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {FLAVOURS.map((flavour) => (
            <li key={flavour.id}>
              <Link
                href="/cones"
                aria-label={`${flavour.name} — see all cones`}
                className="group relative flex h-full flex-col items-center overflow-hidden rounded-[18px] sm:rounded-[24px] border border-[rgba(74,38,24,0.15)] pb-3 pt-3.5 sm:pb-4 sm:pt-5 shadow-[0_10px_30px_rgba(74,38,24,0.06)] transition-[transform,box-shadow] duration-300 ease-custom hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(74,38,24,0.14)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
                style={{
                  backgroundColor: `color-mix(in srgb, ${flavour.color} 22%, white)`,
                }}
              >
                <div className="relative flex h-[88px] sm:h-[118px] md:h-[132px] w-full items-center justify-center">
                  <Image
                    src={flavour.webpSrc}
                    alt={flavour.alt}
                    width={540}
                    height={1500}
                    sizes="(max-width: 639px) 30vw, (max-width: 1023px) 22vw, 190px"
                    className="h-full w-auto object-contain drop-shadow-[0_8px_12px_rgba(74,38,24,0.18)] transition-transform duration-500 ease-custom group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>

                <h3 className="mt-2 sm:mt-3.5 px-1.5 sm:px-3 text-center font-display text-[0.78rem] sm:text-[0.9rem] md:text-[0.98rem] font-extrabold leading-tight tracking-[-0.03em] text-[var(--home-brown)] line-clamp-2">
                  {flavour.name}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 sm:mt-9 flex flex-wrap gap-3">
          <Link
            href="/cones"
            className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--home-brown)] px-6 sm:px-8 text-xs sm:text-sm font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(74,38,24,0.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
          >
            Build your cone
          </Link>
          <Link
            href="/shakes"
            className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center whitespace-nowrap rounded-full border border-[rgba(74,38,24,0.25)] bg-white/70 px-6 sm:px-8 text-xs sm:text-sm font-black text-[var(--home-brown)] backdrop-blur-sm transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
          >
            Or make it a shake
          </Link>
        </div>
      </div>
    </section>
  );
}
