"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  Menu as MenuIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import HomeCartButton from "@/components/HomeCartButton";
import BrandLogo from "@/components/BrandLogo";
import { BRAND } from "@/data/brand";

interface NavLinkItem {
  label: string;
  href: string;
  targetId?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DESKTOP_NAV_LINKS: Array<Omit<NavLinkItem, "icon">> = [
  { label: "Home", href: "/#home", targetId: "home" },
  { label: "Categories", href: "/#categories", targetId: "categories" },
  { label: "Flavours", href: "/#flavours", targetId: "flavours" },
  { label: "Prices", href: "/#prices-teaser", targetId: "prices-teaser" },
  { label: "About", href: "/#about", targetId: "about" },
  { label: "Visit Us", href: "/#visit", targetId: "visit" },
  { label: "Menu", href: "/menu" },
];

const MOBILE_NAV_LINKS: NavLinkItem[] = [
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Visit Us", href: "/#visit", targetId: "visit", icon: MapPin },
];

const MOBILE_DRAWER_LINKS = DESKTOP_NAV_LINKS.slice(0, 5);

export default function HomeHeader() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileNavOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetId?: string
  ) => {
    if (targetId && (pathname === "/" || pathname === "")) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        window.history.pushState(null, "", href);
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = targetId;
      }
    }
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(74,38,24,0.12)] bg-[#fdf6e3]/95 px-[clamp(16px,4vw,64px)] shadow-[0_10px_30px_rgba(74,38,24,0.05)] backdrop-blur-md">
        <nav
          className="mx-auto flex h-20 w-full max-w-[1380px] items-center justify-between gap-4 max-md:h-16 max-sm:gap-2"
          aria-label="Primary navigation"
        >
          {/* Horizontal brand lockup */}
          <Link
            href="/"
            className="group inline-flex shrink-0 items-center rounded-2xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618]"
            aria-label="Cone Joy's Ice Cream home"
          >
            <div className="relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <BrandLogo
                priority
                className="h-[58px] w-auto object-contain drop-shadow-sm max-md:h-12 max-sm:h-10"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-0.5 rounded-full border border-[#4a2618]/10 bg-white/70 p-1.5 shadow-inner backdrop-blur-sm lg:flex">
            {DESKTOP_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                className="inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-full px-3.5 text-[0.78rem] font-bold text-[#4a2618]/80 transition-all duration-200 hover:bg-[#4a2618] hover:text-white active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2618] xl:px-4 xl:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile shortcuts, cart and drawer trigger */}
          <div className="flex shrink-0 items-center gap-3 max-sm:gap-1.5">
            <div className="flex items-center gap-2 max-sm:gap-1.5 lg:hidden">
              {MOBILE_NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                    aria-label={link.label}
                    title={link.label}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4a2618]/25 bg-white text-[#4a2618] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618] max-sm:h-10 max-sm:w-10"
                  >
                    <Icon className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            <HomeCartButton />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation"
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-navigation-drawer"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4a2618]/30 bg-[#4a2618] text-[#fdf6e3] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4a2618] max-sm:h-10 max-sm:w-10 lg:hidden"
            >
              <MenuIcon className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          isMobileNavOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMobileNavOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={closeMobileNav}
          aria-label="Close navigation"
          className={`absolute inset-0 bg-[#2b160e]/45 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
            isMobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          ref={drawerRef}
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col border-l border-[#4a2618]/15 bg-[#fdf6e3] shadow-[-24px_0_60px_rgba(74,38,24,0.2)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isMobileNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex min-h-20 items-center justify-between border-b border-[#4a2618]/12 px-5 max-md:min-h-16">
            <BrandLogo className="h-11 w-auto object-contain" />

            <button
              ref={closeButtonRef}
              type="button"
              tabIndex={isMobileNavOpen ? 0 : -1}
              onClick={closeMobileNav}
              aria-label="Close navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4a2618]/25 bg-white text-[#4a2618] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2618]"
            >
              <X className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="More navigation">
            <p className="px-3 pb-3 text-xs font-black uppercase tracking-[0.14em] text-[#4a2618]/55">
              Explore ConeJoy&apos;s
            </p>
            <div className="grid gap-2">
              {MOBILE_DRAWER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  tabIndex={isMobileNavOpen ? 0 : -1}
                  onClick={(e) => {
                    handleNavClick(e, link.href, link.targetId);
                    setIsMobileNavOpen(false);
                  }}
                  className="group flex min-h-14 items-center justify-between rounded-2xl border border-transparent px-4 text-base font-extrabold text-[#4a2618] transition-colors duration-200 hover:border-[#4a2618]/12 hover:bg-white active:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2618]"
                >
                  <span>{link.label}</span>
                  <ChevronRight
                    className="h-5 w-5 stroke-[2.2] text-[#4a2618]/45 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </nav>

        </aside>
      </div>
    </>
  );
}
