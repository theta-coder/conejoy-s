"use client";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

export default function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-14 items-center gap-3 rounded-full bg-[var(--home-brown,#4a2618)] px-4 py-2 text-white shadow-[0_10px_30px_rgba(74,38,24,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(74,38,24,0.45)] active:translate-y-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown,#4a2618)]"
        aria-label="Contact ConeJoy's on WhatsApp"
      >
        {/* Pulse Effect */}
        <span className="absolute -inset-0.5 rounded-full bg-[var(--home-brown,#4a2618)] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--home-golden,#faa926)] text-[var(--home-brown,#4a2618)] shadow-sm transition-transform duration-300 group-hover:scale-110">
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
        </div>

        {/* Text Label */}
        <span className="pr-1 text-xs font-black uppercase tracking-wider text-white max-sm:hidden">
          Contact Us
        </span>
      </a>
    </aside>
  );
}
