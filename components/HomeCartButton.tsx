"use client";

import { useCart } from "@/context/CartContext";

/**
 * Cart access for the home page.
 *
 * Kept as its own tiny client component so HomeHeader can stay a server
 * component — only this button needs the cart context, and pulling the whole
 * header across the client boundary would ship the nav and logo markup as JS
 * for no reason.
 */
export default function HomeCartButton() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={`View cart with ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(74,38,24,0.5)] bg-[var(--home-white)] text-[var(--home-brown)] transition-transform duration-200 ease-custom hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
    >
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--home-brown)] px-1 text-[0.62rem] font-black text-[var(--home-white)] shadow-md">
          {totalCount}
        </span>
      )}
    </button>
  );
}
