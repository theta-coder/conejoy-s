"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";
import ShakeLab from "@/components/ShakeLab";
import { useCart } from "@/context/CartContext";
import { FLAVOURS } from "@/data/flavours";

type Category = "cones" | "cups" | "shakes";

export default function ShakesPage() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const [searchCategory, setSearchCategory] = useState<Category>("shakes");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectionRequestKey, setSelectionRequestKey] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const selectParam = searchParams.get("select");
    const flavourParam = searchParams.get("flavour");

    if (flavourParam) {
      const found = FLAVOURS.findIndex(
        (f) => f.id === flavourParam || f.name.toLowerCase() === flavourParam.toLowerCase()
      );
      if (found !== -1) {
        setSelectedIndex(found);
        setSelectionRequestKey((k) => k + 1);
        return;
      }
    }

    if (selectParam !== null && !Number.isNaN(Number(selectParam))) {
      setSelectedIndex(Math.max(0, Math.min(FLAVOURS.length - 1, Number(selectParam))));
      setSelectionRequestKey((k) => k + 1);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredFlavours = FLAVOURS.map((item, originalIndex) => ({ ...item, originalIndex }))
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  const selectSearchResult = (index: number) => {
    if (searchCategory === "cones") {
      router.push(`/cones?select=${index}`);
      return;
    }
    if (searchCategory === "cups") {
      router.push(`/cups?select=${index}`);
      return;
    }
    setSelectedIndex(index);
    setSelectionRequestKey((key) => key + 1);
    setSearchQuery("");
    setSearchOpen(false);
    setSearchSelectedIndex(-1);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || filteredFlavours.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSearchSelectedIndex((current) => current < filteredFlavours.length - 1 ? current + 1 : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSearchSelectedIndex((current) => current > 0 ? current - 1 : filteredFlavours.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectSearchResult(filteredFlavours[Math.max(0, searchSelectedIndex)].originalIndex);
    } else if (event.key === "Escape") {
      setSearchOpen(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-panel text-ink">
      <nav className="nav fixed left-0 top-0 z-50 flex min-h-[80px] w-full items-center justify-between border-b border-line bg-white/85 px-[clamp(12px,4vw,64px)] backdrop-blur-md max-md:min-h-[64px] max-sm:min-h-[56px]" aria-label="Primary navigation">
        <div className="flex items-center gap-2.5">
          <Link href="/cups" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-full bg-ink/10 px-3 py-1.5 text-[0.76rem] font-black uppercase tracking-wider text-ink transition-colors hover:bg-ink/20 max-sm:text-[0.7rem]" aria-label="Back to Cups">
            <span aria-hidden="true">←</span><span className="max-sm:hidden">Cups</span>
          </Link>
          <Link href="/" className="brand inline-flex items-center" aria-label="Cone Joy's Ice Cream home">
            <Image
              className="block h-auto w-[68px] max-md:w-[57px] max-sm:w-[50px]"
              src="/assets/conejoys-mascot-logo.png"
              alt="Cone Joy's Ice Cream"
              width={500}
              height={500}
              sizes="(max-width: 640px) 50px, (max-width: 768px) 57px, 68px"
              loading="eager"
            />
          </Link>
        </div>

        <div ref={searchRef} className="relative z-20 mx-2.5 flex-shrink max-sm:mx-1">
          <div className="flex w-[clamp(155px,32vw,480px)] items-center gap-2 rounded-full border border-ink/20 bg-white/80 px-3.5 py-2 transition-all focus-within:border-ink max-sm:px-3 max-sm:py-1.5">
            <span className="shrink-0 border-r border-ink/15 pr-2 text-[0.7rem] font-black uppercase tracking-wide max-sm:text-[0.68rem]">{searchCategory}</span>
            <input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onKeyDown={handleSearchKeyDown} placeholder="Search flavour..." className="w-full min-h-[28px] truncate border-0 bg-transparent text-[0.82rem] font-medium outline-none max-sm:text-[0.76rem]" aria-label={`Search ${searchCategory} flavours`} autoComplete="off" />
          </div>
          {searchOpen && filteredFlavours.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 min-w-[210px] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
              {filteredFlavours.slice(0, 6).map((item, index) => (
                <button key={item.id} type="button" onClick={() => selectSearchResult(item.originalIndex)} onMouseEnter={() => setSearchSelectedIndex(index)} className={`flex w-full items-center gap-3 border-b border-ink/5 px-3.5 py-2.5 text-left text-[0.82rem] font-bold last:border-0 ${index === searchSelectedIndex ? "bg-ink/10" : "hover:bg-ink/5"}`}>
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative h-11 w-11 shrink-0 rounded-full bg-[rgba(255,255,255,0.7)] hover:bg-white hover:shadow-md transition-all flex items-center justify-center border border-[rgba(21,21,15,0.12)] cursor-pointer"
          aria-label={`View cart with ${totalCount} items`}
        >
          <svg className="w-[18px] h-[18px] text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink text-panel text-[0.62rem] font-black flex items-center justify-center shadow-md animate-badge-pop">
              {totalCount}
            </span>
          )}
        </button>
      </nav>

      <CategoryBar onCategoryChange={setSearchCategory} />
      <main className="pt-[var(--header-height)]">
        <ShakeLab selectedIndex={selectedIndex} selectionRequestKey={selectionRequestKey} />
      </main>
    </div>
  );
}
