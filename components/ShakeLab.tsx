"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

type ShakeSize = "Regular" | "Large";

interface ShakeFlavour {
  id: string;
  name: string;
  note: string;
  image: string;
  fallback: string;
  accent: string;
}

const SHAKES: ShakeFlavour[] = [
  {
    id: "mango-saffron",
    name: "Mango Saffron",
    note: "Alphonso mango, saffron ribbon, pistachio finish",
    image: "/assets/shakes/mango-saffron.webp",
    fallback: "/assets/shakes/mango-saffron.png",
    accent: "#f0ae19",
  },
  {
    id: "strawberry",
    name: "Strawberry Silk",
    note: "Strawberry cream, berry ribbon, crisp fruit crumb",
    image: "/assets/shakes/strawberry.webp",
    fallback: "/assets/shakes/strawberry.png",
    accent: "#d9848c",
  },
  {
    id: "dark-chocolate",
    name: "Dark Chocolate",
    note: "Deep cocoa, chocolate ribbon, fine cocoa crumble",
    image: "/assets/shakes/dark-chocolate.webp",
    fallback: "/assets/shakes/dark-chocolate.png",
    accent: "#6f4436",
  },
  {
    id: "chocolate-wafer",
    name: "Chocolate Wafer",
    note: "Milk chocolate, wafer crunch, whipped cream finish",
    image: "/assets/shakes/chocolate-wafer.webp",
    fallback: "/assets/shakes/chocolate-wafer.png",
    accent: "#9a6047",
  },
];

const SIZES: Record<ShakeSize, { volume: string; price: number }> = {
  Regular: { volume: "12 oz", price: 420 },
  Large: { volume: "16 oz", price: 520 },
};

const TOPPINGS = ["Whipped cream", "Wafer crunch", "Chocolate drizzle"];

