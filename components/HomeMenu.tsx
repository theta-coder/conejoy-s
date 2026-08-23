import Image from "next/image";
import Link from "next/link";
import { FLAVOURS } from "@/data/flavours";
import {
  CONE_PRICING,
  CUP_SERVING_OPTIONS,
  SHAKE_FLAVOURS,
  SHAKE_SIZES,
  formatRupees,
} from "@/data/menu";

interface MenuItem {
  id: string;
  name: string;
  image: string;
  alt: string;
  href: string;
}

interface MenuGroupProps {
  title: string;
  description: string;
  priceLabel: string;
  items: MenuItem[];
}

function MenuGroup({ title, description, priceLabel, items }: MenuGroupProps) {
  return (
    <article className="home-menu-group rounded-[28px] border border-ink/50 bg-panel p-[clamp(16px,3vw,36px)] shadow-[0_18px_55px_rgba(67,73,10,0.1)]">
      <div className="max-w-[720px]">
        <h3 className="font-display text-[clamp(2.1rem,4vw,4.2rem)] font-extrabold leading-none tracking-[-0.06em]">
          {title}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/70">
          {description}
        </p>
        <p className="mt-2 text-sm font-black text-ink">{priceLabel}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex min-h-[44px] flex-col overflow-hidden rounded-2xl border border-ink/50 bg-white text-ink transition-[transform,border-color,box-shadow] duration-200 ease-custom hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_12px_28px_rgba(21,21,15,0.1)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-bg/35">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 639px) calc((100vw - 59px) / 2), (max-width: 1023px) calc((100vw - 104px) / 3), 280px"
                className="object-contain p-3 transition-transform duration-300 ease-custom group-hover:scale-[1.025]"
                loading="lazy"
              />
            </div>
            <span className="flex min-h-[66px] items-center px-3 py-3 text-[0.82rem] font-black leading-tight sm:text-sm">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}

const coneItems: MenuItem[] = FLAVOURS.map((flavour, index) => ({
  id: `cone-${flavour.id}`,
  name: flavour.name,
  image: flavour.webpSrc,
  alt: flavour.alt,
  href: `/cones?select=${index}`,
}));

const cupItems: MenuItem[] = FLAVOURS.map((flavour, index) => ({
  id: `cup-${flavour.id}`,
  name: flavour.name,
  image: flavour.cupWebpSrc,
  alt: flavour.cupAlt,
  href: `/cups?select=${index}`,
}));

const shakeItems: MenuItem[] = SHAKE_FLAVOURS.map((flavour, index) => ({
  id: `shake-${flavour.id}`,
  name: flavour.name,
  image: flavour.image,
  alt: `${flavour.name} ice cream shake`,
  href: `/shakes?select=${index}`,
}));

const cupPrices = CUP_SERVING_OPTIONS.map(
  (option) => `${option.name} ${formatRupees(option.price)}`,
).join(", ");

const shakePrices = Object.entries(SHAKE_SIZES)
  .map(([name, option]) => `${name} ${formatRupees(option.price)}`)
  .join(", ");

export default function HomeMenu() {
  return (
    <section
      id="menu"
      className="scroll-mt-[var(--header-height)] bg-bg px-[clamp(16px,5vw,72px)] py-[clamp(72px,9vw,128px)]"
      aria-labelledby="menu-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <h2
          id="menu-title"
          className="max-w-[820px] font-display text-[clamp(2.6rem,5.6vw,5.8rem)] font-extrabold leading-[0.9] tracking-[-0.07em]"
        >
          All 12 flavours. Three ways to enjoy them.
        </h2>
        <p className="mt-5 max-w-[620px] text-base font-semibold leading-relaxed text-ink/70">
          Choose a flavour, then open its category to customize your order.
        </p>

        <div className="mt-12 grid gap-6 max-sm:mt-8">
          <MenuGroup
            title="Cones"
            description="One cone, any signature flavour."
            priceLabel={`${formatRupees(CONE_PRICING.price)} each`}
            items={coneItems}
          />
          <MenuGroup
            title="Cups and packs"
            description="Choose a serving size after selecting your flavour."
            priceLabel={cupPrices}
            items={cupItems}
          />
          <MenuGroup
            title="Shakes"
            description="Choose regular or large after selecting your flavour."
            priceLabel={shakePrices}
            items={shakeItems}
          />
        </div>
      </div>
    </section>
  );
}
