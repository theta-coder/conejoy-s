import HomeCategories from "@/components/HomeCategories";
import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <div className="home-page min-h-[100dvh] overflow-x-clip bg-bg text-ink">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeCategories />
      </main>
    </div>
  );
}
