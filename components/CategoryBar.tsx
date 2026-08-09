"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface CategoryBarProps {
  onCategoryChange?: (category: "cones" | "cups" | "shakes") => void;
  onNavigate?: (category: "cones" | "cups" | "shakes") => void;
}

export default function CategoryBar({ onCategoryChange, onNavigate }: CategoryBarProps) {
  const pathname = usePathname();
  const routeCategory = pathname.startsWith("/shakes") ? "shakes" : pathname.startsWith("/cups") ? "cups" : "cones";
  const [activeCategory, setActiveCategory] = useState<"cones" | "cups" | "shakes">(routeCategory);
  const activeCategoryRef = useRef<"cones" | "cups" | "shakes">(routeCategory);

  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        const cupsEl = document.getElementById("cups");
        const shakesEl = document.getElementById("shakes");
        const headerOffset = window.innerWidth <= 640 ? 102 : window.innerWidth <= 768 ? 110 : 126;
        let nextCategory: "cones" | "cups" | "shakes" = routeCategory;
        if (cupsEl && cupsEl.getBoundingClientRect().top <= headerOffset + 80) nextCategory = "cups";
        if (shakesEl && shakesEl.getBoundingClientRect().top <= headerOffset + 80) nextCategory = "shakes";
        if (nextCategory === activeCategoryRef.current) return;
        activeCategoryRef.current = nextCategory;
        setActiveCategory(nextCategory);
        onCategoryChange?.(nextCategory);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [onCategoryChange, routeCategory]);

  const scrollToSection = (id: "cones" | "cups" | "shakes") => {
    activeCategoryRef.current = id;
    setActiveCategory(id);
    onCategoryChange?.(id);
    onNavigate?.(id);

    // Bypass Cups scroll lock during direct navbar navigation
    if (typeof window !== "undefined") {
      (window as any).__BYPASS_CUPS_LOCK__ = true;
      setTimeout(() => {
        (window as any).__BYPASS_CUPS_LOCK__ = false;
      }, 1200);
    }

    const target = document.getElementById(id);
    if (target) {
      if (id === "cones") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const headerOffset = window.innerWidth <= 640 ? 102 : window.innerWidth <= 768 ? 110 : 126;
        const targetTop = window.scrollY + target.getBoundingClientRect().top - headerOffset + 2;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      }
      return;
    }

    window.location.href = id === "cones" ? "/" : `/${id}`;
  };

  return (
    <nav
      className="category-bar fixed top-[80px] max-md:top-[64px] max-sm:top-[56px] left-0 z-40 w-full bg-[rgba(255,255,255,0.82)] backdrop-blur-md border-b border-[rgba(21,21,15,0.08)] py-2 transition-colors duration-300"
      aria-label="Category navigation"
    >
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => scrollToSection("cones")}
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${activeCategory === "cones"
            ? "bg-ink text-panel shadow-md scale-[1.02]"
            : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
            }`}
          aria-current={activeCategory === "cones" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Cones</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("cups")}
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${activeCategory === "cups"
            ? "bg-ink text-panel shadow-md scale-[1.02]"
            : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
            }`}
          aria-current={activeCategory === "cups" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Cups</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("shakes")}
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${activeCategory === "shakes"
            ? "bg-ink text-panel shadow-md scale-[1.02]"
            : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
            }`}
          aria-current={activeCategory === "shakes" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Shakes</span>
        </button>
      </div>
    </nav>
  );
}
