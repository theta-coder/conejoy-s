import { FLAVOURS } from "@/data/flavours";
import { Clock, Truck, Sparkles, Zap } from "lucide-react";

const REASONS = [
  {
    icon: Clock,
    title: "Open till midnight",
    body: "Doors stay open from 12 PM to 12 AM, long after most places have closed.",
    color: "text-amber-400",
  },
  {
    icon: Truck,
    title: "Home delivery",
    body: "Send your order on WhatsApp and we bring it to you across Lahore.",
    color: "text-emerald-400",
  },
  {
    icon: Sparkles,
    title: `${FLAVOURS.length} signature flavours`,
    body: "Every flavour comes as a cone, a cup or a thick blended shake.",
    color: "text-rose-400",
  },
  {
    icon: Zap,
    title: "Order in seconds",
    body: "No app, no signup. Build your order here and send it straight to WhatsApp.",
    color: "text-sky-400",
  },
];

export default function HomeWhyUs() {
  return (
    <section
      id="why-us"
      className="scroll-mt-[var(--header-height)] bg-[#4a2618] px-[clamp(16px,5vw,72px)] py-[clamp(72px,9vw,128px)] text-white"
      aria-labelledby="why-us-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <h2
          id="why-us-title"
          className="max-w-[780px] font-display text-[clamp(2.5rem,5.2vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.065em]"
        >
          Why Cone Joy&rsquo;s.
        </h2>
        <p className="mt-5 max-w-[560px] text-base font-semibold leading-relaxed text-white/80">
          A small Chung ice cream shop, open late and built around one thing &mdash; pure delicious scoops.
        </p>

        <ul className="mt-12 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:mt-9 max-sm:grid-cols-1 max-sm:gap-4 list-none p-0">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <li
                key={reason.title}
                className="rounded-[24px] border border-white/20 bg-white/10 p-7 max-sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/15"
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 ${reason.color}`}>
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <h3 className="mt-4 font-display text-[1.35rem] font-extrabold leading-tight tracking-[-0.03em] text-white">
                  {reason.title}
                </h3>
                <p className="mt-2.5 text-[0.92rem] font-medium leading-relaxed text-white/75">
                  {reason.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
