import Link from "next/link";
import { IceCreamCone, MessageCircle, Bike } from "lucide-react";

/**
 * How ordering works, in three steps.
 *
 * The shop has no checkout — an order becomes a WhatsApp message. That is fast
 * once you have done it, but a first-time visitor cannot tell what happens after
 * they press the green button, and uncertainty at the last step is where local
 * F&B sites lose orders. Three steps remove the guess.
 *
 * Icons come from lucide-react, the set the header, contact card and floating
 * button already use. Matching an existing set matters more than picking the
 * "best" icon here: three glyphs at one stroke weight read as a family, while a
 * mix of sources (or emoji, which render in a different typeface and palette on
 * every device) would make this the one section that looks bolted on.
 */

const STEPS = [
  {
    index: "01",
    Icon: IceCreamCone,
    title: "Pick your flavour",
    body: "Choose a cone, a cup or a shake, set the size and add it to your order. Twelve flavours, no account needed.",
  },
  {
    index: "02",
    Icon: MessageCircle,
    title: "Send it on WhatsApp",
    body: "Your order opens in WhatsApp already written out — flavours, sizes and total. Press send and you are done.",
  },
  {
    index: "03",
    Icon: Bike,
    title: "Collect it or get it delivered",
    body: "Pick it up from the Chung shop, or we bring it to you. We confirm timing on the same chat.",
  },
] as const;

export default function HomeHowToOrder() {
  return (
    <section
      id="how-to-order"
      className="scroll-mt-[var(--header-height)] border-t border-[rgba(74,38,24,0.08)] bg-[var(--home-cream)] px-[clamp(16px,5vw,72px)] py-[clamp(64px,8vw,120px)]"
      aria-labelledby="how-to-order-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.15)] bg-white/70 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--home-golden)]" />
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--home-brown)]">
            No app &middot; No signup
          </span>
        </div>

        <h2
          id="how-to-order-title"
          className="max-w-[860px] font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-[var(--home-brown)]"
        >
          Ordering takes a minute.
        </h2>
        <p className="mt-4 max-w-[580px] text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.75)]">
          Three steps from picking a flavour to answering the door.
        </p>

        <ol className="mt-10 grid grid-cols-3 gap-5 max-md:grid-cols-1 max-sm:gap-4">
          {STEPS.map(({ index, Icon, title, body }) => (
            <li
              key={index}
              className="relative flex flex-col rounded-[28px] border border-[rgba(74,38,24,0.15)] bg-white/95 p-[clamp(24px,3vw,36px)] shadow-[0_20px_50px_rgba(74,38,24,0.06)] backdrop-blur-sm"
            >
              {/* Step counter, set in the same "01 / 12" idiom the flavour data
                  already uses, so the numbering feels native to the brand. */}
              <span
                className="absolute right-6 top-6 font-display text-[0.82rem] font-black tracking-[0.14em] text-[rgba(74,38,24,0.35)]"
                aria-hidden="true"
              >
                {index} / 03
              </span>

              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(74,38,24,0.1)] bg-[var(--home-golden)] text-[var(--home-brown)] shadow-[0_8px_20px_rgba(74,38,24,0.14)]">
                <Icon className="h-7 w-7 stroke-[2.1]" aria-hidden="true" />
              </span>

              <h3 className="mt-5 font-display text-[1.35rem] font-extrabold leading-tight tracking-[-0.03em] text-[var(--home-brown)]">
                {title}
              </h3>
              <p className="mt-2.5 text-[0.94rem] font-semibold leading-relaxed text-[rgba(74,38,24,0.72)]">
                {body}
              </p>
            </li>
          ))}
        </ol>

        <Link
          href="#categories"
          className="mt-10 inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--home-brown)] px-8 text-sm font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(74,38,24,0.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] max-sm:w-full"
        >
          Start your order
        </Link>
      </div>
    </section>
  );
}
