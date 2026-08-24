import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

/**
 * The page's headline band.
 *
 * HomeHero is a pure image carousel — beautiful, but it contains no text at all.
 * That left the home page with two real problems:
 *
 * 1. No <h1>. The document had no top-level heading, so search engines had no
 *    statement of what the page is, and a screen reader user landing here got no
 *    orientation before being dropped into the section headings.
 *
 * 2. Nothing on the first screen said what the shop sells or offered a way to
 *    act. Banner artwork is set in `object-cover`, so on a phone it crops to
 *    roughly a 16:9 strip — whatever type is baked into the creative is the
 *    first thing the crop loses.
 *
 * This band sits directly under the carousel rather than replacing it: the
 * carousel keeps the visual impact, and the words that have to exist as real
 * HTML live here. Left-aligned to match every other section on the page.
 */
export default function HomeIntro() {
  return (
    <section
      id="intro"
      className="bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] pb-[clamp(28px,3.5vw,48px)] pt-[clamp(24px,3vw,40px)]"
      aria-labelledby="intro-title"
    >
      <div className="mx-auto flex w-full max-w-[1380px] flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0 max-w-[720px]">
          <h1
            id="intro-title"
            className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[var(--home-brown)]"
          >
            Cones, cups and shakes in Chung, Lahore.
          </h1>
          <p className="mt-4 max-w-[560px] text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.75)]">
            Twelve flavours, scooped fresh and served till midnight. Walk in, or
            send your order straight to WhatsApp.
          </p>
        </div>

        <div className="flex shrink-0 max-sm:w-full">
          <Link
            href="#categories"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[rgba(74,38,24,0.25)] bg-white/70 px-8 text-sm font-black text-[var(--home-brown)] backdrop-blur-sm transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] max-sm:flex-1"
          >
            <UtensilsCrossed className="h-[18px] w-[18px] stroke-[2.2]" aria-hidden="true" />
            See the menu
          </Link>
        </div>
      </div>
    </section>
  );
}
