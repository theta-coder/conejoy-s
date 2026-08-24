import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, UtensilsCrossed } from "lucide-react";
import HomeCartButton from "@/components/HomeCartButton";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

const NAV_LINKS = [
  { label: "Menu", href: "#categories", icon: UtensilsCrossed },
  { label: "Visit Us", href: "#visit", icon: MapPin },
] as const;

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(74,38,24,0.12)] bg-[#fdf6e3]/95 px-[clamp(16px,4vw,64px)] shadow-[0_10px_30px_rgba(74,38,24,0.05)] backdrop-blur-md">
      <nav
        className="mx-auto flex h-20 w-full max-w-[1380px] items-center justify-between gap-4 max-md:h-16"
        aria-label="Primary navigation"
      >
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618]"
          aria-label="Cone Joy's Ice Cream home"
        >
          <div className="relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/conejoys-mascot-logo.png"
              alt="Cone Joy's Ice Cream Mascot Logo"
              width={160}
              height={160}
              priority
              className="h-14 w-auto max-md:h-11 max-sm:h-10 object-contain drop-shadow-sm"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-xl font-black leading-none tracking-tight text-[#4a2618]">
              ConeJoy&apos;s
            </span>
            <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4a2618]/70">
              Scoop Shop &bull; Lahore
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-[#4a2618]/10 bg-white/70 p-1.5 shadow-inner backdrop-blur-sm">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#4a2618]/80 transition-all duration-200 hover:bg-[#4a2618] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2618]"
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Cluster */}
        <div className="flex shrink-0 items-center gap-3 max-sm:gap-2">
          <HomeCartButton />

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] px-5 max-sm:px-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(37,211,102,0.45)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
          >
            <MessageCircle className="h-4 w-4 stroke-[2.5]" />
            <span className="max-sm:hidden">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>
        </div>
      </nav>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden -mx-[clamp(16px,4vw,64px)] border-t border-[#4a2618]/10 px-[clamp(16px,4vw,64px)] bg-[#fdf6e3]/80">
        <div className="mx-auto flex w-full max-w-[1380px] items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#4a2618]/15 bg-white/90 px-4 text-xs font-bold text-[#4a2618] shadow-sm transition-all hover:bg-[#4a2618] hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
