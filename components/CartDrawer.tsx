"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalCount } = useCart();
  const pricedTotal = cart.reduce(
    (total, item) => total + (item.unitPrice ?? 0) * item.quantity,
    0
  );
  const hasPricedItems = cart.some((item) => item.unitPrice !== undefined);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden isolate" aria-labelledby="cart-heading" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-panel text-ink shadow-2xl flex flex-col justify-between border-l border-[rgba(21,21,15,0.12)]">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[rgba(21,21,15,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 id="cart-heading" className="text-xl font-black uppercase tracking-tight">
                Your Order
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-ink text-panel text-[0.7rem] font-bold">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-[rgba(21,21,15,0.08)] transition-colors text-ink text-sm font-bold"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Drawer Items */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[rgba(21,21,15,0.06)]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-ink/60 py-12">
                <svg className="w-12 h-12 opacity-30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm font-semibold">Your scoop cart is empty</p>
                <p className="text-xs opacity-75 mt-1">Explore our Cones or Cups to add signature flavours.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  {/* Item Image Badge */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center p-1 flex-shrink-0 shadow-sm border border-black/10"
                    style={{ backgroundColor: item.color || "#f1b844" }}
                  >
                    <img src={item.image} alt={item.flavour} className="w-full h-full object-contain drop-shadow-sm" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] font-extrabold uppercase px-1.5 py-0.5 rounded bg-ink/10">
                        {item.type}
                      </span>
                      <span className="text-[0.65rem] opacity-60 font-semibold">
                        {item.size}{item.scoopCount ? ` · ${item.scoopCount} scoop${item.scoopCount === 1 ? "" : "s"}` : ""}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-ink truncate mt-0.5">{item.flavour}</h3>
                    {item.unitPrice !== undefined && (
                      <p className="mt-1 text-xs font-bold text-ink/65">
                        {`Rs. ${item.unitPrice.toLocaleString("en-PK")} × ${item.quantity} = Rs. ${(item.unitPrice * item.quantity).toLocaleString("en-PK")}`}
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-[rgba(21,21,15,0.18)] bg-white/70">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-ink/10 rounded-l-lg"
                          aria-label={`Decrease ${item.flavour} quantity`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-ink/10 rounded-r-lg"
                          aria-label={`Increase ${item.flavour} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[0.7rem] font-bold text-red-600 hover:underline ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[rgba(21,21,15,0.08)] bg-panel/80 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold opacity-75">
                <span>Total Items</span>
                <span>{totalCount}</span>
              </div>
              {hasPricedItems && (
                <div className="flex items-center justify-between text-base font-black">
                  <span>Grand Total</span>
                  <span>Rs. {pricedTotal.toLocaleString("en-PK")}</span>
                </div>
              )}
              <a
                href={`https://wa.me/923407258700?text=Hi%20Cone%20Joys%2C%20I%20would%20like%20to%20order%3A%0A${encodeURIComponent(
                  cart.map((c) => `- ${c.quantity}x ${c.flavour} (${c.type}, ${c.size}${c.scoopCount ? `, ${c.scoopCount} scoops` : ""})${c.unitPrice ? ` = Rs. ${(c.unitPrice * c.quantity).toLocaleString("en-PK")}` : ""}`).join("\n")
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] rounded-full bg-ink text-panel font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg text-center"
              >
                <span>Checkout via WhatsApp</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <button
                type="button"
                onClick={clearCart}
                className="text-[0.7rem] font-extrabold text-ink/50 hover:text-ink hover:underline text-center py-1"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
