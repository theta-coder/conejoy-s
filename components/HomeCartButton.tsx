"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function HomeCartButton() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={`View cart with ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4a2618]/30 bg-white text-[#4a2618] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618]"
    >
      <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e63946] px-1 text-[0.65rem] font-black text-white shadow-md animate-scale">
          {totalCount}
        </span>
      )}
    </button>
  );
}
