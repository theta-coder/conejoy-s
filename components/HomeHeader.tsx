import Image from "next/image";
import Link from "next/link";
import HomeCartButton from "@/components/HomeCartButton";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

const NAV_LINKS = [
  { label: "Cones", href: "/cones" },
  { label: "Cups", href: "/cups" },
  { label: "Shakes", href: "/shakes" },
  { label: "Menu", href: "#categories" },
  { label: "Visit Us", href: "#visit" },
] as const;

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(74,38,24,0.12)] bg-[rgba(253,246,227,0.9)] px-[clamp(16px,4vw,64px)] shadow-[0_10px_30px_rgba(74,38,24,0.05)] backdrop-blur-md">
      <nav
        className="mx-auto flex h-20 w-full max-w-[1380px] items-center justify-between gap-4 max-md:h-16"
        aria-label="Primary navigation"
      >
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)]"
          aria-label="Cone Joy's Ice Cream home"
        >
          <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/conejoys-mascot-logo.png"
              alt="Cone Joy's Ice Cream Mascot Logo"
              width={500}
              height={500}
              sizes="(max-width: 640px) 44px, (max-width: 768px) 52px, 60px"
              className="h-auto w-[60px] max-md:w-[52px] max-sm:w-[44px] drop-shadow-sm"
              loading="eager"
            />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="font-display text-lg font-extrabold leading-none tracking-tight text-[var(--home-brown)]">
              ConeJoy&apos;s
            </span>
            <span className="mt-0.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[rgba(74,38,24,0.65)]">
              Scoop Shop · Lahore
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-[rgba(74,38,24,0.1)] bg-white/60 p-1.5 shadow-inner backdrop-blur-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full px-5 text-sm font-extrabold text-[rgba(74,38,24,0.8)] transition-all duration-200 hover:bg-[var(--home-brown)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-brown)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Cluster */}
        <div className="flex shrink-0 items-center gap-2.5 max-sm:gap-2">
          <HomeCartButton />

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--home-brown)] px-6 text-xs font-black uppercase tracking-wider text-[var(--home-white)] shadow-[0_8px_20px_rgba(74,38,24,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(74,38,24,0.25)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown)] max-sm:px-4 max-sm:text-[0.7rem]"
          >
            <svg className="h-4 w-4 fill-current max-sm:h-3.5 max-sm:w-3.5" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span className="max-sm:hidden">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>
        </div>
      </nav>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden -mx-[clamp(16px,4vw,64px)] border-t border-[rgba(74,38,24,0.1)] px-[clamp(16px,4vw,64px)] bg-[rgba(253,246,227,0.5)]">
        <div className="mx-auto flex w-full max-w-[1380px] items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-full border border-[rgba(74,38,24,0.15)] bg-white/80 px-4 text-xs font-black text-[var(--home-brown)] shadow-sm transition-all hover:bg-[var(--home-brown)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-brown)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
