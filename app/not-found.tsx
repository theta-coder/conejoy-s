import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";

export default function NotFound() {
  return (
    <div className="home-page min-h-[100dvh] overflow-x-clip bg-[var(--home-cream)] text-[var(--home-brown)] flex flex-col justify-between">
      <HomeHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="text-6xl mb-4">🍦</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--home-brown)]">
          404 - Scoop Not Found
        </h1>
        <p className="mt-3 text-base font-semibold text-[rgba(74,38,24,0.7)] max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--home-brown)] px-8 text-sm font-black text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Return to Home
        </Link>
      </main>
      <HomeFooter />
    </div>
  );
}
