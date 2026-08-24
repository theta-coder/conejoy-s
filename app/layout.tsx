import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Cone Joys | Scroll the Flavours",
  description: "Scroll through twelve signature Cone Joys flavours, one delicious scoop at a time.",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cone Joys | Scroll the Flavours",
    description: "Scroll through twelve signature Cone Joys flavours, one delicious scoop at a time.",
    type: "website",
  },
};

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${manrope.variable} antialiased m-0 text-ink font-sans overflow-x-hidden`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingWhatsApp />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
