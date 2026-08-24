import HomeBulkOrders from "@/components/HomeBulkOrders";
import HomeCategories from "@/components/HomeCategories";
import HomeContact from "@/components/HomeContact";
import HomeDeals from "@/components/HomeDeals";
import HomeFlavours from "@/components/HomeFlavours";
import HomeFooter from "@/components/HomeFooter";
import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";
import HomeHowToOrder from "@/components/HomeHowToOrder";
import HomeIntro from "@/components/HomeIntro";
import HomeStickyOrderBar from "@/components/HomeStickyOrderBar";
import HomeWhyUs from "@/components/HomeWhyUs";

/**
 * Home page order follows the decision a customer actually makes, in sequence:
 *
 *   Hero          promotional artwork       (existing)
 *   Intro         what this place is, in words + the page's <h1>   (new)
 *   Categories    cone, cup or shake        (existing)
 *   Flavours      which one                 (new)
 *   Deals         what it costs             (new)
 *   How to order  how do I actually buy     (new)
 *   Why us        can I trust them          (existing)
 *   Bulk orders   the bigger basket         (new)
 *   Contact       where and when            (existing)
 *
 * Every existing section is kept exactly where it was; the new ones are slotted
 * into the gaps between them. Nothing was removed or reordered.
 */
export default function Home() {
  return (
    <div className="home-page min-h-[100dvh] overflow-x-clip bg-[var(--home-cream)] text-[var(--home-brown)]">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeIntro />
        <HomeCategories />
        <HomeFlavours />
        <HomeDeals />
        <HomeHowToOrder />
        <HomeWhyUs />
        <HomeBulkOrders />
        <HomeContact />
      </main>
      <HomeFooter />

      {/* FloatingWhatsApp is already rendered site-wide from app/layout.tsx, so
          it is not repeated here. On phones globals.css hides that round button
          on this page only, because the bar below is the same action in a
          larger, labelled form — see HomeStickyOrderBar. */}
      <HomeStickyOrderBar />
    </div>
  );
}
