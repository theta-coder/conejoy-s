import { FLAVOURS } from "@/data/flavours";

export const CONE_PRICING = {
  price: 100,
  originalPrice: 150,
  saving: 50,
} as const;

export const NORMAL_CUP_OPTIONS = [
  { id: "small-cup", name: "Small Cup", scoops: 2, price: 160, originalPrice: 200, saving: 40 },
  { id: "medium-cup", name: "Medium Cup", scoops: 3, price: 220, originalPrice: 300, saving: 80 },
  { id: "large-cup", name: "Large Cup", scoops: 4, price: 290, originalPrice: 400, saving: 110 },
] as const;

export const PACK_OPTIONS = [
  { id: "small-pack", name: "6-Scoop Pack", scoops: 6, price: 420, originalPrice: 600, saving: 180 },
  { id: "family-pack", name: "12-Scoop Family Pack", scoops: 12, price: 820, originalPrice: 1200, saving: 380 },
] as const;

export const CUP_SERVING_OPTIONS = [
  ...NORMAL_CUP_OPTIONS,
  ...PACK_OPTIONS,
] as const;

const SHAKE_NOTES: Record<string, string> = {
  mango: "Golden mango, cream, pistachio finish",
  kulfa: "Cardamom kulfa, almond, pistachio",
  chocolate: "Deep cocoa, chocolate chips, cream",
  blueberry: "Black currant, berry ribbon, cream",
  "caramel-crunch": "Caramel ribbon, golden crunch, cream",
  "tutti-frutti": "Fruit cream, candied fruit, soft vanilla",
  "coffee-chino": "Espresso, ice cream, roasted coffee crumb",
  pistachio: "Pistachio cream, fine nut finish",
  vanilla: "Vanilla bean, chilled cream, soft whip",
  strawberry: "Strawberry cream, berry ribbon, fruit crumb",
  "coconut-delight": "Coconut cream, toasted coconut finish",
  "kit-kat": "Milk chocolate, wafer crunch, cocoa ribbon",
};

const SHAKE_FILE_IDS: Record<string, string> = {
  chocolate: "chocolate-chip",
  blueberry: "black-currant",
  pistachio: "pista",
};

export const SHAKE_FLAVOURS = FLAVOURS.map((flavour) => {
  const fileId = SHAKE_FILE_IDS[flavour.id] ?? flavour.id;
  return {
    id: flavour.id,
    name: flavour.name,
    note: SHAKE_NOTES[flavour.id],
    image: `/assets/shakes/${fileId}.webp`,
    fallback: `/assets/shakes/${fileId}.png`,
    accent: flavour.color,
  };
});

export const SHAKE_SIZES = {
  Regular: { volume: "12 oz", price: 420, originalPrice: 520 },
  Large: { volume: "16 oz", price: 520, originalPrice: 650 },
} as const;

export type ShakeSize = keyof typeof SHAKE_SIZES;

export const formatRupees = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-PK")}`;
