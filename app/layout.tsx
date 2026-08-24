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

/* The old title described a scroll-hero concept the site no longer has, and it
   named neither the city nor the product — the two things someone searching
   "ice cream near me in Lahore" is matching on. This is the first line of every
   Google result and every WhatsApp link preview, so it states what is sold,
   where, and the one fact that separates this shop from the rest: it is open
   till midnight. */
export const metadata: Metadata = {
  title: "Cone Joy's | Ice Cream Cones, Cups & Shakes in Chung, Lahore",
  description:
    "Twelve flavours of ice cream, served as cones, cups and thick shakes. Open 12 PM to 12 AM in Chung, Lahore, with delivery on WhatsApp.",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cone Joy's | Ice Cream Cones, Cups & Shakes in Chung, Lahore",
    description:
      "Twelve flavours of ice cream, served as cones, cups and thick shakes. Open 12 PM to 12 AM in Chung, Lahore, with delivery on WhatsApp.",
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
