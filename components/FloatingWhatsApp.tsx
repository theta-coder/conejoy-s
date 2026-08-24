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
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:bg-[#1EBE5D] hover:shadow-[0_14px_30px_rgba(37,211,102,0.6)] active:scale-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
        aria-label="Chat with Cone Joy's on WhatsApp to order"
      >
        <MessageCircle className="h-7 w-7 stroke-[2.2] transition-transform duration-300 group-hover:rotate-12" />
        <span className="sr-only">Order on WhatsApp</span>
      </a>
    </aside>
  );
}
