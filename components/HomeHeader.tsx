import Image from "next/image";
import Link from "next/link";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-ink/50 bg-bg/95 px-[clamp(12px,4vw,64px)] backdrop-blur-md max-md:h-16 max-sm:h-14">
      <nav
        className="mx-auto flex h-full w-full max-w-[1380px] items-center justify-between gap-4"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          aria-label="Cone Joy's Ice Cream home"
        >
          <Image
            src="/assets/conejoys-logo-new.png"
            alt="Cone Joy's Ice Cream"
            width={500}
            height={311}
            sizes="(max-width: 640px) 78px, (max-width: 768px) 92px, 108px"
            className="h-auto w-[108px] max-md:w-[92px] max-sm:w-[78px]"
            loading="eager"
          />
        </Link>

        <div className="flex items-center gap-1 max-md:hidden">
          <Link className="home-nav-link" href="/cones">
            Cones
          </Link>
          <Link className="home-nav-link" href="/cups">
            Cups
          </Link>
          <Link className="home-nav-link" href="/shakes">
            Shakes
          </Link>
          <a className="home-nav-link" href="#menu">
            Menu
          </a>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ink px-5 text-sm font-black text-panel transition-transform duration-200 ease-custom hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:px-4 max-sm:text-xs"
        >
          Order on WhatsApp
        </a>
      </nav>
    </header>
  );
}