export default function ShakeLab() {
  const { addToCart } = useCart();
  const [activeId, setActiveId] = useState(SHAKES[0].id);
  const [size, setSize] = useState<ShakeSize>("Regular");
  const [toppings, setToppings] = useState<string[]>(["Whipped cream"]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activeShake = useMemo(
    () => SHAKES.find((shake) => shake.id === activeId) ?? SHAKES[0],
    [activeId]
  );

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
    <section id="shakes" className="relative overflow-hidden bg-[#111315] text-[#f4f4ef] px-4 py-20 max-md:py-14 max-sm:py-10">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.09),transparent_34%)]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <header className="max-w-[760px] mb-12 max-md:mb-8">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/45">Cone Joys Shake Lab</p>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,6vw,5.8rem)] font-extrabold leading-[0.88] tracking-[-0.075em]">
            Churned to your specification.
          </h2>
          <p className="mt-5 max-w-[54ch] text-sm leading-relaxed text-white/58">
            Four signature ice-cream shakes. Pick a pour, set the size, then finish it your way.
          </p>
        </header>

        <div className="grid grid-cols-[0.72fr_1.42fr_0.86fr] gap-4 min-h-[650px] max-lg:grid-cols-[0.7fr_1.3fr] max-lg:min-h-0 max-md:grid-cols-1">
          <div className="border-y border-white/12 py-3 max-md:order-2 max-md:border-y-0 max-md:py-0">
            <p className="mb-3 px-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">Select your pour</p>
            <div className="flex flex-col max-md:flex-row max-md:overflow-x-auto max-md:pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Shake flavours">
              {SHAKES.map((shake, index) => {
                const isActive = shake.id === activeShake.id;
                return (
                  <button
                    key={shake.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setActiveId(shake.id)}
                    className={`group min-w-0 border-t border-white/10 px-2 py-5 text-left transition-colors max-md:min-w-[72vw] max-md:border max-md:border-white/12 max-md:p-4 ${
                      isActive ? "bg-white text-[#111315]" : "text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`block text-[0.62rem] font-black tabular-nums ${isActive ? "text-black/40" : "text-white/30"}`}>0{index + 1}</span>
                    <span className="mt-4 block font-display text-[clamp(1.05rem,1.6vw,1.45rem)] font-extrabold leading-tight tracking-[-0.04em]">{shake.name}</span>
                    <span className={`mt-2 block text-[0.7rem] leading-relaxed ${isActive ? "text-black/55" : "text-white/38"}`}>{shake.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[650px] overflow-hidden bg-[#d7dadd] max-lg:min-h-[620px] max-md:order-1 max-md:min-h-[500px] max-sm:min-h-[390px]">
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 text-[#111315]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeShake.accent }} />
              <span className="text-[0.62rem] font-black uppercase tracking-[0.14em]">Freshly churned</span>
            </div>
            <picture key={activeShake.id}>
              <source srcSet={activeShake.image} type="image/webp" />
              <img
                src={activeShake.fallback}
                alt={`${activeShake.name} premium ice-cream shake`}
                width={900}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover animate-badge-pop motion-reduce:animate-none"
              />
            </picture>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-black/12 to-transparent p-6 pt-24">
              <div>
                <p className="font-display text-[clamp(1.7rem,3vw,3rem)] font-extrabold leading-none tracking-[-0.055em]">{activeShake.name}</p>
                <p className="mt-2 text-xs font-semibold text-white/72">{activeShake.note}</p>
              </div>
              <span className="text-xs font-black tabular-nums">Rs. {SIZES[size].price}</span>
            </div>
          </div>

          <aside className="flex flex-col border border-white/12 bg-[#191b1d] p-6 max-lg:col-span-2 max-lg:grid max-lg:grid-cols-2 max-lg:gap-8 max-md:order-3 max-md:col-span-1 max-md:grid-cols-1 max-md:gap-5 max-sm:p-4" aria-label="Customize your shake">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">Make it yours</p>
              <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.05em]">Finish the build.</h3>

              <fieldset className="mt-8">
                <legend className="text-[0.66rem] font-black uppercase tracking-[0.12em] text-white/48">Size</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(Object.keys(SIZES) as ShakeSize[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`border px-3 py-3 text-left transition-colors ${size === item ? "border-white bg-white text-[#111315]" : "border-white/14 text-white hover:border-white/40"}`}
                    >
                      <span className="block text-xs font-black">{item}</span>
                      <span className={`mt-1 block text-[0.64rem] ${size === item ? "text-black/50" : "text-white/38"}`}>{SIZES[item].volume}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="lg:mt-8">
              <fieldset>
                <legend className="text-[0.66rem] font-black uppercase tracking-[0.12em] text-white/48">Finishing touches</legend>
                <div className="mt-3 space-y-2">
                  {TOPPINGS.map((topping) => {
                    const checked = toppings.includes(topping);
                    return (
                      <button
                        key={topping}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggleTopping(topping)}
                        className="flex w-full items-center justify-between border-b border-white/10 py-3 text-left text-xs font-bold"
                      >
                        <span>{topping}</span>
                        <span className={`flex h-5 w-5 items-center justify-center border text-[0.64rem] ${checked ? "border-white bg-white text-[#111315]" : "border-white/25 text-transparent"}`}>✓</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="mt-auto pt-8 max-lg:col-span-2 max-lg:pt-0 max-md:col-span-1">
              <div className="mb-3 flex items-center justify-between border-t border-white/12 pt-4">
                <span className="text-[0.66rem] font-black uppercase tracking-[0.12em] text-white/48">Quantity</span>
                <div className="flex items-center border border-white/16">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} className="h-9 w-9 disabled:opacity-25" aria-label="Decrease shake quantity">−</button>
                  <span className="w-9 text-center text-xs font-black tabular-nums">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} disabled={quantity === 10} className="h-9 w-9 disabled:opacity-25" aria-label="Increase shake quantity">+</button>
                </div>
              </div>
              <button type="button" onClick={handleAdd} className={`min-h-[52px] w-full px-5 text-xs font-black uppercase tracking-[0.12em] transition-colors active:scale-[0.99] ${added ? "bg-[#2e7d4f] text-white" : "bg-white text-[#111315] hover:bg-[#e8e9e6]"}`}>
                {added ? "Added to your order" : `Add shake · Rs. ${(SIZES[size].price * quantity).toLocaleString("en-PK")}`}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
