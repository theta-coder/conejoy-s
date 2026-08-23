"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FLAVOURS, FlavourItem } from "@/data/flavours";
import CategoryBar from "@/components/CategoryBar";
import { useCart } from "@/context/CartContext";

const CONE_AUTO_ADVANCE_MS = 3500;
const CONE_PRICE = 100;
const CONE_ORIGINAL_PRICE = 150;
const CONE_SAVING = 50;

export default function ConeStory() {
  const router = useRouter();
  const { totalCount, setIsCartOpen, addToCart } = useCart();

  const [coneQuantities, setConeQuantities] = useState<Record<string, number>>({});
  const [isConeAdded, setIsConeAdded] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const coneRefs = useRef<(HTMLImageElement | null)[]>([]);
  const flavourRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Prefetch /cups route for instant transition
  useEffect(() => {
    router.prefetch("/cups");
  }, [router]);

  const storyTopRef = useRef<number>(0);
  const scrollRangeRef = useRef<number>(1);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(-1);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSelectedIndex, setSearchSelectedIndex] = useState<number>(-1);
  const [searchCategory, setSearchCategory] = useState<"cones" | "cups" | "shakes">("cones");
  const [cupSearchIndex, setCupSearchIndex] = useState<number>(0);
  const [cupSearchRequestKey, setCupSearchRequestKey] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [randomIndices, setRandomIndices] = useState<number[]>([0, 1, 2, 3, 4]);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  const activeCone = FLAVOURS[activeIndex];
  const coneQty = coneQuantities[activeCone?.id] || 1;

  const handleConeQtyChange = (delta: number) => {
    if (!activeCone) return;
    setConeQuantities((prev) => {
      const cur = prev[activeCone.id] || 1;
      return { ...prev, [activeCone.id]: Math.max(1, Math.min(10, cur + delta)) };
    });
  };

  const handleAddConeToCart = () => {
    if (!activeCone) return;
    addToCart({
      type: "Cone",
      flavourId: activeCone.id,
      flavour: activeCone.name,
      quantity: coneQty,
      size: "Single Scoop",
      servingId: "single-cone",
      scoopCount: 1,
      unitPrice: CONE_PRICE,
      originalPrice: CONE_ORIGINAL_PRICE,
      saving: CONE_SAVING,
      image: activeCone.imageSrc,
      color: activeCone.color,
    });
    setIsConeAdded(true);
    setTimeout(() => setIsConeAdded(false), 1800);
  };

  // Load recent flavours from localStorage on mount & generate random indices fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem("conejoys_recent");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentIds(parsed);
      }
    } catch {}

    // Generate random 5 indices for initial fallback
    const indices = Array.from({ length: FLAVOURS.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setRandomIndices(indices.slice(0, 5));
  }, []);

  // Save selected flavour to recent localStorage
  const saveRecent = useCallback((id: string) => {
    try {
      setRecentIds((prev) => {
        const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5);
        localStorage.setItem("conejoys_recent", JSON.stringify(next));
        return next;
      });
    } catch {}
  }, []);

  // Search suggestions: Recent flavours if available, else random 5 flavours
  const displaySuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const matches = FLAVOURS.map((f, i) => ({ ...f, originalIndex: i }))
        .filter((f) => f.name.toLowerCase().includes(q))
        .slice(0, 5);
      return { list: matches, title: "Search Results" };
    }

    if (recentIds.length > 0) {
      const list: { id: string; name: string; indexLabel: string; color: string; originalIndex: number }[] = [];
      recentIds.forEach((id) => {
        const idx = FLAVOURS.findIndex((f) => f.id === id);
        if (idx !== -1) {
          list.push({ ...FLAVOURS[idx], originalIndex: idx });
        }
      });
      // Fill remaining up to 5 with random flavours
      if (list.length < 5) {
        FLAVOURS.forEach((f, idx) => {
          if (list.length < 5 && !list.some((item) => item.originalIndex === idx)) {
            list.push({ ...f, originalIndex: idx });
          }
        });
      }
      return { list: list.slice(0, 5), title: "Recently Viewed" };
    }

    // Default: 5 Random flavours
    const list = randomIndices.map((idx) => ({
      ...FLAVOURS[idx],
      originalIndex: idx,
    }));
    return { list, title: "Discover Flavours" };
  }, [searchQuery, recentIds, randomIndices]);

  const filteredFlavours = displaySuggestions.list;

  // Reset keyboard selected index when searchQuery changes
  useEffect(() => {
    setSearchSelectedIndex(-1);
  }, [searchQuery]);

  // Search: scroll to a flavour by index with exact snap-lock
  const scrollToFlavour = useCallback(
    (idx: number) => {
      if (!storyRef.current) return;
      const story = storyRef.current;
      const rect = story.getBoundingClientRect();
      const storyTop = window.scrollY + rect.top;
      const scrollRange = Math.max(1, story.offsetHeight - window.innerHeight);
      const targetScroll = Math.round(
        storyTop + (idx / (FLAVOURS.length - 1)) * scrollRange
      );

      // Smooth scroll first
      window.scrollTo({ top: targetScroll, behavior: "smooth" });

      // Ensure exact snap landing on mobile when smooth scroll decelerates
      const snapToTarget = () => {
        if (Math.abs(window.scrollY - targetScroll) > 1) {
          window.scrollTo({ top: targetScroll, behavior: "auto" });
        }
      };

      let timer: NodeJS.Timeout | null = null;
      const handleScrollEnd = () => {
        snapToTarget();
        if (timer) clearTimeout(timer);
        window.removeEventListener("scrollend", handleScrollEnd);
      };

      window.addEventListener("scrollend", handleScrollEnd, { once: true });
      timer = setTimeout(() => {
        snapToTarget();
        window.removeEventListener("scrollend", handleScrollEnd);
      }, 450);

      setSearchQuery("");
      setSearchOpen(false);
      setSearchSelectedIndex(-1);
      if (FLAVOURS[idx]) {
        saveRecent(FLAVOURS[idx].id);
      }
    },
    [saveRecent]
  );

  const selectSearchResult = useCallback(
    (idx: number) => {
      if (searchCategory === "cups" || searchCategory === "shakes") {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setSearchQuery("");
        setSearchOpen(false);
        setSearchSelectedIndex(-1);
        if (FLAVOURS[idx]) saveRecent(FLAVOURS[idx].id);
        router.push(searchCategory === "shakes" ? `/shakes?select=${idx}` : `/cups?select=${idx}`);
        return;
      }

      scrollToFlavour(idx);
    },
    [searchCategory, saveRecent, scrollToFlavour, router]
  );

  // Keyboard navigation for search (ArrowDown, ArrowUp, Enter, Escape)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || filteredFlavours.length === 0) {
      if (e.key === "ArrowDown") {
        setSearchOpen(true);
        setSearchSelectedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchSelectedIndex((prev) =>
        prev < filteredFlavours.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredFlavours.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetItemIndex =
        searchSelectedIndex >= 0 ? searchSelectedIndex : 0;
      if (filteredFlavours[targetItemIndex]) {
        selectSearchResult(filteredFlavours[targetItemIndex].originalIndex);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearchOpen(false);
      setSearchSelectedIndex(-1);
    }
  };

  // Search: close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Progressive preloading of adjacent assets without duplicate allocations
  useEffect(() => {
    const nextIdx = Math.min(activeIndex + 1, FLAVOURS.length - 1);
    const prevIdx = Math.max(activeIndex - 1, 0);

    [nextIdx, prevIdx].forEach((idx) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = FLAVOURS[idx].webpSrc;
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    let ticking = false;
    let animFrameId: number | null = null;
    let resizeTimeout: NodeJS.Timeout | null = null;
    let lastMobileFrameTime = 0;
    let lastMobileConeIndexes = new Set<number>();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const navigatorWithHints = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const connection = navigatorWithHints.connection;
    const lowPowerDevice =
      (navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4) ||
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    // Cache story measurements outside the per-frame animation loop
    function measureStory() {
      if (!storyRef.current) return;
      const story = storyRef.current;
      const rect = story.getBoundingClientRect();
      storyTopRef.current = window.scrollY + rect.top;
      scrollRangeRef.current = Math.max(1, story.offsetHeight - window.innerHeight);
    }

    function render(frameTime = 0) {
      const isMobile = window.innerWidth <= 820;

      // Cap mobile animation work at roughly 30 FPS. A skipped frame keeps the
      // latest scroll position available for the next scheduled render.
      if (isMobile && !reduceMotion && !lowPowerDevice && frameTime - lastMobileFrameTime < 32) {
        ticking = false;
        return;
      }
      if (isMobile) lastMobileFrameTime = frameTime;

      const scrollY = window.scrollY;
      const rawProgress =
        scrollRangeRef.current > 0
          ? clamp((scrollY - storyTopRef.current) / scrollRangeRef.current, 0, 1)
          : 0;

      const progressFloat = rawProgress * (FLAVOURS.length - 1);
      const nextActive = clamp(Math.round(progressFloat), 0, FLAVOURS.length - 1);

      if (reduceMotion || (isMobile && lowPowerDevice)) {
        if (nextActive !== activeIndexRef.current) {
          activeIndexRef.current = nextActive;
          setActiveIndex(nextActive);

          coneRefs.current.forEach((cone, idx) => {
            if (!cone) return;
            const isActive = idx === nextActive;
            cone.style.opacity = isActive ? "1" : "0";
            cone.style.visibility = isActive ? "visible" : "hidden";
            cone.style.transform = "translate3d(0, 0, 0) scale(1)";
            cone.style.willChange = "auto";
            cone.style.zIndex = isActive ? "10" : "0";
            cone.setAttribute("aria-hidden", String(!isActive));
          });

          flavourRefs.current.forEach((flavour, idx) => {
            if (!flavour) return;
            const isActive = idx === nextActive;
            flavour.style.opacity = isActive ? "1" : "0";
            flavour.style.visibility = isActive ? "visible" : "hidden";
            flavour.style.transform = "translate3d(0, -50%, 0)";
          });

          dotRefs.current.forEach((dot, idx) => {
            if (!dot) return;
            const isCurrent = idx === nextActive;
            dot.style.height = isCurrent ? "34px" : "14px";
            dot.style.backgroundColor = "#15150f";
            dot.style.opacity = isCurrent ? "1" : "0.25";
            dot.style.boxShadow = isCurrent ? "0 0 8px rgba(21, 21, 15, 0.4)" : "none";
          });

          if (heroRef.current) {
            heroRef.current.style.backgroundColor = FLAVOURS[nextActive].color;
          }
        }
      } else {
        const isCompactMobile = window.innerWidth <= 480;

        const angleStepDeg = isCompactMobile ? 48 : isMobile ? 44 : 38;
        const yRadiusPercent = isCompactMobile ? 88 : isMobile ? 92 : 100;
        const xRadiusPercent = isCompactMobile ? 120 : isMobile ? 140 : 220;
        const maxRotationDeg = isCompactMobile ? 12 : 18;

        const floorIndex = Math.floor(progressFloat);
        const ceilIndex = Math.ceil(progressFloat);
        const mobileConeIndexes = new Set([floorIndex, ceilIndex]);
        const coneIndexesToUpdate = isMobile
          ? new Set([...lastMobileConeIndexes, ...mobileConeIndexes])
          : new Set(FLAVOURS.map((_, idx) => idx));

        coneIndexesToUpdate.forEach((idx) => {
          const cone = coneRefs.current[idx];
          if (!cone) return;
          if (isMobile && !mobileConeIndexes.has(idx)) {
            cone.style.cssText += ";opacity:0;visibility:hidden;will-change:auto;filter:none";
            cone.setAttribute("aria-hidden", "true");
            return;
          }

          const dist = idx - progressFloat;
          const absDist = Math.abs(dist);

          if (absDist > 1.3) {
            cone.style.opacity = "0";
            cone.style.visibility = "hidden";
            cone.style.willChange = "auto";
            cone.style.transform = "translate3d(-100%, 0, 0) scale(0.3)";
            cone.setAttribute("aria-hidden", "true");
          } else {
            cone.setAttribute(
              "aria-hidden",
              String(Math.round(progressFloat) !== idx)
            );

            // Limit will-change strictly to active and immediately adjacent cones
            const shouldPromoteLayer = absDist <= 1.0;
            cone.style.willChange = shouldPromoteLayer ? "transform, opacity" : "auto";

            // Live CSS filters are expensive on mobile; desktop retains the depth effect.
            cone.style.filter = isMobile
              ? "none"
              : "drop-shadow(0 22px 18px rgba(52, 39, 22, 0.2))";

            const angleDeg = dist * angleStepDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            const yOffset = Math.sin(angleRad) * yRadiusPercent;
            const xOffset = -(1 - Math.cos(angleRad)) * xRadiusPercent;

            const rotation = clamp(dist * maxRotationDeg, -35, 35);
            const scale = Math.max(0.35, 1 - absDist * 0.35);
            const opacity = clamp(1 - Math.pow(absDist, 1.25) * 0.82, 0, 1);
            const zIndex = Math.round(10 - absDist * 4);

            if (opacity <= 0.01) {
              cone.style.opacity = "0";
              cone.style.visibility = "hidden";
            } else {
              cone.style.opacity = opacity.toFixed(3);
              cone.style.visibility = "visible";
            }
            cone.style.transform = `translate3d(${xOffset.toFixed(
              2
            )}%, ${yOffset.toFixed(2)}%, 0) rotate(${rotation.toFixed(
              2
            )}deg) scale(${scale.toFixed(3)})`;
            cone.style.zIndex = String(zIndex);
          }
        });
        if (isMobile) lastMobileConeIndexes = mobileConeIndexes;

        // Trigger React state and discrete text update strictly when active index changes
        if (nextActive !== activeIndexRef.current) {
          activeIndexRef.current = nextActive;
          setActiveIndex(nextActive);

          flavourRefs.current.forEach((flavour, idx) => {
            if (!flavour) return;
            flavour.getAnimations().forEach((anim) => anim.cancel());
            const isActive = idx === nextActive;
            flavour.style.opacity = isActive ? "1" : "0";
            flavour.style.visibility = isActive ? "visible" : "hidden";
            flavour.style.transform = "translate3d(0, -50%, 0)";
          });

          dotRefs.current.forEach((dot, idx) => {
            if (!dot) return;
            const isCurrent = idx === nextActive;
            dot.style.height = isCurrent ? "34px" : "14px";
            dot.style.backgroundColor = "#15150f";
            dot.style.opacity = isCurrent ? "1" : "0.25";
            dot.style.boxShadow = isCurrent ? "0 0 8px rgba(21, 21, 15, 0.4)" : "none";
          });

          if (flavourRefs.current[nextActive]) {
            const isMobile = window.innerWidth <= 820;
            flavourRefs.current[nextActive]?.animate(
              [
                {
                  opacity: 0,
                  transform: isMobile
                    ? "translate3d(0, -75%, 0)"
                    : "translate3d(14px, -50%, 0)",
                },
                { opacity: 1, transform: "translate3d(0, -50%, 0)" },
              ],
              { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
            );
          }

          if (heroRef.current) {
            heroRef.current.style.backgroundColor = FLAVOURS[nextActive].color;
          }
        }
      }

      ticking = false;
    }

    function requestRender() {
      if (!ticking) {
        ticking = true;
        animFrameId = requestAnimationFrame(render);
      }
    }

    function handleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        measureStory();
        requestRender();
      }, 100);
    }

    // Initial measurement
    measureStory();
    requestRender();

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  const handleDotClick = useCallback((index: number) => {
    if (!storyRef.current) return;
    const story = storyRef.current;
    const scrollRange = story.offsetHeight - window.innerHeight;
    const progress = index / (FLAVOURS.length - 1);
    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    const targetY = storyTop + progress * scrollRange;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: targetY,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  const handleNavigateToCups = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("coneLastIndex", String(activeIndexRef.current));
    }
    router.push("/cups");
  }, [router]);

  // Restore scroll position when returning from /cups or via ?select= query param.
  // The route flag is one-shot; the index remains available for later history
  // navigation without affecting an ordinary direct visit to `/`.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const selectParam = searchParams.get("select");
    const lastConeIdx = sessionStorage.getItem("coneLastIndex");
    const isReturningFromCups = sessionStorage.getItem("coneReturnFromCups") === "true";

    let targetIndex: number | null = null;
    if (selectParam !== null && !isNaN(parseInt(selectParam, 10))) {
      targetIndex = parseInt(selectParam, 10);
    } else if (isReturningFromCups && lastConeIdx !== null && !isNaN(parseInt(lastConeIdx, 10))) {
      targetIndex = parseInt(lastConeIdx, 10);
    }

    if (targetIndex !== null) {
      sessionStorage.removeItem("coneReturnFromCups");
      const target = Math.max(0, Math.min(FLAVOURS.length - 1, targetIndex));
      const timer = setTimeout(() => {
        if (!storyRef.current) return;
        const scrollRange = Math.max(1, storyRef.current.offsetHeight - window.innerHeight);
        const progress = target / (FLAVOURS.length - 1);
        const storyTop = window.scrollY + storyRef.current.getBoundingClientRect().top;
        const targetY = storyTop + progress * scrollRange;
        window.scrollTo({ top: targetY, behavior: "instant" as any });
      }, 60);

      return () => clearTimeout(timer);
    }
  }, []);

  // A final upward touch gesture continues the journey into the Cups route.
  useEffect(() => {
    if (activeIndex !== FLAVOURS.length - 1 || !storyRef.current) return;

    const story = storyRef.current;
    let touchStartY: number | null = null;
    let touchStartX: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0]?.clientX ?? null;
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX === null || touchStartY === null) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;

      if (deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX)) {
        handleNavigateToCups();
      }
    };

    story.addEventListener("touchstart", handleTouchStart, { passive: true });
    story.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      story.removeEventListener("touchstart", handleTouchStart);
      story.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, handleNavigateToCups]);

  // Wheel scroll down handler when at 12th Cone (Kit Kat)
  useEffect(() => {
    if (activeIndex !== FLAVOURS.length - 1) return;
    let lastWheelTime = 0;

    const handleWheelKitKat = (e: WheelEvent) => {
      if (e.deltaY <= 15) return;
      if (!storyRef.current) return;

      const storyRect = storyRef.current.getBoundingClientRect();
      const conesAreActive =
        storyRect.top <= 100 && storyRect.bottom >= window.innerHeight - 100;
      if (!conesAreActive) return;

      const now = Date.now();
      if (now - lastWheelTime < 1000) return;
      lastWheelTime = now;
      handleNavigateToCups();
    };

    window.addEventListener("wheel", handleWheelKitKat, { passive: true });
    return () => window.removeEventListener("wheel", handleWheelKitKat);
  }, [activeIndex, handleNavigateToCups]);

  // Auto-discover flavours for visitors who do not swipe or scroll. The timer
  // resets after every index change, and only runs while the Cones story is active.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (document.hidden || !storyRef.current || !heroRef.current || searchOpen) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const storyRect = storyRef.current.getBoundingClientRect();
      const conesAreActive = storyRect.top <= 100 && storyRect.bottom >= window.innerHeight - 100;
      if (!conesAreActive) return;

      const focusedElement = document.activeElement;
      if (
        focusedElement instanceof HTMLElement &&
        focusedElement !== document.body &&
        heroRef.current.contains(focusedElement)
      ) {
        return;
      }

      if (activeIndex < FLAVOURS.length - 1) {
        handleDotClick(activeIndex + 1);
        return;
      }

      handleNavigateToCups();
    }, CONE_AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, handleDotClick, searchOpen, handleNavigateToCups]);



  return (
    <>
      <div
        ref={storyRef}
        id="cones"
        style={{ height: "1200vh" }}
        className="scroll-story relative z-10"
      >
      <main
        ref={heroRef}
        style={{ backgroundColor: FLAVOURS[0].color }}
        className="hero sticky top-0 min-h-[100svh] pt-[var(--header-height)] grid grid-rows-[1fr_auto] overflow-hidden isolate transition-colors duration-500 ease-custom"
      >
        {/* Background Ring */}
        <div
          className="absolute w-[43vw] aspect-square -right-[11vw] -top-[15vw] border border-line rounded-full shadow-[0_0_0_7vw_rgba(255,255,255,0.11),0_0_0_14vw_rgba(255,255,255,0.07)] -z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav
          className="nav fixed top-0 left-0 z-50 w-full px-[clamp(12px,4vw,64px)] flex items-center justify-between min-h-[80px] max-md:min-h-[64px] max-sm:min-h-[56px] border-b border-line bg-[rgba(255,255,255,0.82)] backdrop-blur-md"
          aria-label="Primary navigation"
        >
          <a
            className="brand inline-flex items-center text-current no-underline"
            href="#flavours"
            aria-label="Cone Joy's Ice Cream home"
          >
            <img
              className="brand-logo block w-[110px] max-md:w-[92px] max-sm:w-[80px] h-auto"
              src="/assets/conejoys-logo-new.png"
              alt="Cone Joy's Ice Cream"
              width={500}
              height={311}
              loading="eager"
              decoding="sync"
            />
          </a>

          {/* Live Search Bar (Responsive: Large on Desktop, Slightly Larger on Mobile) */}
          <div ref={searchRef} className="relative z-20 flex-shrink mx-2.5 max-sm:mx-1">
            <div className="flex items-center gap-2 xl:w-[480px] lg:w-[380px] md:w-[280px] sm:w-[220px] w-[180px] max-xs:w-[155px] px-3.5 py-2 max-lg:py-1.5 max-sm:px-3 max-sm:py-1.5 rounded-full border border-[rgba(21,21,15,0.18)] bg-[rgba(255,255,255,0.75)] backdrop-blur-md transition-all duration-200 focus-within:border-ink focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(21,21,15,0.12)] hover:border-[rgba(21,21,15,0.3)]">
              <svg className="w-4 h-4 max-lg:w-3.5 max-lg:h-3.5 max-sm:w-3.5 max-sm:h-3.5 opacity-50 flex-shrink-0 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="shrink-0 border-r border-ink/15 pr-2 max-sm:pr-1.5 text-[0.7rem] max-sm:text-[0.68rem] font-black uppercase tracking-wide">
                {searchCategory === "cones" ? "Cones" : searchCategory === "cups" ? "Cups" : "Shakes"}
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
                className="bg-transparent outline-none border-none text-[0.86rem] max-lg:text-[0.78rem] max-sm:text-[0.74rem] font-medium w-full placeholder:text-[rgba(21,21,15,0.4)] text-ink truncate min-h-[28px]"
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
                  className="p-0.5 rounded-full hover:bg-[rgba(21,21,15,0.08)] text-[0.75rem] font-bold opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              ) : (
                <span className="max-lg:hidden text-[0.6rem] font-extrabold tracking-wider px-1.5 py-0.5 rounded border border-[rgba(21,21,15,0.15)] bg-panel/80 opacity-40 uppercase select-none pointer-events-none flex-shrink-0">
                  SEARCH
                </span>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && filteredFlavours.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(21,21,15,0.16)] border border-[rgba(21,21,15,0.1)] overflow-hidden z-50 animate-badge-pop min-w-[200px]">
                {!searchQuery.trim() && (
                  <div className="px-3.5 pt-2.5 pb-1 text-[0.6rem] font-extrabold tracking-[0.14em] uppercase opacity-40 border-b border-[rgba(21,21,15,0.05)] bg-[rgba(21,21,15,0.02)]">
                    {displaySuggestions.title}
                  </div>
                )}
                {filteredFlavours.map((item, idx) => {
                  const isSelected = idx === searchSelectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectSearchResult(item.originalIndex)}
                      onMouseEnter={() => setSearchSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 max-sm:py-2 text-left transition-colors duration-150 border-b border-[rgba(21,21,15,0.04)] last:border-b-0 cursor-pointer ${
                        isSelected
                          ? "bg-[rgba(21,21,15,0.08)] font-black"
                          : "hover:bg-[rgba(21,21,15,0.05)]"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 rounded-full flex-shrink-0 shadow-sm border border-black/10"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[0.84rem] max-lg:text-[0.78rem] max-sm:text-[0.72rem] font-bold tracking-tight text-ink">
                        {item.name}
                      </span>
                      <span className="ml-auto text-[0.65rem] max-sm:text-[0.58rem] font-extrabold tracking-[0.14em] opacity-40 uppercase">
                        {item.indexLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {searchOpen && searchQuery.trim() && filteredFlavours.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(21,21,15,0.16)] border border-[rgba(21,21,15,0.1)] z-50 px-4 py-3.5 text-center animate-badge-pop">
                <span className="text-[0.8rem] font-semibold opacity-60">No flavour found for &quot;{searchQuery}&quot;</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              className="order-link inline-flex min-h-[44px] items-center text-[0.88rem] max-sm:text-[0.78rem] font-bold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.32)] focus-visible:outline-offset-4 max-md:hidden"
              href="https://wa.me/923044490480"
              target="_blank"
              rel="noreferrer"
            >
              Order online
            </a>
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
          </div>
        </nav>

        {/* Category Navigation Bar (Cones / Cups) */}
        <CategoryBar
          onCategoryChange={setSearchCategory}
          onNavigate={(category) => {
            if (category === "cups") {
              sessionStorage.setItem("coneLastIndex", String(activeIndexRef.current));
            }
          }}
        />

        {/* Hero Grid */}
        <div className="hero-grid w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto grid grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] max-md:grid-cols-1 items-center gap-[clamp(24px,4vw,100px)] max-md:gap-[clamp(8px,1.5vh,16px)] min-h-0 py-0 max-md:py-[2px] max-md:content-center">
          {/* Copy section */}
          <section
            className="copy relative z-[3] self-center max-md:text-center max-md:mt-2 max-sm:mt-3 max-md:translate-y-0"
            aria-labelledby="hero-title"
          >
            <p className="kicker mb-[18px] max-md:mb-[6px] max-sm:mb-[4px] text-[0.72rem] max-md:text-[0.68rem] max-sm:text-[0.62rem] font-extrabold tracking-[0.16em] uppercase">
              <span
                className="inline-block w-[32px] h-[2px] mr-[10px] bg-current align-middle"
                aria-hidden="true"
              />
              12 signature flavours
            </p>
            <h1
              id="hero-title"
              className="max-w-[590px] max-md:max-w-none m-0 font-display text-[clamp(4.4rem,7.8vw,8.4rem)] max-md:text-[clamp(2.3rem,9.5vw,3.4rem)] max-sm:text-[clamp(2.0rem,9vw,3.0rem)] leading-[0.9] max-md:leading-[0.88] tracking-[-0.085em]"
            >
              <span className="hidden lg:inline">Scroll</span>
              <span className="inline lg:hidden">Swipe</span> your{" "}
              <span className="outline block mt-[0.08em] pb-[0.06em] text-transparent leading-[0.9] text-stroke-ink">
                flavour.
              </span>
            </h1>
            <p className="lead max-w-[390px] max-md:max-w-[330px] max-sm:max-w-[300px] mt-[26px] max-md:mt-[4px] max-sm:mt-[2px] mx-0 max-md:mx-auto mb-0 text-[1rem] max-md:text-[0.84rem] max-sm:text-[0.78rem] leading-[1.6] max-md:leading-[1.32] max-sm:leading-[1.28]">
              From familiar favourites to something new, your next scoop is waiting.
            </p>

            {/* Mobile Active Flavour Display + Nav Controls (Prev / Active / Next) */}
            <div className="hidden max-md:flex items-center justify-center gap-1.5 mt-3 max-sm:mt-2 mb-2 px-1 mx-auto w-full max-w-[360px] z-10">
              {/* Previous Flavour Arrow Button */}
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => handleDotClick(activeIndex - 1)}
                className={`flex min-h-[40px] items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-extrabold tracking-tight transition-all ${
                  activeIndex === 0
                    ? "opacity-20 pointer-events-none"
                    : "bg-ink/10 text-ink hover:bg-ink hover:text-panel active:scale-95 cursor-pointer shadow-sm"
                }`}
                aria-label={activeIndex > 0 ? `Previous flavour: ${FLAVOURS[activeIndex - 1].name}` : "Previous flavour"}
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="truncate max-w-[68px] max-sm:max-w-[56px]">
                  {activeIndex > 0 ? FLAVOURS[activeIndex - 1].name : "Prev"}
                </span>
              </button>

              {/* Active Badge */}
              <div
                ref={badgeRef}
                key={activeIndex}
                className="mobile-flavour-badge flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-ink text-panel shadow-md animate-badge-pop flex-shrink-0"
                aria-live="polite"
              >
                <span className="text-[0.62rem] max-sm:text-[0.58rem] font-extrabold tracking-[0.14em] opacity-80 uppercase">
                  {FLAVOURS[activeIndex].indexLabel}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-panel opacity-60" aria-hidden="true" />
                <strong className="text-[0.88rem] max-sm:text-[0.82rem] font-black tracking-tight uppercase">
                  {FLAVOURS[activeIndex].name}
                </strong>
              </div>

              {/* Next Flavour Arrow Button */}
              <button
                type="button"
                disabled={activeIndex === FLAVOURS.length - 1}
                onClick={() => handleDotClick(activeIndex + 1)}
                className={`flex min-h-[40px] items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-extrabold tracking-tight transition-all ${
                  activeIndex === FLAVOURS.length - 1
                    ? "opacity-20 pointer-events-none"
                    : "bg-ink/10 text-ink hover:bg-ink hover:text-panel active:scale-95 cursor-pointer shadow-sm"
                }`}
                aria-label={activeIndex < FLAVOURS.length - 1 ? `Next flavour: ${FLAVOURS[activeIndex + 1].name}` : "Next flavour"}
              >
                <span className="truncate max-w-[68px] max-sm:max-w-[56px]">
                  {activeIndex < FLAVOURS.length - 1 ? FLAVOURS[activeIndex + 1].name : "Next"}
                </span>
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>

          {/* Stage section */}
          <section
            className="stage relative h-[min(72svh,730px)] max-md:h-[clamp(330px,48svh,470px)] max-sm:h-[clamp(290px,44svh,410px)] max-md:mt-5 max-sm:mt-4 min-w-0 max-md:flex max-md:items-center max-md:justify-center"
            aria-label="Scroll-controlled ice cream flavours"
          >
            {/* White circle disc */}
            <div
              className="stage-disc absolute w-[min(48vw,650px)] max-md:w-[min(88vw,min(48svh,410px))] max-sm:w-[min(84vw,min(44svh,350px))] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel shadow-[inset_0_0_0_1px_rgba(21,21,15,0.08),0_35px_90px_rgba(45,45,20,0.12)] before:content-[''] before:absolute before:inset-[8%] before:border before:border-dashed before:border-[rgba(21,21,15,0.16)] before:rounded-full"
              aria-hidden="true"
            />

            {/* Cone Stack */}
            <div className="cone-stack absolute inset-0 grid place-items-center">
              {FLAVOURS.map((item, idx) => (
                <picture key={item.id} className="contents">
                  <source srcSet={item.webpSrc} type="image/webp" />
                  <img
                    ref={(el) => {
                      coneRefs.current[idx] = el;
                    }}
                    style={{
                      opacity: idx === 0 ? 1 : 0,
                      visibility: idx === 0 ? "visible" : "hidden",
                    }}
                    className="cone absolute w-[min(34vw,440px)] max-md:w-[min(78vw,min(46svh,380px))] max-sm:w-[min(74vw,min(42svh,330px))] h-[80%] max-md:h-full object-contain translate-3d-0 rotate-0 scale-100 pointer-events-none select-none origin-center"
                    src={item.imageSrc}
                    alt={item.alt}
                    width={540}
                    height={1500}
                    sizes="(max-width: 480px) 74vw, (max-width: 820px) 78vw, 34vw"
                    loading={idx <= 1 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    decoding="async"
                    data-color={item.color}
                  />
                </picture>
              ))}
            </div>

            {/* Desktop Flavour Text Stack */}
            <div
              className="flavour-stack absolute right-[6%] top-1/2 w-[180px] -translate-y-1/2 z-[4] max-md:hidden text-right"
              aria-live="polite"
            >
              {FLAVOURS.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    flavourRefs.current[idx] = el;
                  }}
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    visibility: idx === 0 ? "visible" : "hidden",
                    transform: "translate3d(0, -50%, 0)",
                  }}
                  className="flavour absolute top-1/2 right-0 max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 w-full lg:translate-x-[18px] -translate-y-1/2 will-change-[opacity,transform] text-right max-md:text-center"
                >
                  <span className="flavour-index inline-block px-2.5 py-0.5 max-md:bg-ink/10 rounded-full mb-[9px] max-sm:mb-[2px] text-[0.68rem] max-sm:text-[0.62rem] font-extrabold tracking-[0.14em]">
                    {item.indexLabel}
                  </span>
                  <strong className="flavour-name block text-[clamp(1.35rem,2vw,2rem)] max-md:text-[1.4rem] max-sm:text-[1.25rem] font-extrabold leading-[0.95] tracking-[-0.06em]">
                    {item.name}
                  </strong>
                </div>
              ))}
            </div>

            {/* Progress Dot Rail + Up/Down Arrows with Flavour Names */}
            <div className="progress absolute right-[1%] max-md:right-[6px] max-sm:right-[4px] top-1/2 -translate-y-1/2 flex flex-col items-end gap-[6px] z-[10]">
              {/* Up Arrow (Previous Flavour) */}
              <div className="group relative flex items-center justify-end mb-1">
                <span className="pointer-events-none absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-ink text-panel text-[0.68rem] max-sm:text-[0.6rem] font-extrabold tracking-wide whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-custom shadow-lg flex items-center gap-1.5">
                  <span className="opacity-60">{activeIndex > 0 ? FLAVOURS[activeIndex - 1].indexLabel : ""}</span>
                  <span>{activeIndex > 0 ? FLAVOURS[activeIndex - 1].name : "Top"}</span>
                </span>
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => handleDotClick(activeIndex - 1)}
                  aria-label={activeIndex > 0 ? `Previous flavour: ${FLAVOURS[activeIndex - 1].name}` : "First flavour reached"}
                  className={`w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full flex items-center justify-center border border-ink/20 transition-all duration-200 ${
                    activeIndex === 0
                      ? "opacity-20 pointer-events-none bg-panel/40"
                      : "bg-panel text-ink hover:bg-ink hover:text-panel shadow-sm cursor-pointer active:scale-90"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 max-sm:w-4 max-sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress Dots */}
              {FLAVOURS.map((item, idx) => (
                <div key={item.id} className="group relative flex items-center justify-end">
                  {/* Hover Tooltip Label */}
                  <span className="pointer-events-none absolute right-full mr-2.5 px-2 py-0.5 rounded bg-ink text-panel text-[0.65rem] max-sm:text-[0.58rem] font-bold tracking-wide whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200 ease-custom shadow-md">
                    {item.name}
                  </span>
                  <button
                    ref={(el) => {
                      dotRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    aria-label={`Go to ${item.name} flavour`}
                    tabIndex={0}
                    style={{
                      height: idx === activeIndex ? "34px" : "14px",
                      backgroundColor: "#15150f",
                      opacity: idx === activeIndex ? 1 : 0.25,
                      boxShadow: idx === activeIndex ? "0 0 8px rgba(21,21,15,0.4)" : "none",
                    }}
                    className="progress-dot relative appearance-none cursor-pointer w-[3.5px] border-0 p-0 transition-all duration-200 ease-custom after:absolute after:content-[''] after:-left-3 after:-right-3 after:-top-[3px] after:-bottom-[3px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.45)] focus-visible:outline-offset-4"
                  />
                </div>
              ))}

              {/* Down Arrow (Next Flavour) */}
              <div className="group relative flex items-center justify-end mt-1">
                <span className="pointer-events-none absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-ink text-panel text-[0.68rem] max-sm:text-[0.6rem] font-extrabold tracking-wide whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-custom shadow-lg flex items-center gap-1.5">
                  <span className="opacity-60">{activeIndex < FLAVOURS.length - 1 ? FLAVOURS[activeIndex + 1].indexLabel : ""}</span>
                  <span>{activeIndex < FLAVOURS.length - 1 ? FLAVOURS[activeIndex + 1].name : "End"}</span>
                </span>
                <button
                  type="button"
                  disabled={activeIndex === FLAVOURS.length - 1}
                  onClick={() => handleDotClick(activeIndex + 1)}
                  aria-label={activeIndex < FLAVOURS.length - 1 ? `Next flavour: ${FLAVOURS[activeIndex + 1].name}` : "Last flavour reached"}
                  className={`w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full flex items-center justify-center border border-ink/20 transition-all duration-200 ${
                    activeIndex === FLAVOURS.length - 1
                      ? "opacity-20 pointer-events-none bg-panel/40"
                      : "bg-panel text-ink hover:bg-ink hover:text-panel shadow-sm cursor-pointer active:scale-90"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 max-sm:w-4 max-sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer line */}
        <div className="footer-line w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto min-h-[72px] max-md:min-h-[52px] max-sm:min-h-[48px] border-t border-line flex items-center justify-between text-[0.72rem] max-md:text-[0.68rem] max-sm:text-[0.62rem] font-bold tracking-[0.08em] uppercase">
          <span className="footer-label max-md:hidden">
            Freshly scooped in Pakistan
          </span>
          <span className="counter tabular-nums max-sm:hidden">
            Flavour{" "}
            <b id="current">
              {String(activeIndex + 1).padStart(2, "0")}
            </b>{" "}
            / 12
          </span>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start justify-center min-h-[42px] max-sm:min-h-[36px] px-2.5 max-sm:px-2 rounded-xl bg-white/60 backdrop-blur-md border border-ink/10 shadow-sm leading-none" aria-label="Cone offer: original price Rs. 150, now Rs. 100, save Rs. 50">
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                <strong className="text-[0.86rem] max-sm:text-[0.8rem] tracking-normal normal-case">Rs. 100</strong>
                <span className="text-[0.62rem] max-sm:hidden text-ink/45 line-through tracking-normal normal-case">Rs. 150</span>
              </span>
              <span className="mt-1 rounded-full bg-green-700 text-white px-1.5 py-0.5 text-[0.62rem] max-sm:text-[0.6rem] font-black tracking-normal normal-case whitespace-nowrap">Save Rs. 50</span>
            </div>

            <div className="flex items-center gap-0 px-1.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md border border-[rgba(21,21,15,0.12)]">
              <button
                type="button"
                onClick={() => handleConeQtyChange(-1)}
                disabled={coneQty <= 1}
                aria-label={`Decrease ${activeCone?.name} cone quantity`}
                className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full flex items-center justify-center text-sm font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                −
              </button>
              <span className="w-6 text-center text-[0.78rem] max-sm:text-[0.7rem] font-black tabular-nums">
                {coneQty}
              </span>
              <button
                type="button"
                onClick={() => handleConeQtyChange(1)}
                disabled={coneQty >= 10}
                aria-label={`Increase ${activeCone?.name} cone quantity`}
                className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full flex items-center justify-center text-sm font-black hover:bg-ink/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddConeToCart}
              className={`inline-flex items-center gap-1.5 min-h-[42px] max-sm:min-h-[36px] px-[17px] max-sm:px-[14px] rounded-full text-[0.74rem] max-sm:text-[0.72rem] font-black uppercase tracking-wider no-underline transition-all duration-200 ease-custom hover:-translate-y-[2px] active:scale-[0.97] cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.32)] focus-visible:outline-offset-4 ${
                isConeAdded
                  ? "bg-green-700 text-white shadow-[0_4px_16px_rgba(22,101,52,0.3)] scale-[1.02]"
                  : "bg-ink text-panel"
              }`}
            >
              {isConeAdded ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added ✓</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
