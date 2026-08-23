import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Cones",
    description: "Choose from 12 cone flavours.",
    href: "/cones",
    image: "/assets/cones/chocolate.webp",
    alt: "Chocolate chip ice cream cone",
    className: "md:col-span-7 md:row-span-2 min-h-[560px] max-md:min-h-[440px] max-sm:min-h-[390px]",
    imageClassName: "h-[78%] w-auto bottom-0 right-[8%] max-md:h-[70%] max-sm:right-[4%]",
    sizes: "(max-width: 767px) 60vw, 44vw",
  },
  {
    name: "Cups",
    description: "Pick a cup or pack size.",
    href: "/cups",
    image: "/assets/cups/mango.webp",
    alt: "Mango ice cream cup",
    className: "md:col-span-5 min-h-[270px] max-sm:min-h-[330px]",
    imageClassName: "h-[78%] w-auto bottom-[-3%] right-[5%] max-sm:h-[72%]",
    sizes: "(max-width: 767px) 58vw, 30vw",
  },
  {
    name: "Shakes",
    description: "Regular and large shakes.",
    href: "/shakes",
    image: "/assets/shakes/mango.webp",
    alt: "Mango ice cream shake",
    className: "md:col-span-5 min-h-[270px] max-sm:min-h-[330px]",
    imageClassName: "h-[88%] w-auto bottom-[-8%] right-[2%] max-sm:h-[80%]",
    sizes: "(max-width: 767px) 62vw, 31vw",
  },
] as const;

export default function HomeCategories() {
  return (
    <section
      id="categories"
      className="scroll-mt-[var(--header-height)] bg-panel px-[clamp(16px,5vw,72px)] py-[clamp(72px,9vw,128px)]"
      aria-labelledby="categories-title"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <h2
          id="categories-title"
          className="max-w-[780px] font-display text-[clamp(2.5rem,5.2vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.065em]"
        >
          Pick your kind of joy.
        </h2>
        <p className="mt-5 max-w-[560px] text-base font-semibold leading-relaxed text-ink/70">
          Start with a cone, choose a cup, or make it a shake.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2 max-sm:mt-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative isolate overflow-hidden rounded-[28px] border border-ink/15 bg-bg text-ink shadow-[0_16px_45px_rgba(67,73,10,0.1)] transition-[transform,box-shadow] duration-300 ease-custom hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(67,73,10,0.16)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink ${category.className}`}
              aria-label={`Browse ${category.name}`}
            >
              <div className="relative z-20 max-w-[260px] p-7 max-sm:p-6">
                <h3 className="font-display text-[clamp(2rem,3.4vw,3.8rem)] font-extrabold leading-none tracking-[-0.055em]">
                  {category.name}
                </h3>
                <p className="mt-3 text-sm font-bold leading-relaxed text-ink/70">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center font-black underline decoration-2 underline-offset-4">
                  View {category.name.toLowerCase()}
                </span>
              </div>
              <Image
                src={category.image}
                alt={category.alt}
                width={category.name === "Cones" ? 511 : category.name === "Cups" ? 393 : 900}
                height={category.name === "Cones" ? 1332 : category.name === "Cups" ? 454 : 900}
                sizes={category.sizes}
                className={`absolute z-10 object-contain transition-transform duration-500 ease-custom group-hover:scale-[1.025] ${category.imageClassName}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
