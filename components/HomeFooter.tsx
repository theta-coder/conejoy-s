import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Sparkles, ExternalLink } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

const BROWSE_LINKS = [
  { label: "Cones Collection", href: "/" },
  { label: "Cups Collection", href: "/cups" },
  { label: "Shake Lab", href: "/shakes" },
  { label: "Full Menu", href: "#categories" },
] as const;

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/conejoys.official" },
  { label: "TikTok", href: "https://tiktok.com/@conejoys.official" },
  { label: "YouTube", href: "https://youtube.com/@conejoys.official" },
] as const;

export default function HomeFooter() {
  return (
    <footer className="bg-[#381c11] text-[#fffdf4] px-[clamp(16px,5vw,72px)] pt-[clamp(48px,7vw,96px)] pb-8 relative overflow-hidden">
      {/* Decorative ambient backdrop glow */}
      <div
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#faa926]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1380px] relative z-10">
        {/* Top Order Callout Banner */}
        <div className="mb-14 rounded-[32px] border border-white/15 bg-gradient-to-r from-[#faa926]/20 to-white/5 p-8 md:p-10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#faa926]/25 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#faa926] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Express Delivery in Lahore</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Craving fresh ice cream right now?
            </h3>
            <p className="mt-2 text-sm md:text-base font-medium text-white/75 leading-relaxed">
              Order your favourite cones, chilled cups, or thick hand-blended shakes straight to your door via WhatsApp.
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] px-8 text-sm font-black text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
          >
            <MessageCircle className="h-4 w-4 stroke-[2.5]" />
            <span>Order on WhatsApp</span>
          </a>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Column (4 Cols) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label="Cone Joy's Ice Cream home"
            >
              <Image
                src="/assets/conejoys-mascot-logo.png"
                alt="Cone Joy's Ice Cream"
                width={160}
                height={160}
                className="h-16 w-auto object-contain drop-shadow-md"
                loading="lazy"
              />
              <div>
                <span className="block font-display text-xl font-extrabold text-white tracking-tight">
                  ConeJoy&apos;s
                </span>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#faa926]">
                  Ice Cream
                </span>
              </div>
            </Link>
            <p className="text-sm font-medium leading-relaxed text-white/70 max-w-[320px]">
              Pure ingredients. Real happiness. Crafting Lahore&apos;s finest cones, cups, and thick shakes daily in Chung.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-extrabold text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Store Open: 12:00 PM - 12:00 AM
            </div>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#faa926] mb-4">
              Explore Menu
            </h4>
            <ul className="space-y-2.5 list-none p-0">
              {BROWSE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-white/75 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit & Location (3 Cols) */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#faa926] mb-4">
              Scoop Shop
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-white/75 list-none p-0">
              <li className="leading-snug">
                <span className="block text-white font-bold">Chung, Multan Road</span>
                <span className="text-xs text-white/60">Near Care Plus Medical Store, Lahore</span>
              </li>
              <li>
                <a
                  href="#visit"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#faa926] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions on Map</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links (2 Cols) */}
          <div className="md:col-span-12 lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#faa926] mb-4">
              Follow Us
            </h4>
            <ul className="flex lg:flex-col flex-wrap gap-3 list-none p-0">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#faa926]" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-white/60">
          <p>&copy; {new Date().getFullYear()} ConeJoy&apos;s Ice Cream. All rights reserved.</p>
          <a
            href="https://mavplo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-white/80 transition-all hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>Powered by</span>
            <span className="font-extrabold text-[#faa926]">MAVPLO</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </footer>
  );
}
