import Link from "next/link";
import {
  CONE_PRICING,
  CUP_SERVING_OPTIONS,
  SHAKE_SIZES,
  formatRupees,
} from "@/data/menu";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

/**
 * The price board.
 *
 * Every number on this page comes from data/menu.ts — the same source the cone,
 * cup and shake pages price from — so the board can never drift out of sync with
 * what the customer is charged at checkout. Nothing here is written by hand.
 *
 * Why it exists: the shop's discount is steep and real (a Family Pack saves
 * Rs. 380) and until now none of it appeared before the inner pages. Discounts
 * that a visitor has to hunt for do not convert.
 *
 * Why it looks like a parlour menu board rather than a row of "deal cards":
 * three ruled columns let someone compare a 2-scoop cup against a 6-scoop pack
 * in one glance, which is the actual decision being made. Three glossy cards
 * with big percentages would look like every other promo section on the web and
 * would hide the scoop counts that drive the choice.
 */

type Row = {
  name: string;
  detail: string;
  price: number;
  originalPrice: number;
  highlight?: string;
};

const CONE_ROWS: Row[] = [
  {
    name: "Single Cone",
    detail: "One scoop, any flavour",
    price: CONE_PRICING.price,
    originalPrice: CONE_PRICING.originalPrice,
  },
];

const CUP_ROWS: Row[] = CUP_SERVING_OPTIONS.map((option) => ({
  name: option.name,
  detail: `${option.scoops} scoops`,
  price: option.price,
  originalPrice: option.originalPrice,
  highlight: option.id === "family-pack" ? "Biggest saving" : undefined,
}));

const SHAKE_ROWS: Row[] = (
  Object.entries(SHAKE_SIZES) as [string, (typeof SHAKE_SIZES)[keyof typeof SHAKE_SIZES]][]
).map(([size, value]) => ({
  name: `${size} Shake`,
  detail: value.volume,
  price: value.price,
  originalPrice: value.originalPrice,
}));

const COLUMNS = [
  { title: "Cones", href: "/cones", rows: CONE_ROWS },
  { title: "Cups & Packs", href: "/cups", rows: CUP_ROWS },
  { title: "Shakes", href: "/shakes", rows: SHAKE_ROWS },
] as const;

function PriceRow({ row }: { row: Row }) {
  const saving = row.originalPrice - row.price;

  return (
    <li className="flex items-start justify-between gap-4 border-t border-[rgba(255,255,255,0.16)] py-4 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="font-display text-[1.08rem] font-extrabold leading-tight tracking-[-0.03em]">
          {row.name}
        </p>
        <p className="mt-1 text-[0.86rem] font-semibold text-[rgba(255,255,255,0.72)]">
          {row.detail}
        </p>
        {row.highlight && (
          <span className="mt-2.5 inline-flex items-center rounded-full bg-[var(--home-golden)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.1em] text-[var(--home-brown)]">
            {row.highlight}
          </span>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]">
          {formatRupees(row.price)}
        </p>
        <p className="mt-1.5 text-[0.82rem] font-bold text-[rgba(255,255,255,0.6)] line-through">
          {formatRupees(row.originalPrice)}
        </p>
        {/* Golden, because the saving is the one number on this board we want a
            skimming eye to catch. White would make it read as another footnote. */}
        <p className="mt-1 text-[0.8rem] font-black text-[var(--home-golden)]">
          Save {formatRupees(saving)}
        </p>
      </div>
    </li>
  );
}

export default function HomeDeals() {
  return (
    <section
      id="prices"
      className="scroll-mt-[var(--header-height)] bg-[var(--home-brown)] px-[clamp(16px,5vw,72px)] py-[clamp(64px,8vw,120px)] text-white"
      aria-labelledby="prices-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--home-golden)]" />
          <span className="text-xs font-black uppercase tracking-[0.14em] text-white">
            Every rate, one place
          </span>
        </div>

        <h2
          id="prices-title"
          className="max-w-[860px] font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.06em]"
        >
          The whole price list.
        </h2>
        <p className="mt-4 max-w-[580px] text-[clamp(0.98rem,1.4vw,1.15rem)] font-semibold leading-relaxed text-[rgba(255,255,255,0.75)]">
          No hidden rates and no small print. What you see here is what you pay,
          whether you walk in or order on WhatsApp.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-5 max-lg:grid-cols-1 max-sm:mt-9 max-sm:gap-4">
          {COLUMNS.map((column) => (
            <div
              key={column.title}
              className="flex flex-col rounded-[24px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.06)] p-7 max-sm:p-6"
            >
              <h3 className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.04em]">
                {column.title}
              </h3>

              <ul className="mt-6 grid">
                {column.rows.map((row) => (
                  <PriceRow key={row.name} row={row} />
                ))}
              </ul>

              {/* mt-auto pins the link to the bottom of every column, so the
                  three panels end on one line even though Cones has a single
                  row and Cups has five. */}
              <Link
                href={column.href}
                className="mt-auto inline-flex min-h-11 items-center pt-6 font-black underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-white)]"
              >
                Order {column.title.toLowerCase()}
              </Link>
            </div>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--home-golden)] px-8 text-sm font-black text-[var(--home-brown)] transition-transform duration-200 ease-custom hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-white)] max-sm:w-full"
        >
          Order on WhatsApp
        </a>
      </div>
    </section>
  );
}
