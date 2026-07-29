"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryBarProps {
  onCategoryChange?: (category: "cones" | "cups") => void;
}

export default function CategoryBar({ onCategoryChange }: CategoryBarProps) {
  const pathname = usePathname();
  const activeCategory: "cones" | "cups" = pathname.startsWith("/cups") ? "cups" : "cones";

  useEffect(() => {
    onCategoryChange?.(activeCategory);
  }, [activeCategory, onCategoryChange]);

  return (
    <nav
      className="category-bar fixed top-[80px] max-md:top-[64px] max-sm:top-[56px] left-0 z-40 w-full bg-[rgba(255,255,255,0.82)] backdrop-blur-md border-b border-[rgba(21,21,15,0.08)] py-2 transition-colors duration-300"
      aria-label="Category navigation"
    >
      <div className="w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex items-center justify-center gap-2">
        <Link
          href="/"
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeCategory === "cones"
              ? "bg-ink text-panel shadow-md scale-[1.02]"
              : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
          }`}
          aria-current={activeCategory === "cones" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Cones</span>
        </Link>

        <Link
          href="/cups"
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[0.8rem] max-sm:text-[0.74rem] font-black tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
            activeCategory === "cups"
              ? "bg-ink text-panel shadow-md scale-[1.02]"
              : "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5"
          }`}
          aria-current={activeCategory === "cups" ? "page" : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-80" aria-hidden="true" />
          <span>Cups</span>
        </Link>
      </div>
    </nav>
  );
}
