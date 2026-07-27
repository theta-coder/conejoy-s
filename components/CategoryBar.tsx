"use client";

import React, { useEffect, useState } from "react";

interface CategoryBarProps {
  onCategoryChange?: (category: "cones" | "cups") => void;
}

export default function CategoryBar({ onCategoryChange }: CategoryBarProps) {
  const [activeCategory, setActiveCategory] = useState<"cones" | "cups">("cones");

  useEffect(() => {
    const handleScroll = () => {
      const cupsEl = document.getElementById("cups");
      if (!cupsEl) return;
      const cupsRect = cupsEl.getBoundingClientRect();
      // If top of cups section is in upper half of viewport, activate cups
      if (cupsRect.top <= window.innerHeight * 0.45) {
        setActiveCategory("cups");
        onCategoryChange?.("cups");
      } else {
        setActiveCategory("cones");
        onCategoryChange?.("cones");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onCategoryChange]);

  const scrollToSection = (id: "cones" | "cups") => {
    setActiveCategory(id);
    onCategoryChange?.(id);
    if (id === "cones") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } else if (id === "cups") {
      const cupsEl = document.getElementById("cups");
      if (cupsEl) {
        const targetTop = window.scrollY + cupsEl.getBoundingClientRect().top;
        window.scrollTo({ top: targetTop, behavior: "instant" as ScrollBehavior });
      }
    }
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
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeCategory === "cones"
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
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeCategory === "cups"
              ? "bg-ink text-panel shadow-md scale-[1.02]"
              : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
          }`}
          aria-current={activeCategory === "cups" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Cups</span>
        </button>
      </div>
    </nav>
  );
}
