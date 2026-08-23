"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { FLAVOURS } from "@/data/flavours";

type ShakeSize = "Regular" | "Large";

interface ShakeLabProps {
  selectedIndex?: number;
  selectionRequestKey?: number;
}

interface ShakeFlavour {
  id: string;
  name: string;
  note: string;
  image: string;
  fallback: string;
  accent: string;
}

const SHAKE_NOTES: Record<string, string> = {
  mango: "Golden mango, cream, pistachio finish",
  kulfa: "Cardamom kulfa, almond, pistachio",
  chocolate: "Deep cocoa, chocolate chips, cream",
  blueberry: "Black currant, berry ribbon, cream",
  "caramel-crunch": "Caramel ribbon, golden crunch, cream",
  "tutti-frutti": "Fruit cream, candied fruit, soft vanilla",
  "coffee-chino": "Espresso, ice cream, roasted coffee crumb",
  pistachio: "Pistachio cream, fine nut finish",
  vanilla: "Vanilla bean, chilled cream, soft whip",
  strawberry: "Strawberry cream, berry ribbon, fruit crumb",
  "coconut-delight": "Coconut cream, toasted coconut finish",
  "kit-kat": "Milk chocolate, wafer crunch, cocoa ribbon",
};

const SHAKE_FILE_IDS: Record<string, string> = {
  chocolate: "chocolate-chip",
  blueberry: "black-currant",
  pistachio: "pista",
};

const SHAKES: ShakeFlavour[] = FLAVOURS.map((flavour) => {
  const fileId = SHAKE_FILE_IDS[flavour.id] ?? flavour.id;
  return {
    id: flavour.id,
    name: flavour.name,
    note: SHAKE_NOTES[flavour.id],
    image: `/assets/shakes/${fileId}.webp`,
    fallback: `/assets/shakes/${fileId}.png`,
    accent: flavour.color,
  };
});

const SIZES: Record<ShakeSize, { volume: string; price: number }> = {
  Regular: { volume: "12 oz", price: 420 },
  Large: { volume: "16 oz", price: 520 },
};

const TOPPINGS = ["Whipped cream", "Wafer crunch", "Chocolate drizzle"];

