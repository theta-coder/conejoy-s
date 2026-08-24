"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

/**
 * Persistent order bar for phones.
 *
 * The home page is long, and once someone is deep in the price list, acting on
 * what they just read costs a scroll all the way back to the header. This keeps
 * the action one thumb-reach away for the whole journey.
 *
 * Why a full-width bar on phones instead of the round FloatingWhatsApp button:
 * a 56px circle in the bottom-right corner is a small target on a phone, it
 * carries no label, and it covers page content rather than reserving space
 * beside it. The circle stays — it is the better fit on desktop, where a fixed
 * bar would eat viewport height for a button the sticky header already shows.
 * page.tsx renders each one at the size it suits.
 *
 * Three rules it follows:
 *
 * - Hidden at the top of the page. The hero has its own CTA; showing this over
 *   it would double the same button on one screen.
 *
 * - Hidden once the footer is on screen, so it never sits on top of the footer
 *   links — the classic way these bars turn annoying at the end of a page.
 *
 * - Its buttons leave the tab order while it is off screen, so a keyboard user
 *   cannot focus a control they cannot see.
 */
export default function HomeStickyOrderBar() {
  const { totalCount, setIsCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const atFooterRef = useRef(false);
  const pastHeroRef = useRef(false);

  useEffect(() => {
    /* Both conditions are read from scroll position rather than an
       IntersectionObserver. One rAF-throttled getBoundingClientRect is cheap,
       and unlike an observer it also settles correctly when the page is
       restored from bfcache or resized — an observer only re-reports when an
       edge is actually crossed, which can leave the bar stuck after a rotate. */
    let frame = 0;

    const measure = () => {
      frame = 0;
      const viewport = window.innerHeight;

      pastHeroRef.current = window.scrollY > viewport * 0.6;

      const footer = document.querySelector("footer");
      atFooterRef.current = footer
        ? footer.getBoundingClientRect().top < viewport * 0.9
        : false;

      setIsVisible(pastHeroRef.current && !atFooterRef.current);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(74,38,24,0.15)] bg-[#fdf6e3]/97 px-3 pt-2.5 shadow-[0_-10px_30px_rgba(74,38,24,0.08)] backdrop-blur-md transition-transform duration-300 ease-custom motion-reduce:transition-none md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2.5">
        {totalCount > 0 && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            tabIndex={isVisible ? 0 : -1}
            aria-label={`View cart with ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
            className="relative inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[rgba(74,38,24,0.25)] bg-white text-[var(--home-brown)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-brown)]"
          >
            <ShoppingBag className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--home-brown)] px-1 text-[0.62rem] font-black text-white shadow-md">
              {totalCount}
            </span>
          </button>
        )}

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          tabIndex={isVisible ? 0 : -1}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--home-brown)] px-6 text-sm font-black text-white shadow-[0_10px_28px_rgba(74,38,24,0.2)] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-brown)]"
        >
          <MessageCircle className="h-[18px] w-[18px] stroke-[2.2]" aria-hidden="true" />
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
