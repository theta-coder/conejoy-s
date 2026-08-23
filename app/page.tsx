import HomeCategories from "@/components/HomeCategories";
import HomeContact from "@/components/HomeContact";
import HomeFooter from "@/components/HomeFooter";
import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";
import HomeMenu from "@/components/HomeMenu";

export default function Home() {
  return (
    <div className="home-page min-h-[100dvh] overflow-x-clip bg-bg text-ink">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeCategories />
        <HomeMenu />
        <HomeContact />
      </main>
      <HomeFooter />
    </div>
  );
}
