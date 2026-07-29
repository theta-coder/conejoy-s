"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";
import CupsSection from "@/components/CupsSection";
import { useCart } from "@/context/CartContext";
import { FLAVOURS } from "@/data/flavours";

export default function CupsPage() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSelectedIndex, setSearchSelectedIndex] = useState<number>(-1);
  const [searchCategory, setSearchCategory] = useState<"cones" | "cups">("cups");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const searchRef = useRef<HTMLDivElement>(null);

  // Handle URL query param ?select=X
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const selectParam = searchParams.get("select");
    if (selectParam !== null && !isNaN(parseInt(selectParam, 10))) {
      setSelectedIndex(Math.max(0, Math.min(FLAVOURS.length - 1, parseInt(selectParam, 10))));
    }
  }, []);

  // Prefetch / route for fast return transition
  useEffect(() => {
    router.prefetch("/");
    sessionStorage.setItem("coneReturnFromCups", "true");
  }, [router]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFlavours = FLAVOURS.map((item, originalIndex) => ({
    ...item,
    originalIndex,
  })).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const selectSearchResult = (idx: number) => {
    if (searchCategory === "cones") {
      router.push(`/?select=${idx}`);
      return;
    }
    setSelectedIndex(idx);
    setSearchQuery("");
    setSearchOpen(false);
    setSearchSelectedIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || filteredFlavours.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchSelectedIndex((prev) => (prev < filteredFlavours.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredFlavours.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = searchSelectedIndex >= 0 ? searchSelectedIndex : 0;
      if (filteredFlavours[target]) {
        selectSearchResult(filteredFlavours[target].originalIndex);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink relative">
      {/* Navigation Header */}
      <nav
        className="nav fixed top-0 left-0 z-50 w-full px-[clamp(12px,4vw,64px)] flex items-center justify-between min-h-[80px] max-md:min-h-[64px] max-sm:min-h-[56px] border-b border-line bg-[rgba(255,255,255,0.82)] backdrop-blur-md"
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2.5">
          {/* Back to Cones Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-ink/10 hover:bg-ink/20 text-[0.76rem] max-sm:text-[0.7rem] font-black uppercase tracking-wider text-ink transition-colors cursor-pointer"
            aria-label="Back to Cones"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="max-sm:hidden">Cones</span>
          </Link>

          <Link href="/" className="brand inline-flex items-center text-current no-underline" aria-label="Cone Joy's Ice Cream home">
            <img
              className="brand-logo block w-[110px] max-md:w-[92px] max-sm:w-[80px] h-auto"
              src="/assets/conejoys-logo-new.png"
              alt="Cone Joy's Ice Cream"
              width={500}
              height={311}
              loading="eager"
            />
          </Link>
        </div>

        {/* Live Search Bar */}
        <div ref={searchRef} className="relative z-20 flex-shrink mx-2.5 max-sm:mx-1">
          <div className="flex items-center gap-2 xl:w-[480px] lg:w-[380px] md:w-[280px] sm:w-[220px] w-[180px] max-xs:w-[155px] px-3.5 py-2 max-lg:py-1.5 max-sm:px-3 max-sm:py-1.5 rounded-full border border-[rgba(21,21,15,0.18)] bg-[rgba(255,255,255,0.75)] backdrop-blur-md transition-all duration-200 focus-within:border-ink focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(21,21,15,0.12)] hover:border-[rgba(21,21,15,0.3)]">
            <svg className="w-4 h-4 max-lg:w-3.5 max-lg:h-3.5 opacity-50 flex-shrink-0 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="shrink-0 border-r border-ink/15 pr-2 max-sm:pr-1.5 text-[0.65rem] max-sm:text-[0.62rem] font-black uppercase tracking-wide">
              {searchCategory === "cones" ? "Cones" : "Cups"}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search flavour..."
              className="bg-transparent outline-none border-none text-[0.86rem] max-lg:text-[0.78rem] max-sm:text-[0.74rem] font-medium w-full placeholder:text-[rgba(21,21,15,0.4)] text-ink truncate"
              aria-label="Search flavours"
              autoComplete="off"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className="p-0.5 rounded-full hover:bg-[rgba(21,21,15,0.08)] text-[0.75rem] font-bold opacity-60 hover:opacity-100 flex-shrink-0"
              >
                ✕
              </button>
            ) : (
              <span className="max-lg:hidden text-[0.6rem] font-extrabold tracking-wider px-1.5 py-0.5 rounded border border-[rgba(21,21,15,0.15)] bg-panel/80 opacity-40 uppercase pointer-events-none">
                SEARCH
              </span>
            )}
          </div>

          {/* Search Dropdown */}
          {searchOpen && filteredFlavours.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(21,21,15,0.16)] border border-[rgba(21,21,15,0.1)] overflow-hidden z-50 animate-badge-pop min-w-[200px]">
              {filteredFlavours.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSearchResult(item.originalIndex)}
                  onMouseEnter={() => setSearchSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 max-sm:py-2 text-left transition-colors duration-150 border-b border-[rgba(21,21,15,0.04)] last:border-b-0 cursor-pointer ${
                    idx === searchSelectedIndex ? "bg-[rgba(21,21,15,0.08)] font-black" : "hover:bg-[rgba(21,21,15,0.05)]"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10" style={{ backgroundColor: item.color }} />
                  <span className="text-[0.84rem] font-bold text-ink">{item.name}</span>
                  <span className="ml-auto text-[0.65rem] font-extrabold opacity-40 uppercase">{item.indexLabel}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            className="order-link text-[0.88rem] max-sm:text-[0.78rem] font-bold underline-offset-4 hover:underline max-md:hidden"
            href="https://wa.me/923044490480"
            target="_blank"
            rel="noreferrer"
          >
            Order online
          </a>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-[rgba(255,255,255,0.7)] hover:bg-white hover:shadow-md transition-all flex items-center justify-center border border-[rgba(21,21,15,0.12)] cursor-pointer"
            aria-label={`View cart with ${totalCount} items`}
          >
            <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink text-panel text-[0.62rem] font-black flex items-center justify-center shadow-md animate-badge-pop">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Category Bar */}
      <CategoryBar onCategoryChange={setSearchCategory} />

      {/* Main Cups Content */}
      <main className="pt-[126px] max-md:pt-[110px] max-sm:pt-[102px]">
        <CupsSection selectedIndex={selectedIndex} />
      </main>
    </div>
  );
}
