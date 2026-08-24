import { FLAVOURS } from "@/data/flavours";

/**
 * Every claim here is checkable against something real: the opening hours the
 * owner gave, the delivery they confirmed, the flavour list in data, and the
 * WhatsApp checkout the site actually uses. No invented ratings, review counts
 * or awards — a shop this size gains nothing from claims a customer can catch.
 *
 * The brown band is also the only dark section between the hero and the footer,
 * which stops the page reading as one long stretch of cream.
 */
const REASONS = [
  {
    icon: "🌙",
    title: "Open till midnight",
    body: "Doors stay open from 12 PM to 12 AM, long after most places have closed.",
  },
  {
    icon: "🛵",
    title: "Home delivery",
    body: "Send your order on WhatsApp and we bring it to you across Lahore.",
  },
  {
    icon: "🍦",
    title: `${FLAVOURS.length} signature flavours`,
    body: "Every flavour comes as a cone, a cup or a thick blended shake.",
  },
  {
    icon: "💬",
    title: "Order in seconds",
    body: "No app, no signup. Build your order here and send it straight to WhatsApp.",
  },
] as const;

export default function HomeWhyUs() {
  return (
    <section
      id="why-us"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-brown)] px-[clamp(16px,5vw,72px)] py-[clamp(72px,9vw,128px)] text-[var(--home-white)]"
      aria-labelledby="why-us-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <h2
          id="why-us-title"
          className="max-w-[780px] font-display text-[clamp(2.5rem,5.2vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.065em]"
        >
          Why Cone Joy&rsquo;s.
        </h2>
        <p className="mt-5 max-w-[560px] text-base font-semibold leading-relaxed text-[rgba(255,255,255,0.75)]">
          A small Chung ice cream shop, open late and built around one thing — good scoops.
        </p>

        <ul className="mt-12 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:mt-9 max-sm:grid-cols-1 max-sm:gap-4">
          {REASONS.map((reason) => (
            <li
              key={reason.title}
              className="rounded-[24px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.06)] p-7 max-sm:p-6"
            >
              <span className="text-[1.75rem] leading-none" aria-hidden="true">
                {reason.icon}
              </span>
              <h3 className="mt-4 font-display text-[1.35rem] font-extrabold leading-tight tracking-[-0.03em]">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-[0.92rem] font-semibold leading-relaxed text-[rgba(255,255,255,0.75)]">
                {reason.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
