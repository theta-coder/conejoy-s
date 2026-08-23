import Image from "next/image";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

export default function HomeHero() {
  return (
    <section className="relative min-h-[calc(100dvh-80px)] overflow-hidden px-[clamp(16px,5vw,72px)] max-md:min-h-[calc(100dvh-64px)] max-sm:min-h-[calc(100dvh-56px)]">
      <div className="mx-auto grid min-h-[inherit] w-full max-w-[1380px] grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)] items-center gap-[clamp(24px,6vw,96px)] py-10 max-md:grid-cols-1 max-md:content-start max-md:gap-4 max-md:py-8 max-sm:py-6">
        <div className="home-hero-copy relative z-10 max-w-[680px] max-md:w-full">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.16em] max-sm:mb-3 max-sm:text-[0.68rem]">
            Cone Joy&apos;s Ice Cream
          </p>
          <h1 className="max-w-[680px] font-display text-[clamp(3.4rem,4.9vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.075em] max-md:max-w-[600px] max-md:text-[clamp(3rem,12vw,5.4rem)] max-sm:text-[clamp(2.65rem,12.5vw,4rem)]">
            Lahore&apos;s cones, cups and shakes.
          </h1>
          <p className="mt-6 max-w-[510px] text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-relaxed text-ink/75 max-sm:mt-4 max-sm:text-[0.98rem]">
            Visit us in Chung or order for delivery.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 max-sm:mt-6 max-sm:w-full">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 text-sm font-black text-panel shadow-[0_12px_30px_rgba(21,21,15,0.2)] transition-transform duration-200 ease-custom hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:flex-1 max-sm:px-5"
            >
              Order on WhatsApp
            </a>
            <a
              href="#categories"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full border-2 border-ink bg-transparent px-7 text-sm font-black text-ink transition-colors duration-200 hover:bg-panel focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:flex-1 max-sm:px-5"
            >
              See the menu
            </a>
          </div>
        </div>

        <div className="home-hero-visual relative flex h-[min(74svh,720px)] min-h-[520px] items-center justify-center max-md:h-[min(48svh,440px)] max-md:min-h-[320px] max-sm:h-[min(44svh,390px)] max-sm:min-h-[280px]">
          <div className="absolute aspect-square w-[min(43vw,620px)] rounded-full bg-panel shadow-[inset_0_0_0_1px_rgba(21,21,15,0.09),0_32px_80px_rgba(78,88,0,0.18)] max-md:w-[min(78vw,410px)]" />
          <div className="absolute aspect-square w-[min(35vw,500px)] rounded-full border border-dashed border-ink/20 max-md:w-[min(63vw,330px)]" />
          <Image
            src="/assets/cones/mango.webp"
            alt="Mango ice cream cone from Cone Joy's"
            width={540}
            height={1500}
            sizes="(max-width: 767px) 58vw, (max-width: 1279px) 36vw, 430px"
            className="relative z-10 h-[92%] w-auto object-contain drop-shadow-[0_28px_28px_rgba(57,61,10,0.2)] max-md:h-[96%]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
