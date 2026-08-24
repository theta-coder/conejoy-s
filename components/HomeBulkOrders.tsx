import Link from "next/link";
import { Check, PartyPopper } from "lucide-react";
import { CUP_SERVING_OPTIONS, formatRupees } from "@/data/menu";

/**
 * Bulk and party orders.
 *
 * The two pack sizes already exist in the menu but nothing on the site tells a
 * customer who they are for. A 12-scoop Family Pack is not an impulse buy — it
 * is bought for a birthday, a dinner or a function, and that buyer arrives with
 * a completely different intent from someone who wants one cone. Naming the
 * occasion is what turns the pack from an expensive cup into an obvious choice.
 *
 * The WhatsApp link carries its own pre-filled message rather than reusing the
 * site-wide one. A party enquiry cannot be answered without a date and a
 * headcount, so the message opens that conversation instead of making the shop
 * ask twice.
 *
 * Golden band, deliberately: every other section on the home page sits on cream.
 * Two colour breaks — this one and the brown price board — stop the page from
 * reading as one continuous scroll and give the eye a place to stop.
 */

const BULK_WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20need%20a%20bulk%20order%20for%20an%20event.%20Please%20share%20details.";

/** Pulled by id so the copy can never quote a price the cart would not charge. */
const PACKS = CUP_SERVING_OPTIONS.filter(
  (option) => option.id === "small-pack" || option.id === "family-pack",
);

const SUITS = [
  "Birthdays and mehndi nights",
  "Office and school parties",
  "Family dinners and get-togethers",
] as const;

export default function HomeBulkOrders() {
  return (
    <section
      id="parties"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-golden)] px-[clamp(16px,5vw,72px)] py-[clamp(64px,8vw,120px)] text-[var(--home-brown)]"
      aria-labelledby="parties-title"
    >
      <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 items-start gap-[clamp(36px,6vw,96px)] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(74,38,24,0.2)] bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <PartyPopper className="h-3.5 w-3.5 stroke-[2.4]" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.14em]">
              Bulk &amp; event orders
            </span>
          </div>

          <h2
            id="parties-title"
            className="max-w-[680px] font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em]"
          >
            Feeding a whole party?
          </h2>
          {/* 0.9 alpha, not the 0.75-0.78 the cream sections use for muted body
              copy: golden is a far lighter ground than cream, and at 0.78 this
              measured 4.29:1 — under the 4.5:1 AA floor for text this size. */}
          <p className="mt-4 max-w-[520px] text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(74,38,24,0.9)]">
            Order by the pack instead of by the cup. Pick your flavours, tell us
            the date and headcount on WhatsApp, and we will have it ready.
          </p>

          <ul className="mt-8 grid gap-3.5">
            {SUITS.map((suit) => (
              <li key={suit} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--home-brown)] text-white">
                  <Check className="h-3 w-3 stroke-[3.5]" aria-hidden="true" />
                </span>
                <span className="text-[0.98rem] font-bold leading-relaxed">{suit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={BULK_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--home-brown)] px-8 text-sm font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#381c11] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
            >
              Ask about a bulk order
            </a>
            <Link
              href="/cups"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full border border-[rgba(74,38,24,0.35)] bg-white/60 px-8 text-sm font-black text-[var(--home-brown)] backdrop-blur-sm transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
            >
              See all pack sizes
            </Link>
          </div>
        </div>

        <ul className="grid gap-4 lg:col-span-6">
          {PACKS.map((pack) => (
            <li
              key={pack.id}
              className="rounded-[28px] border border-[rgba(74,38,24,0.15)] bg-white/95 p-[clamp(24px,3vw,36px)] shadow-[0_20px_50px_rgba(74,38,24,0.1)] backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-none tracking-[-0.04em]">
                    {pack.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-[rgba(74,38,24,0.75)]">
                    {pack.scoops} scoops &middot; mix any flavours
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-none tracking-[-0.04em]">
                    {formatRupees(pack.price)}
                  </p>
                  <p className="mt-1.5 text-[0.84rem] font-bold text-[rgba(74,38,24,0.55)] line-through">
                    {formatRupees(pack.originalPrice)}
                  </p>
                </div>
              </div>

              <p className="mt-5 inline-flex items-center rounded-full bg-[var(--home-brown)] px-4 py-1.5 text-[0.72rem] font-black uppercase tracking-[0.1em] text-white">
                You save {formatRupees(pack.saving)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
