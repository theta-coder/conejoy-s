"use client";

import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Toast from "@/components/Toast";
import { CartProvider } from "@/context/CartContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return children;

  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <FloatingWhatsApp />
      <Toast />
    </CartProvider>
  );
}
