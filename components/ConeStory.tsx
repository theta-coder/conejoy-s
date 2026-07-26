"use client";

import React, { useEffect, useRef, useState } from "react";
import { FLAVOURS } from "@/data/flavours";

export default function ConeStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const coneRefs = useRef<(HTMLImageElement | null)[]>([]);
  const flavourRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(-1);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Progressive preloading of adjacent assets
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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render() {
      if (!storyRef.current) return;
      const story = storyRef.current;
      const scrollRange = story.offsetHeight - window.innerHeight;
      const rawProgress =
        scrollRange > 0
          ? clamp(-story.getBoundingClientRect().top / scrollRange, 0, 1)
          : 0;

      const progressFloat = rawProgress * (FLAVOURS.length - 1);
      const nextActive = clamp(Math.round(progressFloat), 0, FLAVOURS.length - 1);

      if (reduceMotion) {
        if (nextActive !== activeIndexRef.current) {
          activeIndexRef.current = nextActive;
          setActiveIndex(nextActive);

          coneRefs.current.forEach((cone, idx) => {
            if (!cone) return;
            const isActive = idx === nextActive;
            cone.style.opacity = isActive ? "1" : "0";
            cone.style.visibility = isActive ? "visible" : "hidden";
            cone.style.transform = "translate3d(0, 0, 0) scale(1)";
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

          story.style.backgroundColor = FLAVOURS[nextActive].color;
        }
      } else {
        const isCompactMobile = window.innerWidth <= 480;
        const isMobile = window.innerWidth <= 820;

        const angleStepDeg = isCompactMobile ? 34 : isMobile ? 36 : 38;
        const yRadiusPercent = isCompactMobile ? 66 : isMobile ? 74 : 100;
        const xRadiusPercent = isCompactMobile ? 170 : isMobile ? 190 : 220;
        const maxRotationDeg = isCompactMobile ? 16 : 20;

        coneRefs.current.forEach((cone, idx) => {
          if (!cone) return;
          const dist = idx - progressFloat;
          const absDist = Math.abs(dist);

          if (absDist > 2.2) {
            cone.style.opacity = "0";
            cone.style.visibility = "hidden";
            cone.style.transform = "translate3d(-100%, 0, 0) scale(0.3)";
            cone.setAttribute("aria-hidden", "true");
          } else {
            cone.style.visibility = "visible";
            cone.setAttribute(
              "aria-hidden",
              String(Math.round(progressFloat) !== idx)
            );

            const angleDeg = dist * angleStepDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            const yOffset = Math.sin(angleRad) * yRadiusPercent;
            const xOffset = -(1 - Math.cos(angleRad)) * xRadiusPercent;

            const rotation = clamp(dist * maxRotationDeg, -35, 35);
            const scale = Math.max(0.32, 1 - absDist * 0.35);
            const opacity = clamp(1 - absDist * 0.45, 0, 1);
            const zIndex = Math.round(10 - absDist * 4);

            cone.style.opacity = opacity.toFixed(3);
            cone.style.transform = `translate3d(${xOffset.toFixed(
              2
            )}%, ${yOffset.toFixed(2)}%, 0) rotate(${rotation.toFixed(
              2
            )}deg) scale(${scale.toFixed(3)})`;
            cone.style.zIndex = String(zIndex);
          }
        });

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
            flavourRefs.current[nextActive]?.animate(
              [
                { opacity: 0, transform: "translate3d(14px, -50%, 0)" },
                { opacity: 1, transform: "translate3d(0, -50%, 0)" },
              ],
              { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
            );
          }

          story.style.backgroundColor = FLAVOURS[nextActive].color;
        }
      }

      ticking = false;
    }

    function requestRender() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    }

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    render();

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
    };
  }, []);

  const handleDotClick = (index: number) => {
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
  };

  return (
    <div
      ref={storyRef}
      id="flavours"
      className="scroll-story relative h-[1200svh] bg-bg transition-colors duration-500 ease-custom"
    >
      <main className="hero sticky top-0 min-h-[100svh] grid grid-rows-[auto_1fr_auto] overflow-hidden isolate">
        {/* Background Ring */}
        <div
          className="absolute w-[43vw] aspect-square -right-[11vw] -top-[15vw] border border-line rounded-full shadow-[0_0_0_7vw_rgba(255,255,255,0.11),0_0_0_14vw_rgba(255,255,255,0.07)] -z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav
          className="nav w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto flex items-center justify-between min-h-[96px] max-md:min-h-[68px] max-sm:min-h-[60px] border-b border-line"
          aria-label="Primary navigation"
        >
          <a
            className="brand inline-flex items-center text-current no-underline"
            href="#flavours"
            aria-label="Cone Joy's Ice Cream home"
          >
            <picture>
              <source srcSet="/assets/conejoys-logo.webp" type="image/webp" />
              <img
                className="brand-logo block w-[110px] max-md:w-[92px] max-sm:w-[80px] h-auto"
                src="/assets/conejoys-logo.png"
                alt="Cone Joy's Ice Cream"
                width={110}
                height={85}
                loading="eager"
                decoding="sync"
              />
            </picture>
          </a>
          <a
            className="order-link text-[0.88rem] max-sm:text-[0.78rem] font-bold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.32)] focus-visible:outline-offset-4"
            href="https://wa.me/923044490480"
            target="_blank"
            rel="noreferrer"
          >
            Order online
          </a>
        </nav>

        {/* Hero Grid */}
        <div className="hero-grid w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto grid grid-cols-[minmax(280px,0.72fr)_minmax(440px,1.28fr)] max-md:grid-cols-1 items-center gap-[clamp(28px,6vw,100px)] max-md:gap-[clamp(8px,1.5vh,16px)] min-h-0 py-0 max-md:py-[2px] max-md:content-center">
          {/* Copy section */}
          <section
            className="copy relative z-[3] self-center max-md:text-center max-md:-translate-y-4 max-sm:-translate-y-6"
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
              Scroll your{" "}
              <span className="outline block mt-[0.08em] pb-[0.06em] text-transparent leading-[0.9] text-stroke-ink">
                flavour.
              </span>
            </h1>
            <p className="lead max-w-[390px] max-md:max-w-[330px] max-sm:max-w-[300px] mt-[26px] max-md:mt-[4px] max-sm:mt-[2px] mx-0 max-md:mx-auto mb-0 text-[1rem] max-md:text-[0.84rem] max-sm:text-[0.78rem] leading-[1.6] max-md:leading-[1.32] max-sm:leading-[1.28]">
              From familiar favourites to something new, your next scoop is waiting.
            </p>
            <div className="scroll-cue inline-flex max-md:hidden items-center gap-[10px] mt-[25px] text-[0.74rem] font-extrabold tracking-[0.12em] uppercase">
              <span
                className="mouse w-[22px] h-[34px] border-[1.5px] border-current rounded-full grid place-items-start place-content-center pt-[7px] after:content-[''] after:w-[3px] after:h-[7px] after:rounded-full after:bg-current"
                aria-hidden="true"
              />
              Scroll to discover
            </div>
          </section>

          {/* Stage section */}
          <section
            className="stage relative h-[min(72svh,730px)] max-md:h-[clamp(210px,34svh,340px)] max-sm:h-[clamp(190px,30svh,270px)] max-md:mt-3 max-sm:mt-4 min-w-0 max-md:flex max-md:items-center max-md:justify-center"
            aria-label="Scroll-controlled ice cream flavours"
          >
            {/* White circle disc */}
            <div
              className="stage-disc absolute w-[min(48vw,650px)] max-md:w-[min(72vw,min(34svh,320px))] max-sm:w-[min(68vw,min(32svh,270px))] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel shadow-[inset_0_0_0_1px_rgba(21,21,15,0.08),0_35px_90px_rgba(45,45,20,0.12)] before:content-[''] before:absolute before:inset-[8%] before:border before:border-dashed before:border-[rgba(21,21,15,0.16)] before:rounded-full"
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
                    className="cone absolute w-[min(34vw,440px)] max-md:w-[min(60vw,min(32svh,270px))] max-sm:w-[min(56vw,min(30svh,230px))] h-[80%] max-md:h-full object-contain translate-3d-0 rotate-0 scale-100 filter drop-shadow-[0_22px_18px_rgba(52,39,22,0.2)] will-change-[transform,opacity] pointer-events-none select-none origin-center"
                    src={item.imageSrc}
                    alt={item.alt}
                    loading={idx <= 1 ? "eager" : "lazy"}
                    decoding={idx === 0 ? "sync" : "async"}
                    data-color={item.color}
                  />
                </picture>
              ))}
            </div>

            {/* Flavour Text Stack */}
            <div
              className="flavour-stack absolute right-[6%] max-md:right-[4%] top-1/2 max-md:top-[68%] w-[180px] max-md:w-[140px] max-sm:w-[120px] -translate-y-1/2 z-[4]"
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
                  className="flavour absolute top-1/2 right-0 w-full translate-x-[18px] -translate-y-1/2 will-change-[opacity,transform] text-right"
                >
                  <span className="flavour-index block mb-[9px] max-sm:mb-[3px] text-[0.68rem] max-sm:text-[0.6rem] font-extrabold tracking-[0.14em]">
                    {item.indexLabel}
                  </span>
                  <strong className="flavour-name block text-[clamp(1.35rem,2vw,2rem)] max-md:text-[1.15rem] max-sm:text-[1.05rem] font-extrabold leading-[0.95] tracking-[-0.06em]">
                    {item.name}
                  </strong>
                </div>
              ))}
            </div>

            {/* Progress Dot Rail */}
            <div className="progress absolute right-[1%] max-md:right-[6px] max-sm:right-[4px] top-1/2 -translate-y-1/2 grid gap-[6px]">
              {FLAVOURS.map((item, idx) => (
                <button
                  key={item.id}
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
                  className="progress-dot appearance-none cursor-pointer w-[3.5px] border-0 p-0 transition-all duration-200 ease-custom focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.45)] focus-visible:outline-offset-4"
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer line */}
        <div className="footer-line w-[min(1380px,calc(100%-64px))] max-sm:w-[calc(100%-24px)] mx-auto min-h-[72px] max-md:min-h-[52px] max-sm:min-h-[48px] border-t border-line flex items-center justify-between text-[0.72rem] max-md:text-[0.68rem] max-sm:text-[0.62rem] font-bold tracking-[0.08em] uppercase">
          <span className="footer-label max-md:hidden">
            Freshly scooped in Pakistan
          </span>
          <span className="counter tabular-nums">
            Flavour{" "}
            <b id="current">
              {String(activeIndex + 1).padStart(2, "0")}
            </b>{" "}
            / 12
          </span>
          <a
            className="button inline-flex items-center min-h-[42px] max-sm:min-h-[36px] px-[17px] max-sm:px-[14px] text-panel bg-ink rounded-full text-[0.72rem] max-sm:text-[0.68rem] no-underline transition-transform duration-180 ease-custom hover:-translate-y-[2px] active:scale-[0.97] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(21,21,15,0.32)] focus-visible:outline-offset-4"
            href="https://wa.me/923044490480?text=Hi%20Cone%20Joys%2C%20I%20would%20like%20to%20order%20a%20cone."
            target="_blank"
            rel="noreferrer"
          >
            Get this scoop
          </a>
        </div>
      </main>
    </div>
  );
}