export default function ShakeLab({ selectedIndex, selectionRequestKey }: ShakeLabProps) {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState<ShakeSize>("Regular");
  const [toppings, setToppings] = useState<string[]>(["Whipped cream"]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const activeShake = SHAKES[activeIndex];

  useEffect(() => {
    if (selectedIndex === undefined) return;
    setActiveIndex(Math.max(0, Math.min(SHAKES.length - 1, selectedIndex)));
  }, [selectedIndex, selectionRequestKey]);

  const toggleTopping = (topping: string) => {
    setToppings((current) =>
      current.includes(topping)
        ? current.filter((item) => item !== topping)
        : [...current, topping]
    );
  };

  const handleAdd = () => {
    addToCart({
      type: "Shake",
      flavourId: activeShake.id,
      flavour: activeShake.name,
      quantity,
      size,
      servingId: `${activeShake.id}-${size.toLowerCase()}-${toppings.join("-").toLowerCase().replace(/\s+/g, "-")}`,
      unitPrice: SIZES[size].price,
      image: activeShake.image,
      color: activeShake.accent,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      id="shakes"
      className="shake-lab relative min-h-[calc(100dvh-var(--header-height,126px))] overflow-hidden px-4 py-10 text-ink transition-colors duration-500 max-md:py-6 max-sm:flex max-sm:items-center max-sm:py-2"
      style={{ "--shake-accent": activeShake.accent } as React.CSSProperties}
    >
      <div className="relative mx-auto w-full max-w-[1380px]">
        <header className="mb-8 max-w-[760px] max-md:mb-4 max-sm:mb-2">
          <p className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.2em]">Cone Joys Shake Lab · 12 signature pours</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,5.6vw,5.4rem)] font-extrabold leading-[0.9] tracking-[-0.075em] max-sm:mt-1 max-sm:text-[1.65rem] max-sm:leading-none">
            Churned to your specification.
          </h2>
          <p className="shake-muted mt-5 max-w-[54ch] text-sm font-semibold leading-relaxed max-sm:hidden">
            Your favourite Cone Joys flavour, blended cold and finished exactly your way.
          </p>
        </header>

        <div className="grid grid-cols-[0.82fr_1.35fr_0.9fr] gap-4 max-xl:grid-cols-[0.72fr_1.28fr] max-md:grid-cols-1 max-sm:gap-2">
          <div className="shake-panel border p-3 max-md:order-2 max-md:border-0 max-md:bg-transparent max-md:p-0">
            <p className="shake-muted mb-3 px-2 text-[0.72rem] font-black uppercase tracking-[0.16em] max-sm:mb-1 max-sm:px-0">Select your pour</p>
            <div className="grid grid-cols-2 gap-1.5 max-md:flex max-md:overflow-x-auto max-md:pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Shake flavours">
              {SHAKES.map((shake, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={shake.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setActiveIndex(index)}
                    className={`shake-flavour min-h-[92px] min-w-0 border p-3 text-left transition-[transform,background-color,border-color] active:scale-[0.98] max-md:min-w-[62vw] max-sm:min-h-[50px] max-sm:min-w-[38vw] max-sm:px-2.5 max-sm:py-2 ${isActive ? "is-active" : "hover:-translate-y-0.5"}`}
                  >
                    <span className="shake-muted block text-[0.72rem] font-black tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-2 block font-display text-[0.88rem] font-extrabold leading-tight tracking-[-0.03em] max-sm:mt-1 max-sm:text-[0.76rem]">{shake.name}</span>
                    <span className="shake-muted mt-1.5 block text-[0.75rem] leading-snug max-xl:hidden max-md:block max-sm:hidden">{shake.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="shake-stage relative min-h-[650px] overflow-hidden border max-xl:min-h-[620px] max-md:order-1 max-md:min-h-[360px] max-sm:min-h-[220px]">
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 max-sm:left-3 max-sm:top-3">
              <span className="h-2 w-2 rounded-full bg-ink" />
              <span className="text-[0.72rem] font-black uppercase tracking-[0.14em]">Freshly churned</span>
            </div>
            <picture key={activeShake.id}>
              <source srcSet={activeShake.image} type="image/webp" />
              <img
                src={activeShake.fallback}
                alt={`${activeShake.name} premium ice-cream shake`}
                width={900}
                height={900}
                loading={activeIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover animate-badge-pop motion-reduce:animate-none"
              />
            </picture>
            <div className="shake-stage-caption absolute inset-x-0 bottom-0 flex items-end justify-between p-6 pt-24 max-sm:p-3 max-sm:pt-12">
              <div>
                <p className="font-display text-[clamp(1.7rem,3vw,3rem)] font-extrabold leading-none tracking-[-0.055em] max-sm:text-[1.25rem]">{activeShake.name}</p>
                <p className="mt-2 text-xs font-semibold opacity-65 max-sm:hidden">{activeShake.note}</p>
              </div>
              <span className="text-xs font-black tabular-nums">Rs. {SIZES[size].price}</span>
            </div>
          </div>

          <aside className="shake-panel flex flex-col border p-6 max-xl:col-span-2 max-xl:grid max-xl:grid-cols-2 max-xl:gap-8 max-md:order-3 max-md:col-span-1 max-md:grid-cols-1 max-md:gap-4 max-sm:grid-cols-2 max-sm:gap-2 max-sm:p-3" aria-label="Customize your shake">
            <div>
              <p className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.16em] max-sm:hidden">Make it yours</p>
              <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.05em] max-sm:hidden">Finish the build.</h3>
              <fieldset className="mt-8 max-sm:mt-0">
                <legend className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.12em]">Size</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(Object.keys(SIZES) as ShakeSize[]).map((item) => (
                    <button key={item} type="button" onClick={() => setSize(item)} className={`shake-option border px-3 py-3 text-left transition-colors max-sm:px-2 max-sm:py-2 ${size === item ? "is-active" : ""}`}>
                      <span className="block text-xs font-black">{item}</span>
                      <span className="shake-muted mt-1 block text-[0.75rem]">{SIZES[item].volume}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <fieldset className="xl:mt-8 max-sm:hidden">
              <legend className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.12em]">Finishing touches</legend>
              <div className="mt-3 space-y-1">
                {TOPPINGS.map((topping) => {
                  const checked = toppings.includes(topping);
                  return (
                    <button key={topping} type="button" aria-pressed={checked} onClick={() => toggleTopping(topping)} className="shake-divider flex w-full items-center justify-between border-b py-3 text-left text-xs font-bold">
                      <span>{topping}</span>
                      <span className={`shake-check flex h-5 w-5 items-center justify-center border text-[0.64rem] ${checked ? "is-active" : "text-transparent"}`}>✓</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <details className="shake-divider col-span-2 border-y py-2 sm:hidden">
              <summary className="cursor-pointer text-[0.72rem] font-black uppercase tracking-[0.12em]">Finishing touches · {toppings.length} selected</summary>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {TOPPINGS.map((topping) => (
                  <button key={topping} type="button" aria-pressed={toppings.includes(topping)} onClick={() => toggleTopping(topping)} className={`shake-option flex min-h-[44px] items-center justify-center border px-2 py-2 text-[0.72rem] font-bold ${toppings.includes(topping) ? "is-active" : ""}`}>{topping}</button>
                ))}
              </div>
            </details>

            <div className="mt-auto pt-8 max-xl:col-span-2 max-xl:pt-0 max-md:col-span-1 max-sm:col-span-2">
              <div className="shake-divider mb-3 flex items-center justify-between border-t pt-4 max-sm:mb-2 max-sm:pt-2">
                <span className="shake-muted text-[0.72rem] font-black uppercase tracking-[0.12em]">Quantity</span>
                <div className="shake-quantity flex items-center border">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} className="h-11 w-11 disabled:opacity-25" aria-label="Decrease shake quantity">−</button>
                  <span className="w-9 text-center text-xs font-black tabular-nums">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} disabled={quantity === 10} className="h-11 w-11 disabled:opacity-25" aria-label="Increase shake quantity">+</button>
                </div>
              </div>
              <button type="button" onClick={handleAdd} className={`min-h-[52px] w-full px-5 text-xs font-black uppercase tracking-[0.12em] transition-all active:scale-[0.99] max-sm:min-h-[48px] ${added ? "bg-green-700 text-white" : "shake-cta"}`}>
                {added ? "Added to your order" : `Add shake · Rs. ${(SIZES[size].price * quantity).toLocaleString("en-PK")}`}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
