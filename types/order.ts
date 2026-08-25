export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  type: "Cone" | "Cup" | "Pack" | "Shake";
  flavour: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  flavourBreakdownText?: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  source: "whatsapp" | "admin_manual" | "website";
  createdAt: string;
  updatedAt: string;
}
