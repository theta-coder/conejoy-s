import ConeStory from "@/components/ConeStory";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";

export default function Home() {
  return (
    <CartProvider>
      <ConeStory />
      <CartDrawer />
      <Toast />
    </CartProvider>
  );
}
