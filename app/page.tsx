"use client";

import { useEffect } from "react";
import HomeCategories from "@/components/HomeCategories";
import HomeContact from "@/components/HomeContact";
import HomePriceTeaser from "@/components/HomePriceTeaser";
import HomeFlavours from "@/components/HomeFlavours";
import HomeFooter from "@/components/HomeFooter";
import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";
import HomeHowToOrder from "@/components/HomeHowToOrder";
import HomeWhyUs from "@/components/HomeWhyUs";

export default function Home() {
  // Smooth scroll to target section if hash (e.g., #visit) is in the URL on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, []);

  return (
    <div className="home-page min-h-[100dvh] overflow-x-clip bg-[var(--home-cream)] text-[var(--home-brown)]">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeCategories />
        <HomeFlavours />
        <HomePriceTeaser />
        <HomeHowToOrder />
        <HomeWhyUs />
        <HomeContact />
      </main>
      <HomeFooter />
    </div>
  );
}
