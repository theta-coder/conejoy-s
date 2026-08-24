"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, UtensilsCrossed } from "lucide-react";
import HomeCartButton from "@/components/HomeCartButton";

interface NavLinkItem {
  label: string;
  href: string;
  targetId?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Visit Us", href: "/#visit", targetId: "visit", icon: MapPin },
];

export default function HomeHeader() {
  const pathname = usePathname();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetId?: string
  ) => {
    if (targetId && (pathname === "/" || pathname === "")) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = targetId;
      }
    }
  };

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
                onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#4a2618]/80 transition-all duration-200 hover:bg-[#4a2618] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2618]"
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Cluster (Cart button only) */}
        <div className="flex shrink-0 items-center gap-3 max-sm:gap-2">
          <div className="flex items-center gap-2 md:hidden">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4a2618]/25 bg-white text-[#4a2618] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618]"
                >
                  <Icon className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
                </Link>
              );
            })}
          </div>

          <HomeCartButton />
        </div>
      </nav>
    </header>
  );
}
