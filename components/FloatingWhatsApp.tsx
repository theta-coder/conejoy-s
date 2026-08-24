"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/923407258700?text=Assalam-o-Alaikum%20Cone%20Joy%27s%2C%20I%20would%20like%20to%20place%20an%20order.";

export default function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Quick WhatsApp order"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[var(--home-brown,#4a2618)] text-white shadow-[0_10px_25px_rgba(74,38,24,0.35)] transition-all duration-300 hover:scale-110 hover:bg-[#381c11] hover:shadow-[0_14px_30px_rgba(74,38,24,0.5)] active:scale-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-brown,#4a2618)]"
        aria-label="Chat with Cone Joy's on WhatsApp to order"
      >
        <MessageCircle className="h-7 w-7 stroke-[2.2] transition-transform duration-300 group-hover:rotate-12" />
        <span className="sr-only">Order on WhatsApp</span>
      </a>
    </aside>
  );
}
